import {
  Bot,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.20.3/mod.ts";

const token = Deno.env.get("BOT_TOKEN");
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

interface PollData {
  chatId: number;
  pollId: string;
  createdAt: number;
}

// Stocker les informations des sondages en mémoire
const activePolls: PollData[] = [];
const welcomeMessages: { [key: number]: number } = {}; // Stocker les IDs des messages d'ajout

bot.on("chat_join_request", async (ctx) => {
  const user = ctx.chatJoinRequest.from;
  const chatId = ctx.chatJoinRequest.chat.id;

  const pollOptions = ["Oui", "Non", "NA"];
  const question = `Voulez-vous ajouter ${user.first_name} ${
    user.last_name ? user.last_name : ""
  } ?`;

  const poll = await ctx.api.sendPoll(chatId, question, pollOptions, {
    is_anonymous: true,
  });

  const userLink = `https://t.me/${user.username || user.id}`;
  const specialChar = "ͺ"; // Utiliser le caractère spécial
  const message = `[${specialChar}](${userLink})`;

  await ctx.api.sendMessage(chatId, message, {
    parse_mode: "Markdown",
  });

  // Enregistrer le sondage en mémoire
  activePolls.push({ chatId, pollId: poll.id, createdAt: Date.now() });

  // Planifier la fermeture du sondage après 24 heures
  setTimeout(async () => {
    try {
      await ctx.api.stopPoll(chatId, poll.id);
      console.log(`Le sondage ${poll.id} a été fermé automatiquement.`);
    } catch (error) {
      console.error(
        `Erreur lors de la fermeture du sondage ${poll.id}:`,
        error,
      );
    }
    // Retirer le sondage de la liste active
    const index = activePolls.findIndex((p) => p.pollId === poll.id);
    if (index !== -1) {
      activePolls.splice(index, 1);
    }
  }, 60000); // 24 heures en millisecondes
});

// Surveiller l'événement d'ajout de nouveaux membres
bot.on("message:new_chat_members", async (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  const chatId = ctx.message.chat.id;

  for (const member of newMembers) {
    const userId = member.id;

    // Supprimer le message d'ajout
    if (welcomeMessages[userId]) {
      try {
        await ctx.api.deleteMessage(chatId, welcomeMessages[userId]);
        delete welcomeMessages[userId];
      } catch (error) {
        console.error(
          `Erreur lors de la suppression du message pour l'utilisateur ${userId}:`,
          error,
        );
      }
    }

    // Envoyer un message de bienvenue personnalisé
    const welcomeMessage = `🍻Levez votre verre pour ${member.first_name} 🍻`;
    try {
      await ctx.api.sendMessage(chatId, welcomeMessage);
    } catch (error) {
      console.error(
        `Erreur lors de l'envoi du message de bienvenue pour l'utilisateur ${userId}:`,
        error,
      );
    }
  }
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
