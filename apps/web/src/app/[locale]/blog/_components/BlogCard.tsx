import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/strapi";

interface BlogCardProps {
  post: BlogPost;
}

function formatUsShortDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-[30px] border border-gray-100 bg-white p-6 card-shadow transition-all duration-300 hover:translate-y-[-6px] md:min-h-[240px] md:p-10"
    >
      <div className="flex h-full flex-col">
        <h3 className="mb-4 text-[20px] font-medium font-heading text-gray-800 leading-[1.4] line-clamp-2 transition-colors group-hover:text-primary md:text-[20px] md:leading-[1.25]">
          {post.title}
        </h3>
        <p className="mb-6 text-[15px] leading-[1.6] text-gray-500 line-clamp-3 md:mb-8 md:text-[16px] md:line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mb-5 border-t border-gray-100/90" />
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 relative overflow-hidden rounded-full border border-gray-100">
              <Image
                src={post.author?.avatar?.url || "/icons/author-placeholder.webp"}
                alt={post.author?.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="text-[14px] font-medium font-heading text-heading">{post.author?.name}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-muted"><Image src="/icons/date-icon.svg" alt="Date" width={14} height={14} className="h-3.5 w-3.5" />{formatUsShortDate(post.postDate)}</span>
        </div>
      </div>
    </Link>
  );
}
