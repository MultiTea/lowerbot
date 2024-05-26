import { Composer } from "https://deno.land/x/grammy@v1.23.0/mod.ts";

export const cleanService = new Composer();

cleanService.on([
  "message:left_chat_member",
  "message:pinned_message",
  "message:new_chat_photo",
  "message:delete_chat_photo",
  "message:new_chat_title",
], async (ctx) => {
  await ctx.deleteMessage();
});
