import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronDown, PlayCircle, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import type { Subject, Grade, Unit, Lesson, BaseContentBlock } from '../../../types/entities';

// Interface para definir que este componente espera receber um objeto matéria, série, unidade e aula, além do índice da aula
interface LessonCardProps {
    subject: Subject;
    grade: Grade;
    unit: Unit;
    lesson: Lesson;
    index: number;
}

// Função auxiliar para mapear o tipo do bloco para um ícone
const getBlockIcon = (type: BaseContentBlock['type']) => {
    switch (type) {
        case 'VIDEO':
            return <PlayCircle className="w-4 h-4 text-secondary" />;
        case 'TEXT':
            return <BookOpen className="w-4 h-4 text-primary" />;
        case 'QUIZ':
            return <CheckCircle className="w-4 h-4 text-accent" />;
        default:
            return null;
    }
};

// Função auxiliar para traduzir o tipo
const getBlockLabel = (type: BaseContentBlock['type']) => {
    switch (type) {
        case 'VIDEO':
            return 'Vídeo';
        case 'TEXT':
            return 'Leitura';
        case 'QUIZ':
            return 'Exercício';
        default:
            return 'Conteúdo';
    }
};

export function LessonCard({ subject, grade, unit, lesson, index }: LessonCardProps) {
    // Seta o estado inicial do accordion do card
    const [expanded, setExpanded] = React.useState(false);
    
    // Pega a lista de blocos de conteúdo do objeto aula e a ordena baseada no orderIndex
    const blocks = [...(lesson.contentBlocks || [])].sort((a, b) => a.orderIndex - b.orderIndex);

    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl">
            <div className="card-body p-5 sm:p-6">
                {/* Cabeçalho do Card */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                        {/* Número da aula */}
                        <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                            {index + 1}
                        </div>

                        <div>
                            <Link
                                to="/materias/$subjectId/$gradeId/$unitId/$lessonId"
                                params={{ subjectId: subject.id, gradeId: grade.id, unitId: unit.id, lessonId: lesson.id }}
                                className="card-title text-base-content text-lg hover:text-secondary transition-colors duration-300 hover:underline"
                            >
                                {lesson.title}
                            </Link>

                            {/* Resumo visual dos ícones contidos na aula */}
                            <div className="flex items-center gap-3 mt-1 text-base-content/40">
                                {blocks.some((b) => b.type === 'VIDEO') && (
                                    <div className="tooltip tooltip-bottom" data-tip="Contém Vídeo">
                                        <PlayCircle className="w-4 h-4 cursor-help hover:text-secondary transition-colors" />
                                    </div>
                                )}
                                {blocks.some((b) => b.type === 'TEXT') && (
                                    <div className="tooltip tooltip-bottom" data-tip="Contém Leitura">
                                        <BookOpen className="w-4 h-4 cursor-help hover:text-primary transition-colors" />
                                    </div>
                                )}
                                {blocks.some((b) => b.type === 'QUIZ') && (
                                    <div className="tooltip tooltip-bottom" data-tip="Contém Exercícios">
                                        <CheckCircle className="w-4 h-4 cursor-help hover:text-accent transition-colors" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/materias/$subjectId/$gradeId/$unitId/$lessonId"
                        params={{
                            subjectId: subject.id,
                            gradeId: grade.id,
                            unitId: unit.id,
                            lessonId: lesson.id,
                        }}
                        className="btn btn-primary sm:w-auto w-full hover:bg-secondary hover:border-secondary transition-colors duration-300"
                    >
                        {blocks.length === 0 ? 'Em Breve' : 'Iniciar Aula'}
                    </Link>
                </div>

                {/* Descrição */}
                <p className="text-base-content/80 text-sm md:text-base mt-2">
                    {lesson.description || 'Sem descrição disponível para esta aula.'}
                </p>

                {/* Botão Expandir */}
                <div className="card-actions justify-end mt-4">
                    <button
                        className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors duration-300"
                        onClick={() => setExpanded(!expanded)}
                    >
                        Ver roteiro da aula
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Trilha Visual */}
                <div
                    className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                    <div className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-base-200">
                            {blocks.length === 0 ? (
                                <p className="text-sm text-base-content/50 italic text-center py-2">
                                    Roteiro de estudos em desenvolvimento.
                                </p>
                            ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                    {blocks
                                        .sort((a, b) => a.orderIndex - b.orderIndex)
                                        .map((block, idx) => (
                                            <React.Fragment key={block.id}>
                                                <div className="flex items-center gap-1.5 bg-base-200 px-3 py-1.5 rounded-full text-sm font-medium text-base-content/80 shadow-sm border border-base-300/50">
                                                    {getBlockIcon(block.type)}
                                                    <span>{getBlockLabel(block.type)}</span>
                                                </div>

                                                {idx < blocks.length - 1 && <ArrowRight className="w-4 h-4 text-base-content/30" />}
                                            </React.Fragment>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
