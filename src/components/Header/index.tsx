import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { HiChip, HiMoon, HiSun } from "react-icons/hi";
import { useStorage } from "../../hooks/storage";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const storage = useStorage();
  const token = storage.getSession();
  const isAuthenticated = !!token && token !== "undefined" && token !== "null";
  const authLink = isAuthenticated ? "/dashboard" : "/login";
  const authLabel = isAuthenticated ? "Dashboard" : "Entrar";

  return (
    <header className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <HiChip className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TechNews
              </span>
              <span className="text-xl font-light text-gray-700 dark:text-gray-300 ml-1">
                Portal
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
              title={theme === "light" ? "Modo escuro" : "Modo claro"}
            >
              {theme === "light" ? (
                <HiMoon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              ) : (
                <HiSun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
              )}
            </button>

            <Link
              to={authLink}
              className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {authLabel}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
