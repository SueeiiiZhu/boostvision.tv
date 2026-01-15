import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read our terms of use to understand the conditions for using our services.",
};

export default function TermsOfUsePage() {
  return (
    <>
      <Header />
      <main className="py-12">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Terms of Use
            </h1>
            <div className="prose prose-lg mt-8 max-w-none">
              <p className="text-muted">
                Terms of use content will be loaded from Strapi CMS.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

