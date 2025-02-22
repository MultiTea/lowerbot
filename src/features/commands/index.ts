// src/features/commands/index.ts
import { config } from "../../config/config.ts";
import { BotFeature } from "../../utils/types.ts";
import { StatusCommandsFeature } from "./status.ts";

export const getCommandFeatures = (): BotFeature[] => {
    const features: BotFeature[] = [];

    if (config.features.statusCommands) {
        features.push(new StatusCommandsFeature());
    }

    return features;
};
