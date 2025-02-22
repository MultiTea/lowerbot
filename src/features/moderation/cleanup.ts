// src/features/moderation/cleanup.ts
import { Bot, Composer } from "grammY";
import { BotContext, BotFeature } from "../../utils/types.ts";
import { createLogger } from "../../utils/logger.ts";

export class CleanupFeature implements BotFeature {
    public name = "CleanServiceMessages";
    private logger = createLogger("CleanupFeature");
    private composer = new Composer<BotContext>();

    constructor() {
        this.setupHandlers();
    }

    public register(bot: Bot<BotContext>): void {
        bot.use(this.composer);
    }

    private setupHandlers(): void {
        // Handle service messages that should be cleaned up
        this.composer.on([
            "message:left_chat_member",
            "message:pinned_message",
            "message:new_chat_photo",
            "message:delete_chat_photo",
            "message:new_chat_title",
        ], async (ctx) => {
            try {
                const messageType = this.getMessageType(ctx);
                ctx.logger.debug(`Cleaning up service message: ${messageType}`);

                await ctx.deleteMessage();

                ctx.logger.debug(`Service message deleted: ${messageType}`);
            } catch (error) {
                ctx.logger.error("Failed to delete service message", error);
            }
        });
    }

    private getMessageType(ctx: BotContext): string {
        if (ctx.message?.left_chat_member) return "left_chat_member";
        if (ctx.message?.pinned_message) return "pinned_message";
        if (ctx.message?.new_chat_photo) return "new_chat_photo";
        if (ctx.message?.delete_chat_photo) return "delete_chat_photo";
        if (ctx.message?.new_chat_title) return "new_chat_title";
        return "unknown";
    }
}
