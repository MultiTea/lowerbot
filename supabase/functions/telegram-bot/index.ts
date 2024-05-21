import {
  Bot,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.20.3/mod.ts";

const token = Deno.env.get("BOT_TOKEN");
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()}`));

bot.on("chat_join_request", async (ctx) => {
  const user = ctx.chatJoinRequest.from;
  const chatId = ctx.chatJoinRequest.chat.id;

  const pollOptions = ["Oui", "Non", "NA"];
  const question = `Voulez-vous ajouter ${user.first_name} ${
    user.last_name ? user.last_name : ""
  } ?`;

  await ctx.api.sendPoll(chatId, question, pollOptions, {
    is_anonymous: false,
  });

  const userLink = `https://t.me/${user.username || user.id}`;
  const specialChar = "ͺ"; // Utiliser le caractère spécial
  const message = `[${specialChar}](${userLink})`;

  await ctx.api.sendMessage(chatId, message, {
    parse_mode: "Markdown",
  });
});

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
