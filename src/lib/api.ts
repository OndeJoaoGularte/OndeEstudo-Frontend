import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

export const api = axios.create({
  baseURL: 'https://onde-estudo-backend.onrender.com',
});

// Interceptor de Requisição, uma função que roda automaticamente antes de qualquer requisição
api.interceptors.request.use((config) => {
  // o Zustand utiliza o método 'getState()' para acessar o estado fora de um componente React (sem precisar de hooks)
  const token = useAuthStore.getState().token;

  // Caso exista um token salvo, ele é injetado no cabeçalho 'Authorization' no padrão Bearer
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Retorna a configuração modificada para seguir com a requisição
  return config;
});
