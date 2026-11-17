# 📚 Plataforma: Onde Estudo? — Front-end

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38BDF8?logo=tailwindcss&logoColor=white)
![Contexto](https://img.shields.io/badge/Contexto-Projeto%20Pessoal-blueviolet)
![Status](https://img.shields.io/badge/Status-Em%20andamento-yellow)

Interface da plataforma **Onde Estudo?**, um projeto pessoal inspirado na experiência da W3Schools, mas voltado ao ensino brasileiro e alinhado à **BNCC**. Este repositório concentra o Front-end da aplicação, consumindo a API do [Back-end](https://github.com/OndeJoaoGularte/OndeEstudo-Backend).

---

## 🎯 Objetivo do Projeto

Oferecer uma experiência de estudo clara e navegável, em que o aluno percorra matérias, séries, unidades e aulas de forma intuitiva, com autenticação, área administrativa e uma interface moderna, responsiva e fácil de evoluir.

---

## 🚀 Funcionalidades

1. **Autenticação:** Telas de login e registro, com sessão persistida no navegador.
2. **Navegação de estudos:** Fluxo por matéria → série → unidade → aula.
3. **Dashboard administrativo:** Gestão de matérias, séries, unidades, aulas e usuários.
4. **Cards e sidebars de conteúdo:** Componentes para listar e navegar pela hierarquia escolar.
5. **Tema e layout:** Interface com suporte a tema e estrutura de header, navbar, sidebars e footer.
6. **Integração com a API:** Comunicação HTTP com o Back-end para dados e autenticação.

---

## 🛠️ Tecnologias Utilizadas

* **React 19 + Vite:** Biblioteca de interface e bundler para desenvolvimento rápido.
* **TypeScript:** Tipagem estática dos componentes, rotas e entidades.
* **TanStack Router:** Roteamento file-based da aplicação.
* **TanStack Query:** Cache e sincronização dos dados vindos da API.
* **Zustand:** Estado global de autenticação com persistência no `localStorage`.
* **Axios:** Cliente HTTP para as requisições ao Back-end.
* **Tailwind CSS + DaisyUI:** Estilização utilitária e componentes de UI.
* **Lucide React:** Ícones da interface.

---

## 🧠 Conceitos Aplicados

* **SPA com roteamento por arquivos:** Organização das rotas em `src/routes` com TanStack Router.
* **Estado global de auth:** Store Zustand com `persist` para manter usuário e token entre sessões.
* **Data fetching declarativo:** React Query para buscar e cachear conteúdo da API.
* **Tipagem de domínio:** Interfaces TypeScript espelhando a hierarquia educacional (Subject, Grade, Unit, Lesson, ContentBlocks).
* **Componentização:** Layout (header, sidebars, footer) e cards reutilizáveis para o catálogo de estudos.
* **UI moderna e responsiva:** Composição com Tailwind/DaisyUI voltada a uma experiência de estudo limpa e acessível.
