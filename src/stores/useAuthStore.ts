import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/entities';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Cria o hook global de autenticação
export const useAuthStore = create<AuthState>()(
  // A middleware 'persist' salva automaticamente o estado no storage do navegador
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      // Ação de login: Atualiza os dados do usuário, o token e marca como logado
      login: (user, token) => set({ user, token, isLoggedIn: true }),
      // Ação de logout: Limpa todos os dados, voltando ao estado inicial
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage', // Nome da chave que ficará no localStorage
    },
  ),
);
