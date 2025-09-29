export const locales = ["en-US", "uk-UA"] as const;

export const DEFAULT_LOCALE = "en-US";

export type Locale = (typeof locales)[number];
