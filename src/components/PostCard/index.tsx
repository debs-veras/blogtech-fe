import { Link } from "react-router-dom";
import { HiEye, HiCalendar, HiTag, HiArrowRight } from "react-icons/hi";
import type { Post } from "../../types/post";
import { formatDateName } from "../../utils/formatar";

export default function PostCard({ ...props }: Post) {
  const { description, createdAt, author, category, slug, title, views } =
    props;
  const authorName = author?.name || "Autor";
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/70 hover:shadow-xl hover:shadow-blue-500/10 dark:border-gray-700/80 dark:bg-gray-800/95 dark:hover:border-blue-500/40 dark:hover:shadow-blue-500/5">
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      </div>

      <Link to={`/post/${slug}`} className="relative block p-6 lg:p-7">
        {category && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-linear-to-r from-blue-500/10 to-purple-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-purple-500/30 dark:text-blue-300">
              <HiTag className="w-3 h-3" />
              {category.name}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 shadow-sm ring-2 ring-white/70 dark:ring-gray-800/70">
              <span className="text-white text-xs font-bold">
                {authorInitial}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {authorName}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <HiCalendar className="w-3 h-3" />
                <span>{formatDateName(createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-gray-100/80 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700/80 dark:text-gray-300">
            <HiEye className="w-3.5 h-3.5" />
            <span>{views}</span>
          </div>
        </div>

        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-all duration-300 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent dark:text-white lg:text-2xl">
          {title}
        </h3>

        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 lg:text-base">
          {description ?? "Sem descrição"}
        </p>

        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all duration-300 dark:text-blue-400">
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
            Ler artigo
          </span>
          <HiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
