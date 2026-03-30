"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white">
      <div className="mx-auto max-w-md px-6 text-center">
        <h2 className="mb-4 text-[28px] font-black text-heading">
          Unable to load apps
        </h2>
        <p className="mb-8 text-[16px] leading-relaxed text-muted">
          We&apos;re having trouble loading our app catalog. Please try again in
          a moment.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-[16px] font-bold text-white shadow-lg transition-all hover:translate-y-[-2px]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 bg-white px-8 py-3 text-[16px] font-bold text-heading transition-all hover:border-primary hover:text-primary"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
