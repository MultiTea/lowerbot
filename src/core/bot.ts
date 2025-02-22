// src/core/bot.ts
import { Bot, GrammyError, HttpError } from "grammY";
import { config } from "../config/config.ts";
import { setupMiddleware } from "./middleware.ts";
import { createLogger } from "../utils/logger.ts";
import { BotContext, BotFeature } from "../utils/types.ts";

export class TelegramBot {
    private bot: Bot<BotContext>;
    private logger = createLogger("TelegramBot");
    private features: BotFeature[] = [];

    constructor() {
        this.bot = new Bot<BotContext>(config.telegram.token);
        setupMiddleware(this.bot);
        this.setupErrorHandling();
    }

    public registerFeature(feature: BotFeature): void {
        this.logger.info(`Registering feature: ${feature.name}`);
        this.features.push(feature);
        feature.register(this.bot);
    }

    public async start(): Promise<void> {
        this.logger.info("Starting bot...");
        this.logger.info(
            `Active features: ${this.features.map((f) => f.name).join(", ")}`,
        );

        try {
            await this.bot.start();
            this.logger.info("Bot started successfully");
        } catch (error) {
            this.logger.error("Failed to start bot", error);
            throw error;
        }
    }

    private setupErrorHandling(): void {
        this.bot.catch((err) => {
            const { ctx, error } = err;
            this.logger.error(
                `Error while handling update ${ctx.update.update_id}`,
                error,
            );

            if (error instanceof GrammyError) {
                this.logger.error(
                    `Error in request to Telegram API: ${error.description}`,
                );
            } else if (error instanceof HttpError) {
                // Log the HTTP error with the contained error object
                this.logger.error(
                    `HTTP error from Telegram API: ${error.message}`,
                    error.error,
                );
            } else {
                this.logger.error(`Unknown error: ${error}`);
            }
        });
    }
}
