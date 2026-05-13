export default function Loading() {
  return (
    <main>
      <section className="bg-white pt-24 pb-12 text-center">
        <div className="container-custom">
          {/* Title skeleton */}
          <div className="mx-auto max-w-[700px] h-14 bg-gray-100 rounded-lg animate-pulse" />
          {/* Subtitle skeleton */}
          <div className="mx-auto mt-8 max-w-[600px] space-y-3">
            <div className="h-4 bg-gray-50 rounded animate-pulse" />
            <div className="h-4 bg-gray-50 rounded animate-pulse w-4/5 mx-auto" />
          </div>
          {/* CTA button skeleton */}
          <div className="mt-12 flex justify-center">
            <div className="h-[60px] w-[200px] bg-gray-100 rounded-full animate-pulse" />
          </div>
          {/* Hero image skeleton */}
          <div className="mt-16 flex justify-center">
            <div className="w-full max-w-[1100px] aspect-[2/1] bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </section>
    </main>
  );
}
