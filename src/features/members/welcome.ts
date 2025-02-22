// src/features/members/welcome.ts
import { Bot, Composer } from "grammY";
import { config } from "../../config/config.ts";
import { BotContext, BotFeature } from "../../utils/types.ts";
import { formatMessage } from "../../utils/messagesFormatter.ts";
import { createLogger } from "../../utils/logger.ts";

export class WelcomeFeature implements BotFeature {
    public name = "WelcomeMessages";
    private logger = createLogger("WelcomeFeature");
    private composer = new Composer<BotContext>();

    constructor() {
        this.setupHandlers();
    }

    public register(bot: Bot<BotContext>): void {
        bot.use(this.composer);
    }

    private setupHandlers(): void {
        this.composer.on("message:new_chat_members", async (ctx) => {
            const chatId = ctx.message?.chat.id;
            const member = ctx.message?.new_chat_members?.[0];

            if (!chatId || !member) {
                return;
            }

            ctx.logger.info(
                `New member joined: ${member.id} (${member.first_name})`,
            );

            try {
                // Delete the default service message
                await ctx.deleteMessage();

                // Send custom welcome message
                const username = member.first_name;
                const userLink = `https://t.me/${member.username || member.id}`;

                const welcomeMessage = formatMessage(
                    config.messages.welcomeTemplate,
                    {
                        username,
                        userLink,
                    },
                );

                await ctx.api.sendMessage(chatId, welcomeMessage, {
                    parse_mode: "Markdown",
                });

                ctx.logger.debug(`Welcome message sent for ${username}`);
            } catch (error) {
                ctx.logger.error(
                    `Failed to send welcome message for ${member.first_name}`,
                    error,
                );
            }
        });
    }
}
