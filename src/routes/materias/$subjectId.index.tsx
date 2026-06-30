import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { SubjectSidebar } from '../../components/layout/sidebars/SubjectSidebar';
import { GradeCard } from '../../components/ui/cards/GradeCard';
import type { Subject } from '../../types/entities';
import { api } from '../../lib/api';

// O Tanstack Router mapeia o símbolo de dólar ($subjectId) para um parâmetro dinâmico na URL
export const Route = createFileRoute('/materias/$subjectId/')({
    component: function SubjectPage() {
        // Extrai o ID da matéria atual diretamente da URL com 100% de Type Safety
        const { subjectId } = Route.useParams();

        // Busca apenas os dados (com suas séries e unidades aninhadas) da matéria correspondente ao ID
        const {
            data: subject,
            isLoading,
            isError,
        } = useQuery<Subject>({
            // A queryKey inclui o ID para que o cache saiba diferenciar Matemática de História, por exemplo
            queryKey: ['subject', subjectId],
            queryFn: async () => {
                const response = await api.get(`/subjects/${subjectId}`);
                return response.data;
            },
        });

        if (isLoading) {
            return (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            );
        }

        if (isError || !subject) {
            return (
                <div className="text-center p-10">
                    <p className="text-error font-semibold text-lg">Matéria não encontrada.</p>
                    <Link to="/" className="btn btn-outline mt-4">Voltar para Início</Link>
                </div>
            );
        }

        return (
            <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="hidden lg:block lg:col-span-3">
                        <SubjectSidebar subject={subject} />
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="lg:col-span-9">

                        {/* Breadcrumbs */}
                        <div className="breadcrumbs text-xs text-base-content/60">
                            <ul>
                                <li>
                                    <Link to="/" className="hover:text-primary transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li className="font-medium text-base-content">{subject.name}</li>
                            </ul>
                        </div>
                        {/* Título e Descrição da matéria */}
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{subject.name}</h1>
                        <p className="text-lg text-base-content/70 mb-10 leading-relaxed">{subject.longDescription}</p>

                        {/* Grid de Séries */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {subject.grades?.map((grade) => (
                                <GradeCard key={grade.id} subject={subject} grade={grade} />
                            ))}
                            {(!subject.grades || subject.grades.length === 0) && (
                                <div className="col-span-full py-10 text-center bg-base-200/50 rounded-2xl border border-base-200">
                                    <p className="text-base-content/60">Nenhuma série cadastrada para esta matéria ainda.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
