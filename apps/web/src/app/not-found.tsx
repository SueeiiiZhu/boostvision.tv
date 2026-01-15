import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="mt-2 text-muted">
            Sorry, the page you are looking for does not exist or has been
            moved.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

