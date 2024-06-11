import { Composer } from "grammY";

// Fichier contenant des commandes pour tester et vérifier le status du bot

export const commands = new Composer();

commands.command(
  "areyouokay",
  (ctx) => ctx.reply(`Up and running : ${Date.now()}`),
);
