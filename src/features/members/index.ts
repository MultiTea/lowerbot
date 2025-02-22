// src/features/members/index.ts
import { BotFeature } from "../../utils/types.ts";
import { JoinRequestFeature } from "./joinRequest.ts";
import { WelcomeFeature } from "./welcome.ts";
import { config } from "../../config/config.ts";

export const getMemberFeatures = (): BotFeature[] => {
    const features: BotFeature[] = [];

    if (config.features.joinRequestPolls) {
        features.push(new JoinRequestFeature());
    }

    if (config.features.welcomeMessages) {
        features.push(new WelcomeFeature());
    }

    return features;
};
