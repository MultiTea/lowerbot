// src/core/middleware.ts
import { Bot, NextFunction } from "grammY";
import { BotContext } from "../utils/types.ts";
import { createLogger } from "../utils/logger.ts";

export const setupMiddleware = (bot: Bot<BotContext>): void => {
    // Add logger to context
    bot.use(async (ctx: BotContext, next: NextFunction) => {
        ctx.logger = createLogger(`Request:${ctx.chat?.id ?? "unknown"}`);

        // Get the update type by examining the ctx.update object
        const updateType = ctx.message
            ? "message"
            : ctx.editedMessage
            ? "editedMessage"
            : ctx.channelPost
            ? "channelPost"
            : ctx.editedChannelPost
            ? "editedChannelPost"
            : ctx.inlineQuery
            ? "inlineQuery"
            : ctx.chosenInlineResult
            ? "chosenInlineResult"
            : ctx.callbackQuery
            ? "callbackQuery"
            : ctx.shippingQuery
            ? "shippingQuery"
            : ctx.preCheckoutQuery
            ? "preCheckoutQuery"
            : ctx.poll
            ? "poll"
            : ctx.pollAnswer
            ? "pollAnswer"
            : ctx.myChatMember
            ? "myChatMember"
            : ctx.chatMember
            ? "chatMember"
            : ctx.chatJoinRequest
            ? "chatJoinRequest"
            : "unknown";

        ctx.logger.debug("Processing update", {
            updateId: ctx.update.update_id,
            updateType,
        });
        await next();
    });

    // Global error handling
    bot.catch((err: Error) => {
        const logger = createLogger("ErrorHandler");
        logger.error("Unhandled error in bot", err);
    });
};
