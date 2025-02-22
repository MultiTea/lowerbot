// src/features/commands/status.ts
import { config } from "../../config/config.ts";
import { Bot, Composer } from "grammY";
import { BotContext, BotFeature } from "../../utils/types.ts";
import { createLogger } from "../../utils/logger.ts";

export class StatusCommandsFeature implements BotFeature {
    public name = "StatusCommands";
    private logger = createLogger("StatusCommands");
    private composer = new Composer<BotContext>();

    constructor() {
        this.setupHandlers();
    }

    public register(bot: Bot<BotContext>): void {
        bot.use(this.composer);
    }

    private setupHandlers(): void {
        this.composer.command("areyouokay", (ctx) => {
            const timeNow = new Date();
            ctx.logger.info("Status check requested");

            ctx.reply(`Up and running: ${timeNow.toUTCString()}`);
        });

        // Add more status commands as needed
        this.composer.command("version", (ctx) => {
            const version = Deno.env.get("BOT_VERSION") || "1.0.0";
            ctx.reply(`Bot version: ${version}`);
        });

        this.composer.command("features", (ctx) => {
            const enabledFeatures = Object.entries(config.features)
                .filter(([_, enabled]) => enabled)
                .map(([name]) => name)
                .join(", ");

            ctx.reply(`Enabled features: ${enabledFeatures}`);
        });
    }
}
