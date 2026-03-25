"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps } from "react";

interface IntlProviderProps
  extends Omit<ComponentProps<typeof NextIntlClientProvider>, "locale" | "messages"> {
  locale: string;
  messages: Record<string, unknown>;
}

export function IntlProvider({ children, locale, messages }: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
