import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/strapi";
import { formatDate } from "@/lib/utils/formatDate";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[30px] bg-white card-shadow transition-all duration-300 hover:translate-y-[-10px]">
      <Link href={`/blog/${post.slug}`} className="relative h-[240px] w-full overflow-hidden">
        <Image
          src={post.coverImage?.url}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={80}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Category Badge - Temporarily Hidden */}
        {/* TODO: Re-enable when category feature is ready */}
        {/* <div className="absolute left-6 top-6 rounded-full bg-primary/90 px-4 py-1.5 text-[12px] font-bold text-white backdrop-blur-sm">
          {post.category?.name}
        </div> */}
      </Link>
      <div className="flex flex-col p-10">
        <h3 className="mb-6 text-[22px] font-bold text-heading leading-[1.4] line-clamp-2 min-h-[62px] group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 relative overflow-hidden rounded-full border border-gray-100">
              <Image
                src={post.author?.avatar?.url}
                alt={post.author?.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="text-[14px] font-bold text-heading">{post.author?.name}</span>
          </div>
          <span className="text-[14px] font-medium text-muted">{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}
