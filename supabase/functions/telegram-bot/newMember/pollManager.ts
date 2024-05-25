import { Composer, GrammyError } from "grammY";

export const newMemberPoll = new Composer();

// Fonction pour créer le scénario d'ajout
newMemberPoll.on("chat_join_request", async (ctx) => {
  const user = ctx.chatJoinRequest.from;
  const chatId = ctx.chatJoinRequest.chat.id;

  //Constition du sondage
  const question =
    `🆕 Nouvelle demande → ${user.first_name} souhaite se joindre à nous ! Souhaitez-vous l'intégrer à l'événement ?`;

  const pollOptions = [
    "✅ Oui, pas de soucis !",
    "🚫 Non, je ne souhaite pas",
    "❔ Ne connait pas / se prononce pas",
  ];

  // Constitution du lien de présentation
  const userLink = `https://t.me/${user.username || user.id}`;
  const specialChar = "\u2060"; // Utiliser le caractère spécial
  const message = `[${specialChar}](${userLink})`;

  //Constitution du message privé envoyé à l'émetteur de la demande
  const joinConfirmationMessage = `Bonjour {${user.first_name}},
  Je suis BotBar, et je m'occupe du groupe du FurBar Toulouse. Si tu reçois ce message, c'est pour te confirmer que ta demande pour nous rejoindre a bien été prise en compte. Un sondage a été créé pour approuver ton adhésion. Tu seras informé des résultats sous peu.
  Merci pour ta patience !`;

  // Envoi du sondage et lien de présentation dans le groupe
  // deno-lint-ignore prefer-const
  let pollMessage;
  // @ts-ignore (Const can be applied as parameter)
  pollMessage = await ctx.api.sendPoll(chatId, question, pollOptions, {
    is_anonymous: true,
  });

  await ctx.api.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    link_preview_options: { show_above_text: true },
  });

  // Envoi du message de confirmation à l'émetteur de la demande
  try {
    await ctx.api.sendMessage(user.id, joinConfirmationMessage);
    console.log(`Message privé envoyé à ${user.first_name}.`);
  } catch (err) {
    if (err instanceof GrammyError) {
      console.error("Erreur lors de l'envoi du message privé:", err);
    } else {
      console.error("Erreur inconnue lors de l'envoi du message privé:", err);
    }
  }

  console.log(
    `Sondage créé pour ${user.first_name} avec l'ID: ${pollMessage.poll.id}`,
  );

  setTimeout(async () => {
    try {
      await ctx.api.stopPoll(chatId, pollMessage.message_id);
      console.log("Sondage fermé avec l'ID: ", pollMessage.poll.id);
    } catch (err) {
      if (err instanceof GrammyError) {
        console.error("Grammy error:", err);
      } else {
        console.error("Unknow Error:", err);
      }
    }
  }, 86400000); //24 heures
});
