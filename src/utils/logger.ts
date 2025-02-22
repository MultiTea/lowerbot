// src/utils/logger.ts
import { config } from "../config/config.ts";

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const CONFIGURED_LEVEL = LOG_LEVELS[config.logging.level];

export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    debug(message: string, data?: unknown): void {
        this.log("debug", message, data);
    }

    info(message: string, data?: unknown): void {
        this.log("info", message, data);
    }

    warn(message: string, data?: unknown): void {
        this.log("warn", message, data);
    }

    error(message: string, error?: Error | unknown): void {
        this.log("error", message, error);
    }

    private log(level: LogLevel, message: string, data?: unknown): void {
        if (LOG_LEVELS[level] < CONFIGURED_LEVEL) {
            return;
        }

        const timestamp = new Date().toISOString();
        const formattedMessage =
            `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;

        const logData = data ? { ...data } : undefined;

        switch (level) {
            case "debug":
                console.debug(formattedMessage, logData);
                break;
            case "info":
                console.info(formattedMessage, logData);
                break;
            case "warn":
                console.warn(formattedMessage, logData);
                break;
            case "error":
                console.error(formattedMessage, logData);
                if (data instanceof Error) {
                    console.error(data.stack);
                }
                break;
        }
    }
}

export const createLogger = (context: string): Logger => {
    return new Logger(context);
};
