// src/utils/types.ts
import { Bot, Context } from "grammY";
import { Logger } from "./logger.ts";

export interface BotFeature {
    name: string;
    register: (bot: Bot<BotContext>) => void;
}

export interface BotContext extends Context {
    logger: Logger;
}
