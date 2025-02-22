// src/features/moderation/index.ts
import { BotFeature } from "../../utils/types.ts";
import { CleanupFeature } from "./cleanup.ts";
import { config } from "../../config/config.ts";

export const getModerationFeatures = (): BotFeature[] => {
    const features: BotFeature[] = [];

    if (config.features.cleanServiceMessages) {
        features.push(new CleanupFeature());
    }

    return features;
};
