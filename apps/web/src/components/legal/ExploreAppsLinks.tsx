import Link from "next/link";
import { getApps } from "@/lib/strapi/api/apps";

interface ExploreAppsLinksProps {
  title?: string;
  description?: string;
}

export default async function ExploreAppsLinks({
  title = "Explore Our Apps",
  description = "Learn more about BoostVision screen mirroring and TV remote apps.",
}: ExploreAppsLinksProps) {
  const appsResponse = await getApps({ limit: 100 }).catch(() => null);
  const apps = appsResponse?.data || [];
  const remoteApps = apps.filter((app) => app.type === "tv-remote");
  const mirroringApps = apps.filter((app) => app.type === "screen-mirroring");

  return (
    <section className="py-10">
      <div className="container-custom max-w-[900px]">
        <div className="rounded-2xl border border-[#dfe8ff] bg-[#f7faff] p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold text-heading">{title}</h2>
              <p className="mt-2 text-[14px] text-muted leading-relaxed md:text-[15px]">{description}</p>
            </div>
            <Link
              href="/app"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-primary/30 bg-white px-4 py-2 text-[13px] font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
            >
              App Library
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-[14px] font-bold uppercase tracking-wide text-heading/80">TV Remote Apps</h3>
              <ul className="mt-2 list-[square] pl-6 space-y-2 marker:text-primary">
                {remoteApps.map((app) => (
                  <li key={app.id}>
                    <Link href={`/app/${app.slug}`} className="text-[15px] font-semibold text-primary hover:underline">
                      {app.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[14px] font-bold uppercase tracking-wide text-heading/80">Screen Mirroring Apps</h3>
              <ul className="mt-2 list-[square] pl-6 space-y-2 marker:text-primary">
                {mirroringApps.map((app) => (
                  <li key={app.id}>
                    <Link href={`/app/${app.slug}`} className="text-[15px] font-semibold text-primary hover:underline">
                      {app.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
