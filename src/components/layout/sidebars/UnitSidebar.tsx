import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronDown, PlayCircle, BookOpen, CheckCircle } from 'lucide-react';
import type { Subject, Grade, Unit, BaseContentBlock } from '../../../types/entities';

// Interface para definir que este componente espera receber um objeto matéria, um objeto série e um objeto unidade
interface UnitSidebarProps {
    subject: Subject;
    grade: Grade;
    unit: Unit;
}

// Mapeia o tipo do bloco de conteúdo retornado pelo banco para um ícone visual específico.
const getBlockIcon = (type: BaseContentBlock['type']) => {
    switch (type) {
        case 'VIDEO':
            return <PlayCircle className="w-4 h-4 text-secondary shrink-0" />;
        case 'TEXT':
            return <BookOpen className="w-4 h-4 text-primary shrink-0" />;
        case 'QUIZ':
            return <CheckCircle className="w-4 h-4 text-accent shrink-0" />;
        default:
            return null;
    }
};

export function UnitSidebar({ subject, grade, unit }: UnitSidebarProps) {
    // Pega a lista de aulas do objeto unidade e a ordena baseada no orderIndex
    const lessons = [...(unit.lessons || [])].sort((a, b) => a.orderIndex - b.orderIndex);

    // Gerenciamento de estado para o Accordion. Guarda um Record em que a chave é o ID da aula e o valor é booleano, sendo true para aberto e false para fechado
    const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});

    // Alterna o estado entre aberto e fechado para uma aula específica
    const toggleLesson = (lessonId: string) => {
        setExpandedLessons((prev) => ({
            ...prev,
            [lessonId]: !prev[lessonId],
        }));
    };

    return (
        <aside className="sticky top-40 h-[80vh] overflow-y-auto border-r border-base-200 pr-4 hide-scrollbar">
            {/* Cabeçalho */}
            <div className="p-2 mb-2">
                <h2 className="text-2xl font-bold text-base-content">
                    {subject.name}
                </h2>
                <p className="text-base text-base-content/80 mt-1 font-medium">
                    {grade.name}
                </p>
                <p className="text-base text-primary font-bold">
                    {unit.title}
                </p>
            </div>

            <hr className="border-base-300 mb-4 mx-1" />

            {/* Renderização das Aulas */}
            {lessons.length === 0 ? (
                <p className="text-base text-base-content/60 italic p-2 text-center">
                    Nenhuma aula disponível para esta unidade.
                </p>
            ) : (
                <div className="flex flex-col gap-4 w-full px-2">
                    {/* Mapeia a lista de aulas */}
                    {lessons.map((lesson, index) => {
                        // Verifica se o Accordion está aberto ou fechado
                        const isExpanded = !!expandedLessons[lesson.id];

                        // Pega a lista de blocos de conteúdo do objeto aula e a ordena baseada no orderIndex
                        const blocks = [...(lesson.contentBlocks || [])].sort((a, b) => a.orderIndex - b.orderIndex);

                        return (
                            <div key={lesson.id} className="flex flex-col">

                                <div className="flex items-center justify-between group">
                                    <Link
                                        to="/materias/$subjectId/$gradeId/$unitId/$lessonId"
                                        params={{ subjectId: subject.id, gradeId: grade.id, unitId: unit.id, lessonId: lesson.id }}
                                        className="flex-1 py-1 text-base text-base-content/80 transition-colors hover:text-primary group/link pr-2"
                                        // Destaca a aula correspondente a URL atual
                                        activeProps={{ className: 'text-primary font-bold' }}
                                        // Garante que o link atual abra o Accordion automaticamente
                                        onClick={() => setExpandedLessons((prev) => ({ ...prev, [lesson.id]: true }))}
                                    >
                                        <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-2 line-clamp-2 leading-tight">
                                            {index + 1}. {lesson.title}
                                        </span>
                                    </Link>

                                    {/* Botão para abrir e fechar a lista de blocos de conteúdo */}
                                    <button
                                        type="button"
                                        onClick={() => toggleLesson(lesson.id)}
                                        className={`p-1 shrink-0 transition-colors duration-200 
                      ${isExpanded ? 'text-primary' : 'text-base-content/40 hover:text-primary'}`}
                                        title={isExpanded ? "Recolher etapas" : "Ver etapas"}
                                    >
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">

                                        <ul className="pl-4 flex flex-col gap-2 border-l-2 border-base-200 ml-2 mb-2">
                                            {blocks.length === 0 ? (
                                                <li className="text-sm text-base-content/50 italic py-1">
                                                    Nenhuma etapa cadastrada.
                                                </li>
                                            ) : (
                                                // Mapeia e renderiza os blocos de conteúdo da aula
                                                blocks.map((block) => (
                                                    <li key={block.id} className="flex items-start gap-2 py-1 text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors">
                                                        <div className="mt-0.5">
                                                            {getBlockIcon(block.type)}
                                                        </div>
                                                        <span className="line-clamp-2 leading-tight">
                                                            {block.title}
                                                        </span>
                                                    </li>
                                                ))
                                            )}
                                        </ul>

                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </aside>
    );
}