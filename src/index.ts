// src/index.ts
import { TelegramBot } from "./core/bot.ts";
import { getMemberFeatures } from "./features/members/index.ts";
import { getModerationFeatures } from "./features/moderation/index.ts";
import { getCommandFeatures } from "./features/commands/index.ts";
import { createLogger } from "./utils/logger.ts";

const logger = createLogger("Main");

async function main() {
  try {
    logger.info("Initializing bot...");

    const bot = new TelegramBot();

    // Register all features
    const memberFeatures = getMemberFeatures();
    memberFeatures.forEach((feature) => bot.registerFeature(feature));

    const moderationFeatures = getModerationFeatures();
    moderationFeatures.forEach((feature) => bot.registerFeature(feature));

    const commandFeatures = getCommandFeatures();
    commandFeatures.forEach((feature) => bot.registerFeature(feature));

    // Start the bot
    await bot.start();

    logger.info("Bot started successfully");
  } catch (error) {
    logger.error("Failed to start bot", error);
    Deno.exit(1);
  }
}

// Handle process signals
Deno.addSignalListener("SIGINT", () => {
  logger.info("Received SIGINT signal. Shutting down...");
  Deno.exit(0);
});

Deno.addSignalListener("SIGTERM", () => {
  logger.info("Received SIGTERM signal. Shutting down...");
  Deno.exit(0);
});

// Run the application
main();
