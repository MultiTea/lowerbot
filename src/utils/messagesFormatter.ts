// src/utils/messageFormatter.ts
/** Format messages with templates and values **/
export const formatMessage = (
    template: string,
    values: Record<string, string>,
): string => {
    return Object.entries(values).reduce((message, [key, value]) => {
        return message.replace(new RegExp(`{${key}}`, "g"), value);
    }, template);
};
