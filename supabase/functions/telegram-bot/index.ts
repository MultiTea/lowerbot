import { Bot, webhookCallback } from "grammY";
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

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  const headers = req.headers;
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== Deno.env.get("FUNCTION_SECRET")) {
      return new Response("not allowed", { status: 405 });
    }

    return await handleUpdate(req);
  } catch (err) {
    console.log(headers);
    console.error(err);
  }
  return new Response();
});
