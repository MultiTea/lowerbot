import { Bot } from "https://deno.land/x/grammy@v1.23.0/mod.ts";
import { test } from "./test.ts";
import { newMemberPoll } from "./newMember/pollManager.ts";
import { newMemberWelcome } from "./newMember/welcomeMessage.ts";

// Fournir le token du bot
const token = Deno.env.get("BOT_TOKEN");
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

// Commandes de test
bot.use(test);

// Gestion des demandes et ajout des nouveaux membres
bot.use(newMemberPoll);
bot.use(newMemberWelcome);

bot.catch((err: Error) => {
  console.error("Error in bot:", err);
});

// TODO: Handle errors from this.
bot.start();