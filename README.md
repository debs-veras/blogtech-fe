# 🚀 BlogTech - Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Este é o frontend do **BlogTech**, uma plataforma de blog moderna e performática desenvolvida para oferecer a melhor experiência na criação e leitura de conteúdos tecnológicos.

---

## ✨ Funcionalidades

- 📝 **Gestão de Conteúdo**: Criação, edição e listagem de posts com editor de texto rico.
- 📂 **Categorização**: Organização de artigos por temas e categorias dinâmicas.
- 🔍 **Busca Avançada**: Sistema de pesquisa eficiente para encontrar artigos rapidamente.
- 🔐 **Autenticação Segura**: Login e gerenciamento de perfil de usuário.
- 🖼️ **Upload de Mídia**: Suporte para imagens e assets nos artigos.
- 🛠️ **Painel Administrativo**: Interface completa para moderadores e administradores.
- 🌗 **UI Responsiva**: Design adaptável para desktop e dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza o que há de mais moderno no ecossistema React:

- **Core**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Radix UI](https://www.radix-ui.com/)
- **Gestão de Formulários**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Roteamento**: [React Router Dom](https://reactrouter.com/)
- **Consumo de API**: [Axios](https://axios-http.com/)
- **Feedback Visual**: [React Toastify](https://fkhadra.github.io/react-toastify/) & [AutoAnimate](https://auto-animate.formkit.com/)

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento localmente.

### Pré-requisitos

- **Node.js**: Versão 18 ou superior.
- **Gerenciador de Pacotes**: Recomendamos o [pnpm](https://pnpm.io/), mas você também pode usar `npm` ou `yarn`.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/blogtech-fe.git
   cd blogtech-fe
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```
   *(Ou `npm install` / `yarn install`)*

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto e configure a URL da API(VITE_URL_API=https://blogtech-be.onrender.com). Caso queira acessar o código fonte do backend, ele está disponível em: [blogtech-be](https://github.com/debs-veras/blogtech-be).
   ```env
   # URL da API do BlogTech
   VITE_API_URL=http://localhost:3000
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm run dev
   ```

5. **Acesse no navegador:**
   O projeto estará disponível em [http://localhost:5173](http://localhost:5173).

---

## 📂 Estrutura de Pastas

```text
src/
├── components/ # Componentes reutilizáveis (UI, Layout, etc)
├── pages/      # Páginas principais da aplicação
├── services/   # Configuração do Axios e chamadas de API
├── router/     # Definição de rotas e proteção de acesso
├── contexts/   # Gerenciamento de estado global (Auth, etc)
├── hooks/      # Hooks personalizados
├── schemas/    # Validações com Zod
├── utils/      # Funções utilitárias
└── types/      # Definições de tipos TypeScript
```

---

## 📝 Observações

Este projeto está em desenvolvimento contínuo. Se encontrar algum bug ou tiver sugestões de melhorias, sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*!

---
Desenvolvido com ❤️ por [Débora Hellen](https://github.com/debs-veras)
