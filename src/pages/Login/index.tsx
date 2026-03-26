import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  HiMail,
  HiLockClosed,
  HiChip,
  HiLogin,
  HiSun,
  HiMoon,
} from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { login as loginService } from "../../services/auth.service";
import useToastLoading from "../../hooks/useToastLoading";
import { useTheme } from "../../contexts/ThemeContext";
import { useStorage } from "../../hooks/storage";
import type { User } from "../../types/user";
import { loginSchema } from "../../schemas/auth";

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const { theme, toggleTheme } = useTheme();
  const storage = useStorage();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const response = await loginService(data);
    if (response.success && response.data) {
      const { token, user } = response.data;
      if (!token || !user) {
        toast({
          mensagem: "Erro ao processar dados de login",
          tipo: "error",
        });

        return;
      }
      storage.setSession(token);
      storage.setUser(user as User);
      navigate("/dashboard");
    }

    toast({ mensagem: response.message, tipo: response.type });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Botão de tema fixo */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg z-50"
        title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      >
        {theme === "light" ? (
          <HiMoon className="w-5 h-5 text-gray-700" />
        ) : (
          <HiSun className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      {/* Elementos de fundo tech */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern tech */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5 bg-[linear-gradient(to_right,#60a5fa_1px,transparent_1px),linear-gradient(to_bottom,#60a5fa_1px,transparent_1px)] bg-size-[50px_50px]"></div>

        {/* Linhas de conexão animadas */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>

        {/* Partículas flutuantes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-2/3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      {/* Container principal */}
      <div className="relative w-full max-w-md">
        {/* Card de Login com efeito glassmorphism */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-300/50 dark:border-gray-700/50 shadow-blue-500/10">
          {/* Header com logo tech */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
              <HiChip className="w-10 h-10 text-white relative z-10" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              BlogTech Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm tracking-wider">
              Acesse o painel de notícias de tecnologia
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <HiMail className="w-4 h-4 text-blue-400" />
                Email
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-800/50 border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                  } rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 group-hover:border-blue-400/50`}
                  placeholder="dev@exemplo.com"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-400 transition-colors">
                  <HiMail className="w-5 h-5" />
                </div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 animate-[fadeIn_0.3s_ease-out]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <HiLockClosed className="w-4 h-4 text-blue-400" />
                Senha
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-800/50 border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                  } rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 group-hover:border-blue-400/50`}
                  placeholder="••••••••"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-400 transition-colors">
                  <HiLockClosed className="w-5 h-5" />
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 animate-[fadeIn_0.3s_ease-out]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Botão Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3.5 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {/* Efeito de brilho */}
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <FaSpinner className="animate-spin h-5 w-5 text-white" />
                  Processando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <HiLogin className="w-5 h-5" />
                  Acessar Painel
                </span>
              )}
            </button>
          </form>

          {/* Rodapé */}
          <div className="mt-8 pt-6 border-t border-gray-300/50 dark:border-gray-700/50">
            <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} BlogTech Portal. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
