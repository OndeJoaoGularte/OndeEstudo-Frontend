import { BookOpen, Edit3, Trash2 } from 'lucide-react';

// Interface para definir os dados que o card de Subject espera receber
interface SubjectDashboard {
    id: string;
    name: string;
    shortDescription: string;
}

// Interface para definir as propriedades que o card de Subject espera receber
interface DashboardCardSubjectProps {
    subject: SubjectDashboard;
    // Função de callback para editar o subject, recebe o objeto subject completo
    onEdit: (subject: SubjectDashboard) => void;
    // Função de callback para deletar o subject, recebe apenas o ID
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

export function DashboardCardSubject({ subject, onEdit, onDelete, isDeleting }: DashboardCardSubjectProps) {
    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl flex flex-col justify-between">
            <div className="card-body p-5">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="card-title text-base-content text-lg truncate">{subject.name}</h3>
                </div>
                <p className="text-sm text-base-content/70 line-clamp-3 mb-4">
                    {subject.shortDescription}
                </p>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-base-100 flex justify-end gap-2 bg-base-50/30 rounded-b-2xl">
                <button
                    // Retorna o objeto 'subject' inteiro para o componente pai preencher o modal de edição
                    onClick={() => onEdit(subject)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-primary transition-colors"
                    title="Editar"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    // Retorna apenas o ID para a função de deletar
                    onClick={() => onDelete(subject.id)}
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