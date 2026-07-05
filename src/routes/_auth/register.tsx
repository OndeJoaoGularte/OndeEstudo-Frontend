import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import { isAxiosError } from 'axios';

export const Route = createFileRoute('/_auth/register')({
    component: function RegisterPage() {
        const navigate = useNavigate();

        // Estados locais do formulário e interface
        const [showPassword, setShowPassword] = useState(false);
        const [formData, setFormData] = useState({ name: '', email: '', password: '' });
        const [errorMessage, setErrorMessage] = useState('');
        const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

        // Configuração da requisição de Registro
        const registerMutation = useMutation({
            mutationFn: async () => {
                const response = await api.post('/register', formData);
                return response.data;
            },
            onSuccess: () => {
                setErrorMessage('');
                setToast({ message: 'Conta criada com sucesso! Por favor, faça login.', type: 'success' });
                setTimeout(() => navigate({ to: '/login' }), 2000);
            },
            onError: (error: unknown) => {
                // isAxiosError garante ao TypeScript que o erro tem a estrutura de resposta do Axios (error.response.data)
                if (isAxiosError(error)) {
                    setErrorMessage(error.response?.data?.error || 'Email ou senha incorretos.');
                } else {
                    setErrorMessage('Ocorreu um erro inesperado.');
                }
            }
        });

        const handleSubmit = (e: React.FormEvent) => {
            // Impede o recarregamento padrão da página ao submeter o formulário
            e.preventDefault();
            setErrorMessage('');
            // Dispara a requisição de registro para a API
            registerMutation.mutate();
        };

        return (
            <>
                {/* Toast de notificação */}
                {toast && (
                    <div className="toast toast-bottom toast-end z-9 animate-in slide-in-from-bottom-8 fade-in duration-500 mb-4 mr-4 fixed">
                        <div className="alert alert-success text-success-content shadow-xl rounded-xl border border-white/20">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">{toast.message}</span>
                        </div>
                    </div>
                )}

                {/* Cabeçalho do Formulário */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2 tracking-tight">
                        Crie sua conta!
                    </h1>
                    <p className="text-base-content/60 text-base">
                        Junte-se a nós e organize seus estudos.
                    </p>
                </div>

                {errorMessage && (
                    <div className="alert alert-error text-sm rounded-lg py-3 mb-4 shadow-sm animate-in fade-in">
                        <AlertCircle className="w-5 h-5" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/80">Nome Completo</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                            <User className="w-5 h-5 text-base-content/40" />
                            <input
                                type="text"
                                className="grow text-base"
                                placeholder="João Gularte"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/80">E-mail</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                            <Mail className="w-5 h-5 text-base-content/40" />
                            <input
                                type="email"
                                className="grow text-base"
                                placeholder="voce@exemplo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/80">Senha</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all pr-2">
                            <Lock className="w-5 h-5 text-base-content/40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="grow text-base"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-base-content/80"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-4 text-base font-bold tracking-wide hover:bg-secondary hover:border-secondary transition-colors duration-300"
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending ? <span className="loading loading-spinner loading-sm"></span> : 'Criar Conta Gratuita'}
                    </button>
                </form>

                <div className="divider text-base-content/30 my-8 text-sm">OU</div>

                <div className="text-center">
                    <p className="text-base-content/70">
                        Já faz parte da plataforma?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline hover:text-secondary transition-colors">
                            Faça Login
                        </Link>
                    </p>
                </div>
            </>
        );
    }
});