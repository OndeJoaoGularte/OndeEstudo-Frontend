import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { GradeSidebar } from '../../components/layout/sidebars/GradeSidebar';
import { UnitCard } from '../../components/ui/cards/UnitCard';
import type { Grade } from '../../types/entities';
import { api } from '../../lib/api';

export const Route = createFileRoute('/materias/$subjectId/$gradeId/')({
  component: function GradePage() {
    const { gradeId } = Route.useParams();
    
        const { data: grade, isLoading, isError } = useQuery<Grade>({
          queryKey: ['grade', gradeId],
          queryFn: async () => {
            const response = await api.get(`/grades/${gradeId}`);
            return response.data;
          },
          enabled: !!gradeId,
        });

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      );
    }

    if (isError || !grade || !grade.subject) {
      return (
        <div className="text-center p-10">
          <p className="text-error font-semibold text-lg">Série não encontrada.</p>
          <Link to="/" className="btn btn-outline mt-4">Voltar para Início</Link>
        </div>
      );
    }

    const subject = grade.subject;
    const units = grade.units || [];

    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <GradeSidebar subject={subject} grade={grade} />
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
                <li>
                  <Link
                    to="/materias/$subjectId"
                    params={{ subjectId: subject.id }}
                    className="hover:text-primary transition-colors"
                  >
                    {subject.name}
                  </Link>
                </li>
                <li className="font-medium text-base-content">{grade.name}</li>
              </ul>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{grade.name}</h1>
            <p className="text-lg text-base-content/80 max-w-3xl leading-relaxed mb-8">
              Escolha uma das unidades abaixo para iniciar seus estudos.
            </p>

            <hr className="border-base-200 mb-8" />

            {/* Cards das Unidades */}
            {units.length === 0 ? (
              <div className="bg-base-200/50 rounded-2xl p-8 border border-base-200 text-center">
                <p className="text-lg text-base-content/70">Nenhuma unidade disponível para esta série ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {units.map((unit) => (
                  <UnitCard key={unit.id} subject={subject} grade={grade} unit={unit} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
});
