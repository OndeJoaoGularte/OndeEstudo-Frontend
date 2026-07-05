import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { UnitSidebar } from '../../components/layout/sidebars/UnitSidebar';
import { LessonCard } from '../../components/ui/cards/LessonCard';
import type { Unit } from '../../types/entities';
import { api } from '../../lib/api';

export const Route = createFileRoute('/materias/$subjectId/$gradeId/$unitId/')({
  component: function UnitPage() {
    const { unitId } = Route.useParams();

    const { data: unit, isLoading, isError } = useQuery<Unit>({
          queryKey: ['unit', unitId],
          queryFn: async () => {
            const response = await api.get(`/units/${unitId}`);
            return response.data;
          },
          enabled: !!unitId,
        });

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      );
    }

    if (isError || !unit || !unit.grade || !unit.grade.subject) {
      return (
        <div className="text-center p-10">
          <p className="text-error font-semibold text-lg">Unidade não encontrada ou incompleta.</p>
          <Link to="/" className="btn btn-outline mt-4">Voltar para Início</Link>
        </div>
      );
    }

    const grade = unit.grade;
    const subject = grade.subject!;
    const lessons = unit.lessons || [];

    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <UnitSidebar subject={subject} grade={grade} unit={unit} />
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
                <li>
                  <Link
                    to="/materias/$subjectId/$gradeId"
                    params={{ subjectId: subject.id, gradeId: grade.id }}
                    className="hover:text-primary transition-colors"
                  >
                    {grade.name}
                  </Link>
                </li>
                <li className="font-medium text-base-content truncate max-w-xs">{unit.title}</li>
              </ul>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{unit.title}</h1>
            <p className="text-lg text-base-content/80 max-w-3xl leading-relaxed mb-8">{unit.description}</p>

            <hr className="border-base-200 mb-8" />

            <h2 className="text-2xl font-bold text-base-content mb-6">Aulas disponíveis</h2>

            {/* Cards das Aulas */}
            <div className="flex flex-col gap-4">
              {lessons.length === 0 ? (
                <div className="text-center p-8 bg-base-100 rounded-2xl border border-base-200 border-dashed">
                  <p className="text-base-content/60">Nenhuma aula cadastrada nesta unidade ainda.</p>
                </div>
              ) : (
                lessons.map((lesson, index) => (
                  <LessonCard
                    key={lesson.id}
                    subject={subject}
                    grade={grade}
                    unit={unit}
                    lesson={lesson}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
