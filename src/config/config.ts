// src/config/config.ts
import {
    getEnvVar,
    getEnvVarAsBoolean,
    getEnvVarAsNumber,
} from "./environment.ts";

// Define types for Telegram-specific structures
export interface InputPollOption {
    text: string;
}

export interface BotConfig {
    telegram: {
        token: string;
    };
    joinRequests: {
        pollTimeoutMs: number;
        pollOptions: string[];
    };
    messages: {
        welcomeTemplate: string;
        joinRequestQuestion: string;
        joinConfirmationTemplate: string;
    };
    features: {
        cleanServiceMessages: boolean;
        welcomeMessages: boolean;
        joinRequestPolls: boolean;
        statusCommands: boolean;
    };
    logging: {
        level: "debug" | "info" | "warn" | "error";
    };
}

export const config: BotConfig = {
    telegram: {
        token: getEnvVar("BOT_TOKEN"),
    },
    joinRequests: {
        pollTimeoutMs: getEnvVarAsNumber(
            "JOIN_REQUEST_POLL_TIMEOUT_MS",
            86400000,
        ), // 24 hours
        pollOptions: [
            "✅ Oui, pas de soucis !",
            "🚫 Non, je ne souhaite pas",
            "❔ Ne connait pas / se prononce pas",
        ],
    },
    messages: {
        welcomeTemplate:
            `🍻 Levez votre verre pour **[{username}]({userLink})** ! Bienvenue au FurBar Toulouse ! 🍻`,
        joinRequestQuestion:
            `🆕 Nouvelle demande → {firstName} souhaite se joindre à nous ! Souhaitez-vous l'intégrer à l'événement ?`,
        joinConfirmationTemplate: `Bonjour {firstName},
Je suis BotBar, et je m'occupe du groupe du FurBar Toulouse. Si tu reçois ce message, c'est pour te confirmer que ta demande pour nous rejoindre a bien été prise en compte. Un sondage a été créé pour approuver ton adhésion. Tu seras informé des résultats sous peu.
Merci pour ta patience !`,
    },
    features: {
        cleanServiceMessages: getEnvVarAsBoolean(
            "ENABLE_CLEAN_SERVICE_MESSAGES",
            true,
        ),
        welcomeMessages: getEnvVarAsBoolean("ENABLE_WELCOME_MESSAGES", true),
        joinRequestPolls: getEnvVarAsBoolean("ENABLE_JOIN_REQUEST_POLLS", true),
        statusCommands: getEnvVarAsBoolean("ENABLE_STATUS_COMMANDS", true),
    },
    logging: {
        level: getEnvVar("LOG_LEVEL", "info") as
            | "debug"
            | "info"
            | "warn"
            | "error",
    },
};
