import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HiEye, HiCalendar, HiTag } from "react-icons/hi";
import useToastLoading from "../../hooks/useToastLoading";
import { getPostBySlug } from "../../services/post.service";
import type { Post } from "../../types/post";
import { formatDateName } from "../../utils/formatar";
import LoadingPage from "../../components/LoadingPage";

export default function ViewArticle() {
  const { slug } = useParams();
  const toast = useToastLoading();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      setLoading(true);
      const response = await getPostBySlug(slug);
      if (!response.success) {
        toast({ mensagem: response.message, tipo: response.type });
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(response.data || null);
      setLoading(false);
    };

    loadPost();
  }, [slug]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
      {loading ? (
        <LoadingPage />
      ) : !post ? (
        <div className="mt-24 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 bg-white dark:bg-slate-900">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Artigo não encontrado
          </p>

          <p className="text-slate-500 mt-2">
            Verifique o link ou volte para a home.
          </p>
        </div>
      ) : (
        <article className="mt-16">
          {/* HEADER */}
          <header className=" mx-auto text-center">
            {post.category && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300 text-xs font-semibold">
                <HiTag className="w-3.5 h-3.5" />
                {post.category.name}
              </div>
            )}

            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900 dark:text-white font-['Fraunces']">
              {post.title}
            </h1>

            {/* DESCRIÇÃO */}
            {post.description && (
              <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {post.description}
              </p>
            )}

            {/* META */}
            <div className="mt-6 flex items-center justify-center flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <HiCalendar className="w-4 h-4" />
                {formatDateName(post.createdAt)}
              </span>

              <span className="flex items-center gap-2">
                <HiEye className="w-4 h-4" />
                {post.views} visualizações
              </span>

              {post.author?.name && (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-500"></span>
                  {post.author.name}
                </span>
              )}
            </div>

            {/* DIVIDER */}
            <div className="mt-10 h-px w-full bg-slate-200 dark:bg-slate-800"></div>
          </header>

          {/* CONTENT */}
          <section className="mt-12 mx-auto">
            <div
              className="
                  ql-editor
                  prose
                  prose-lg
                  prose-slate
                  dark:prose-invert
                  max-w-none
                  prose-headings:tracking-tight
                  prose-headings:font-semibold
                  prose-a:text-cyan-600
                  hover:prose-a:text-cyan-500
                  prose-img:rounded-xl
                  prose-img:shadow-sm
                  prose-pre:bg-slate-900
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </section>
        </article>
      )}
    </main>
  );
}
