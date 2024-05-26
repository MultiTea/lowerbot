import { Composer } from "https://deno.land/x/grammy@v1.23.0/mod.ts";

// Fichier contenant des commandes pour tester et vérifier le status du bot

export const test = new Composer();

test.command("start", (ctx) => ctx.reply("Welcome! Up and running!"));
test.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()}`));
test.command("pong", (ctx) => ctx.reply(`Ping! ${new Date()}`));
test.command("big", (ctx) => ctx.reply("Bang!"));
