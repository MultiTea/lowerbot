import { Bot } from "grammY";
import { commands } from "./commands.ts";
import { newMemberPoll } from "./newMember/pollManager.ts";
import { newMemberWelcome } from "./newMember/welcomeMessage.ts";

// Fournir le token du bot
const token = Deno.env.get("BOT_TOKEN");
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

// Commandes de test
bot.use(commands);

// Gestion des demandes et ajout des nouveaux membres
bot.use(newMemberPoll);
bot.use(newMemberWelcome);

bot.catch((err: Error) => {
  console.error("Error in bot:", err);
});

// TODO: Handle potential errors from this.
bot.start();
