import { HiChip } from "react-icons/hi";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <HiChip className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">
                TechNews Portal
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Inovação & Tecnologia
              </div>
            </div>
          </div>
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} TechNews Portal. Todos os direitos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
