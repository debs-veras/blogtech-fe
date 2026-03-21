import { useEffect, useState, type JSX } from "react";
import {
  HiDocumentText,
  HiEye,
  HiCheckCircle,
  HiPencil,
  HiTrendingUp,
  HiClipboardList,
  HiClock,
} from "react-icons/hi";
import { dashboardPosts, dashboardPostsAuthor, activitiesPosts } from "../../services/post.service";
import type { Activity, Post } from "../../types/post";
import Box from "../../components/UI/Box";
import { useStorage } from "../../hooks/storage";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
  });

  const { getUser } = useStorage();
  const user = getUser();
  const isAuthor = user?.role === "AUTHOR";

  const [loading, setLoading] = useState<boolean>(true);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      const { data: activitiesData } = await activitiesPosts();
      
      const dashboardPromise = isAuthor ? dashboardPostsAuthor() : dashboardPosts();
      const { data } = await dashboardPromise;
      
      if (data) {
        setStats(data.stats);
        setRecentPosts(data.recentPosts);
        setPopularPosts(data.popularPosts);
      }

      if (activitiesData) setActivities(activitiesData);

      setLoading(false);
    }

    void loadDashboardData();
  }, [isAuthor]);

  return (
    <div className="space-y-8">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          icon={<HiDocumentText className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          title="Total de Posts"
          value={stats.totalPosts}
          gradient="from-blue-500 to-blue-600"
        />
        <Card
          icon={<HiEye className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          title="Visualizações"
          value={stats.totalViews}
          gradient="from-purple-500 to-purple-600"
        />
        <Card
          icon={<HiCheckCircle className="w-6 h-6 text-pink-600" />}
          iconBg="bg-pink-100 dark:bg-pink-900/30"
          title="Publicados"
          value={stats.publishedPosts}
          extra={`${stats.draftPosts} rascunhos`}
          gradient="from-pink-500 to-pink-600"
        />
      </div>

      {/* Listas de posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard
          title="Posts Recentes"
          loading={loading}
          icon={<HiPencil className="w-5 h-5" />}
          items={recentPosts.map((post) => ({
            id: post.id,
            title: post.title,
            subtitle: post.author?.name,
          }))}
        />
        <ListCard
          title="Posts Populares"
          loading={loading}
          icon={<HiTrendingUp className="w-5 h-5" />}
          items={popularPosts.map((post) => ({
            id: post.id,
            title: post.title,
            subtitle: `${post.views} visualizações`,
          }))}
        />
      </div>

      {/* Atividades recentes */}
      <Box loading={loading}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <HiClipboardList className="text-blue-500" />
          Atividades Recentes
        </h2>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <HiClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{activity.user?.name || "Sistema"}</span>
                  <span>•</span>
                  <time dateTime={activity.createdAt}>
                    {new Date(activity.createdAt).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Nenhuma atividade recente.
            </p>
          )}
        </div>
      </Box>
    </div>
  );
}

// Card reutilizável para estatísticas
function Card({
  icon,
  iconBg,
  title,
  value,
  extra,
  gradient,
}: {
  icon: JSX.Element;
  iconBg: string;
  title: string;
  value: number;
  extra?: string;
  gradient: string;
}) {
  return (
    <div
      className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg `}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium tracking-wide">
            {title}
          </p>
          <p className="text-4xl font-bold mt-2">{value}</p>
          {extra && (
            <p className="text-white/80 text-sm mt-2 font-medium">{extra}</p>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-xl`}>{icon}</div>
      </div>
    </div>
  );
}

// Card reutilizável para listas
function ListCard({
  title,
  icon,
  items,
  loading = false,
}: {
  title: string;
  icon: JSX.Element;
  items: { id: string; title: string; subtitle?: string }[];
  loading: boolean;
}) {
  return (
    <Box loading={loading}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-blue-500">{icon}</span>
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-2 -mx-2 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Nenhum item encontrado.
          </p>
        )}
      </div>
    </Box>
  );
}
