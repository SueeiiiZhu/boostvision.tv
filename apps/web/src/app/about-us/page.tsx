import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about BoostVision and our mission to provide the best screen mirroring and TV remote apps.",
};

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="py-12">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              About Us
            </h1>
            <div className="prose prose-lg mt-8 max-w-none">
              <p className="text-muted">
                BoostVision is dedicated to providing the best screen mirroring
                and TV remote experience for users worldwide. Our apps are
                designed to be simple, reliable, and feature-rich.
              </p>
              <p className="text-muted">
                Content will be loaded from Strapi CMS.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

