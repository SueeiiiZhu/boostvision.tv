"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps } from "react";
import { DEFAULT_TIME_ZONE } from "@/i18n/config";

interface IntlProviderProps
  extends Omit<ComponentProps<typeof NextIntlClientProvider>, "locale" | "messages"> {
  locale: string;
  messages: Record<string, unknown>;
}

export function IntlProvider({ children, locale, messages }: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={DEFAULT_TIME_ZONE}>
      {children}
    </NextIntlClientProvider>
  );
}
