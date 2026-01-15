import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read our privacy policy to understand how we handle your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="py-12">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Privacy Policy
            </h1>
            <div className="prose prose-lg mt-8 max-w-none">
              <p className="text-muted">
                Privacy policy content will be loaded from Strapi CMS.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

