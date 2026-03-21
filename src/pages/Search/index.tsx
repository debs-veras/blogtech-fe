import { useEffect, useMemo, useRef, useState } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import type { Category } from "../../types/category";
import type { Post } from "../../types/post";
import useToastLoading from "../../hooks/useToastLoading";
import useDebounce from "../../hooks/useDebounce";
import { getCategories } from "../../services/category.service";
import {
  searchPosts,
  type SearchPostParams,
  type SearchPostsResponse,
} from "../../services/post.service";
import PostCard from "../../components/PostCard";
import LoadingPage from "../../components/LoadingPage";

const RECORDS_PER_PAGE = 9;

const initialFilters: SearchPostParams = {
  title: "",
  categoryId: "",
  author: "",
  startDate: "",
  endDate: "",
};

const getFiltersFromParams = (params: URLSearchParams) => ({
  ...initialFilters,
  title: params.get("title") ?? "",
  categoryId: params.get("categoryId") ?? "",
  author: params.get("author") ?? "",
  startDate: params.get("startDate") ?? "",
  endDate: params.get("endDate") ?? "",
});

const buildSearchParams = (nextFilters: SearchPostParams) => {
  const nextSearchParams = new URLSearchParams();

  if (nextFilters.title) nextSearchParams.set("title", nextFilters.title);
  if (nextFilters.categoryId)
    nextSearchParams.set("categoryId", nextFilters.categoryId);
  if (nextFilters.author) nextSearchParams.set("author", nextFilters.author);
  if (nextFilters.startDate)
    nextSearchParams.set("startDate", nextFilters.startDate);
  if (nextFilters.endDate) nextSearchParams.set("endDate", nextFilters.endDate);
  return nextSearchParams;
};

export default function Search() {
  const toast = useToastLoading();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<SearchPostParams>(() =>
    getFiltersFromParams(searchParams),
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState<
    SearchPostsResponse["pagination"]
  >({
    page: 1,
    limit: RECORDS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const lastSyncedParams = useRef<string>("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchingMoreRef = useRef(false);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const loadCategories = async () => {
    const response = await getCategories();
    if (!response.success) {
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
      return;
    }
    setCategories(response.data || []);
  };

  const fetchPosts = async (
    nextFilters: SearchPostParams,
    nextPage: number,
    options: { replace?: boolean } = {},
  ) => {
    if (fetchingMoreRef.current && !options.replace) return;
    setLoading(true);
    try {
      const response = await searchPosts({
        ...nextFilters,
        page: nextPage + 1,
        limit: RECORDS_PER_PAGE,
      });
      if (!response.success) {
        toast({
          mensagem: response.message,
          tipo: response.type,
        });
        if (options.replace) setPosts([]);
        setPagination((prev) => ({
          ...prev,
          page: nextPage + 1,
          limit: RECORDS_PER_PAGE,
          total: 0,
          totalPages: 0,
        }));
        return;
      }
      const nextData = response.data?.data ?? [];
      setPosts((prev) => (options.replace ? nextData : [...prev, ...nextData]));
      setPagination(
        response.data?.pagination ?? {
          page: nextPage + 1,
          limit: RECORDS_PER_PAGE,
          total: response.data?.data?.length ?? 0,
          totalPages: response.data?.data?.length ? 1 : 0,
        },
      );
    } finally {
      setLoading(false);
      fetchingMoreRef.current = false;
    }
  };

  const debouncedSearch = useDebounce((nextFilters: SearchPostParams) => {
    fetchPosts(nextFilters, 0, { replace: true });
  }, 500);

  const syncUrl = (nextFilters: SearchPostParams) => {
    const nextSearchParams = buildSearchParams(nextFilters);
    const nextString = nextSearchParams.toString();
    if (nextString !== searchParams.toString()) {
      lastSyncedParams.current = nextString;
      setSearchParams(nextSearchParams, { replace: true });
    }
  };

  const handleChange = (field: keyof SearchPostParams, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(0);
    syncUrl(filters);
    debouncedSearch(filters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setPage(0);
    syncUrl(initialFilters);
    debouncedSearch(initialFilters); // 🔥 fix
  };

  const totalRecords = pagination.total;
  const totalPages = pagination.totalPages;
  const hasMore = useMemo(
    () => (totalPages ? page + 1 < totalPages : posts.length < totalRecords),
    [page, posts.length, totalPages, totalRecords],
  );

  useEffect(() => {
    loadCategories();
    debouncedSearch(filters);
  }, []);

  useEffect(() => {
    const paramsString = searchParams.toString();
    if (paramsString === lastSyncedParams.current) return;

    const nextFilters = getFiltersFromParams(searchParams);
    setFilters((prev) =>
      prev.title === nextFilters.title &&
      prev.categoryId === nextFilters.categoryId &&
      prev.author === nextFilters.author &&
      prev.startDate === nextFilters.startDate &&
      prev.endDate === nextFilters.endDate
        ? prev
        : nextFilters,
    );

    if (paramsString) debouncedSearch(nextFilters);
  }, [searchParams]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting) return;
        if (!hasMore || fetchingMoreRef.current) return;

        fetchingMoreRef.current = true;

        setPage((prev) => {
          const next = prev + 1;
          fetchPosts(filtersRef.current, next);
          return next;
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-linear-to-br from-blue-100/40 via-white to-purple-100/40 dark:from-blue-900/20 dark:via-slate-900 dark:to-purple-900/20" />
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] bg-[linear-gradient(to_right,#60a5fa_1px,transparent_1px),linear-gradient(to_bottom,#60a5fa_1px,transparent_1px)] bg-size-[64px_64px]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Pesquisa de artigos
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Encontre conteudo relevante em segundos
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Use filtros por categoria, autor e periodo para refinar os
              resultados da sua busca.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200/70 bg-white/90 p-6 shadow-xl shadow-blue-200/30 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-blue-900/20"
        >
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.9fr_0.9fr]">
            <div className="relative">
              <HiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.title}
                onChange={(event) => handleChange("title", event.target.value)}
                placeholder="Pesquisar por titulo ou conteudo"
                className="w-full rounded-2xl border border-gray-200 bg-white px-11 py-3 text-sm text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
              />
            </div>

            <div>
              <select
                value={filters.categoryId}
                onChange={(event) =>
                  handleChange("categoryId", event.target.value)
                }
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="text"
                value={filters.author}
                onChange={(event) => handleChange("author", event.target.value)}
                placeholder="Autor"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[0.8fr_0.8fr_auto]">
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) =>
                handleChange("startDate", event.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => handleChange("endDate", event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-300/30 transition hover:from-blue-700 hover:to-purple-700"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <HiX className="h-4 w-4" />
                Limpar
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {loading
              ? "Buscando artigos..."
              : `${totalRecords} resultados encontrados`}
          </p>
        </div>

        {loading ? (
          <LoadingPage />
        ) : posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white/80 px-6 py-16 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
            Nenhum artigo encontrado. Tente ajustar os filtros.
          </div>
        )}
        <div ref={sentinelRef} />
      </section>
    </div>
  );
}
