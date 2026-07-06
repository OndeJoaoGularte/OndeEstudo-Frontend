import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Layers, Library, FileText, Users } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/useAuthStore';

// Interface para garantir que o componente saiba o tipo de dado que vai receber da API
interface DashboardStats {
    subjects: number;
    grades: number;
    units: number;
    lessons: number;
    users: number;
}

export const Route = createFileRoute('/dashboard/')({
    component: function DashboardHome() {
        const user = useAuthStore((state) => state.user);

        const { data: stats, isLoading } = useQuery<DashboardStats>({
            queryKey: ['dashboard-stats'],
            queryFn: async () => {
                const response = await api.get('/admin/stats');
                return response.data;
            },
        });

        return (
            <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content tracking-tight">
                            Bem-vindo, {user?.name?.split(' ')[0]}!
                        </h1>
                        <p className="text-base-content/60 mt-1">
                            Aqui está o resumo do seu conteúdo na plataforma.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="card-body p-5 flex flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-base-content">
                                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : stats?.subjects || 0}
                                </div>
                                <div className="text-sm text-base-content/60 font-medium">Matérias</div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="card-body p-5 flex flex-row items-center gap-4">
                            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                                <Layers className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-base-content">
                                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : stats?.grades || 0}
                                </div>
                                <div className="text-sm text-base-content/60 font-medium">Séries</div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="card-body p-5 flex flex-row items-center gap-4">
                            <div className="p-3 bg-warning/10 text-warning rounded-xl">
                                <Library className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-base-content">
                                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : stats?.units || 0}
                                </div>
                                <div className="text-sm text-base-content/60 font-medium">Unidades</div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="card-body p-5 flex flex-row items-center gap-4">
                            <div className="p-3 bg-accent/10 text-accent rounded-xl">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-base-content">
                                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : stats?.lessons || 0}
                                </div>
                                <div className="text-sm text-base-content/60 font-medium">Aulas</div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 border border-base-200 shadow-sm">
                        <div className="card-body p-5 flex flex-row items-center gap-4">
                            <div className="p-3 bg-neutral/10 text-neutral rounded-xl">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-base-content">
                                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : stats?.users || 0}
                                </div>
                                <div className="text-sm text-base-content/60 font-medium">Alunos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
});