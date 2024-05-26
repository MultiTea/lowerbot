import { Composer } from "grammY";

export const newMemberWelcome = new Composer();

newMemberWelcome.on("message:new_chat_members", async (ctx) => {
  const chatId = ctx.message?.chat.id;
  const member = ctx.message?.new_chat_members?.[0];

  if (chatId && member) {
    // Supprimer le message par défaut d'ajout de membre
    await ctx.deleteMessage();

    // Envoyer un message personnalisé de bienvenue
    const username = member.first_name;
    const userLink = `https://t.me/${member.username || member.id}`;
    const welcomeMessage =
      `🍻 Levez votre verre pour **[${username}](${userLink})** ! Bienvenue au FurBar Toulouse ! 🍻`;

    //Envoi du message de bienvenue
    await ctx.api.sendMessage(chatId, welcomeMessage, {
      parse_mode: "Markdown",
    });

    console.log(`Message de bienvenue envoyé pour ${username}.`);
  }
});
