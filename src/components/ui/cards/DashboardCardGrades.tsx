import { Layers, BookOpen, Edit3, Trash2 } from 'lucide-react';

// Interface para definir os dados que o card de Grade espera receber
interface GradeDashboard {
    id: string;
    name: string;
    orderIndex: number;
    subject?: {
        id: string;
        name: string;
    };
}

// Interface para definir as propriedades que o card de Grade espera receber
interface DashboardCardGradesProps {
    grade: GradeDashboard;
    onEdit: (grade: GradeDashboard) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

export function DashboardCardGrades({ grade, onEdit, onDelete, isDeleting }: DashboardCardGradesProps) {
    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl flex flex-col justify-between">
            <div className="card-body p-5">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="card-title text-base-content text-lg font-bold truncate max-w-45">
                            {grade.name}
                        </h3>
                        <span className="text-xs text-base-content/40 font-mono">
                            Ordem: {grade.orderIndex}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1.5 rounded-xl w-fit max-w-full">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                        {grade.subject?.name || 'Sem matéria vinculada'}
                    </span>
                </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-base-100 flex justify-end gap-2 bg-base-50/30 rounded-b-2xl">
                <button
                    // Retorna o objeto 'subject' inteiro para o componente pai preencher o modal de edição
                    onClick={() => onEdit(grade)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-primary transition-colors"
                    title="Editar"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    // Retorna apenas o ID para a função de deletar
                    onClick={() => onDelete(grade.id)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-error transition-colors"
                    title="Excluir"
                    // Desabilita o botão se já existir uma requisição de delete rodando para este card
                    disabled={isDeleting}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}