// src/features/members/joinRequest.ts
import { Bot, Composer, GrammyError } from "grammY";
import { config } from "../../config/config.ts";
import { BotContext, BotFeature } from "../../utils/types.ts";
import { formatMessage } from "../../utils/messagesFormatter.ts";
import { createLogger } from "../../utils/logger.ts";

export class JoinRequestFeature implements BotFeature {
    public name = "JoinRequestPolls";
    private logger = createLogger("JoinRequestFeature");
    private composer = new Composer<BotContext>();

    constructor() {
        this.setupHandlers();
    }

    public register(bot: Bot<BotContext>): void {
        bot.use(this.composer);
    }

    private setupHandlers(): void {
        this.composer.on("chat_join_request", async (ctx) => {
            // Ensure chatJoinRequest is defined
            if (!ctx.chatJoinRequest) {
                ctx.logger.warn(
                    "Received chat_join_request event but ctx.chatJoinRequest is undefined",
                );
                return;
            }

            const user = ctx.chatJoinRequest.from;
            const chatId = ctx.chatJoinRequest.chat.id;

            ctx.logger.info(
                `Processing join request for user: ${user.id} (${user.first_name})`,
            );

            try {
                // Create and send poll
                const question = formatMessage(
                    config.messages.joinRequestQuestion,
                    {
                        firstName: user.first_name,
                    },
                );

                // Convert string array to InputPollOption array
                const pollOptions = config.joinRequests.pollOptions.map(
                    (option) => ({ text: option }),
                );

                const pollMessage = await ctx.api.sendPoll(
                    chatId,
                    question,
                    pollOptions,
                    {
                        is_anonymous: true,
                    },
                );

                // Send user profile link for reference
                const userLink = `https://t.me/${user.username || user.id}`;
                const specialChar = "\u2060"; // Invisible character for cleaner preview
                const message = `[${specialChar}](${userLink})`;

                await ctx.api.sendMessage(chatId, message, {
                    parse_mode: "Markdown",
                    link_preview_options: { show_above_text: true },
                });

                // Send confirmation message to the user
                await this.sendConfirmationMessage(ctx, user);

                // Set up timer to close the poll
                this.setupPollTimeout(
                    ctx,
                    chatId,
                    pollMessage.message_id,
                    pollMessage.poll.id,
                );

                ctx.logger.info(
                    `Join request poll created for ${user.first_name}`,
                    {
                        pollId: pollMessage.poll.id,
                        userId: user.id,
                    },
                );
            } catch (error) {
                ctx.logger.error(
                    `Failed to process join request for ${user.first_name}`,
                    error,
                );
                // Still attempt to approve the user if poll creation fails
                this.handleFailedPollCreation(ctx, user);
            }
        });
    }

    private async sendConfirmationMessage(
        ctx: BotContext,
        user: { id: number; first_name: string },
    ): Promise<void> {
        try {
            const message = formatMessage(
                config.messages.joinConfirmationTemplate,
                {
                    firstName: user.first_name,
                },
            );

            await ctx.api.sendMessage(user.id, message);
            ctx.logger.debug(`Confirmation message sent to ${user.first_name}`);
        } catch (error) {
            if (error instanceof GrammyError) {
                ctx.logger.warn(
                    `Couldn't send confirmation message to ${user.first_name}: ${error.description}`,
                );
            } else {
                ctx.logger.warn(
                    `Couldn't send confirmation message to ${user.first_name}`,
                    error,
                );
            }
            // Continue processing - this is non-critical
        }
    }

    private setupPollTimeout(
        ctx: BotContext,
        chatId: number,
        messageId: number,
        pollId: string,
    ): void {
        setTimeout(async () => {
            try {
                await ctx.api.stopPoll(chatId, messageId);
                ctx.logger.info(`Poll closed: ${pollId}`);
            } catch (error) {
                ctx.logger.error(`Failed to close poll ${pollId}`, error);
            }
        }, config.joinRequests.pollTimeoutMs);
    }

    private async handleFailedPollCreation(
        ctx: BotContext,
        user: { id: number },
    ): Promise<void> {
        ctx.logger.info(
            `Automatically accepting user ${user.id} due to poll creation failure`,
        );
        try {
            // Ensure chatJoinRequest exists
            if (!ctx.chatJoinRequest) {
                ctx.logger.error(
                    `Cannot approve user ${user.id}: chatJoinRequest is undefined`,
                );
                return;
            }

            await ctx.api.approveChatJoinRequest(
                ctx.chatJoinRequest.chat.id,
                user.id,
            );
            ctx.logger.info(
                `User ${user.id} approved due to poll creation failure`,
            );
        } catch (error) {
            ctx.logger.error(
                `Failed to approve user ${user.id} after poll creation failure`,
                error,
            );
        }
    }
}
