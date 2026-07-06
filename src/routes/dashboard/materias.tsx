import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, BookOpen, Edit3, X, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { DashboardCardSubject } from '../../components/ui/cards/DashboardCardSubject';
import { isAxiosError } from 'axios';

// Interface para garantir que o componente saiba o tipo de dado que vai receber da API
interface SubjectDashboard {
    id: string;
    name: string;
    shortDescription: string;
}

export const Route = createFileRoute('/dashboard/materias')({
    component: function DashboardMaterias() {
        const queryClient = useQueryClient();
        const [isModalOpen, setIsModalOpen] = useState(false);

        const [editingId, setEditingId] = useState<string | null>(null);
        const [formData, setFormData] = useState({ name: '', shortDescription: '' });
        const [formError, setFormError] = useState('');

        // 1. GET: BUSCA MATÉRIAS
        const { data: subjects = [], isLoading } = useQuery<SubjectDashboard[]>({
            queryKey: ['dashboard-subjects'],
            queryFn: async () => {
                const response = await api.get('/subjects');
                return response.data;
            },
        });

        const closeModal = () => {
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', shortDescription: '' });
            setFormError('');
        };

        const createSubjectMutation = useMutation({
            mutationFn: async () => {
                const response = await api.post('/subjects', formData);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard-subjects'] });
                closeModal();
            },
            onError: (error: unknown) => {
                if (isAxiosError(error)) {
                    setFormError(error.response?.data?.error || 'Erro ao criar matéria.');
                } else {
                    setFormError('Erro inesperado ao criar matéria.');
                }
            },
        });

        const updateSubjectMutation = useMutation({
            mutationFn: async () => {
                const response = await api.put(`/subjects/${editingId}`, formData);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard-subjects'] });
                closeModal();
            },
            onError: (error: unknown) => {
                if (isAxiosError(error)) {
                    setFormError(error.response?.data?.error || 'Erro ao atualizar matéria.');
                } else {
                    setFormError('Erro inesperado ao atualizar matéria.');
                }
            },
        });

        const deleteSubjectMutation = useMutation({
            mutationFn: async (id: string) => {
                await api.delete(`/subjects/${id}`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard-subjects'] });
            },
        });

        // --- HANDLERS DOS BOTÕES ---

        const handleCreateClick = () => {
            setEditingId(null);
            setFormData({ name: '', shortDescription: '' });
            setIsModalOpen(true);
        };

        const handleEditClick = (subject: SubjectDashboard) => {
            setEditingId(subject.id);
            setFormData({ name: subject.name, shortDescription: subject.shortDescription });
            setIsModalOpen(true);
        };

        const handleDeleteClick = (id: string) => {
            // Confirmação nativa do navegador por segurança
            if (window.confirm('Tem certeza que deseja excluir esta matéria? Todas as séries atreladas a ela também serão excluídas!')) {
                deleteSubjectMutation.mutate(id);
            }
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!formData.name || !formData.shortDescription) {
                setFormError('Todos os campos são obrigatórios.');
                return;
            }

            // Se tiver editingId, atualiza. Se não, cria.
            if (editingId) {
                updateSubjectMutation.mutate();
            } else {
                createSubjectMutation.mutate();
            }
        };

        const isSubmitting = createSubjectMutation.isPending || updateSubjectMutation.isPending;

        return (
            <div className="w-full">
                {/* Cabeçalho */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-base-content tracking-tight">Gerenciar Matérias</h1>
                    <p className="text-base-content/60 mt-1">
                        Visualize, edite ou crie a estrutura base do guarda-chuva de conteúdos da plataforma.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {/* Renderização do componente isolado via Map */}
                        {subjects.map((subject) => (
                            <DashboardCardSubject
                                key={subject.id}
                                subject={subject}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                                isDeleting={deleteSubjectMutation.isPending}
                            />
                        ))}

                        {/* Card de Adicionar */}
                        <div
                            onClick={handleCreateClick}
                            className="card border-2 border-dashed border-accent bg-accent/5 text-accent hover:bg-accent/10 hover:border-accent cursor-pointer transition-all duration-300 rounded-2xl flex flex-col items-center justify-center min-h-47.5 p-6 text-center group hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="p-4 rounded-full bg-accent/10 text-accent mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Plus className="w-8 h-8" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-base tracking-wide">Nova Matéria</span>
                            <span className="text-xs opacity-70 mt-1 max-w-45">Adicione um novo guarda-chuva de ensino</span>
                        </div>

                    </div>
                )}

                {/* MODAL INTELIGENTE (Adapta textos dependendo do editingId) */}
                <div className={`modal modal-bottom sm:modal-middle ${isModalOpen ? 'modal-open' : ''}`}>
                    <div className="modal-box border border-base-200 shadow-2xl rounded-2xl p-6 relative max-w-lg">

                        <button
                            onClick={closeModal}
                            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/50 hover:text-base-content"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                                {editingId ? <Edit3 className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-base-content">
                                    {editingId ? 'Editar Matéria' : 'Criar Nova Matéria'}
                                </h3>
                                <p className="text-xs text-base-content/50">
                                    {editingId ? 'Atualize as informações da matéria existente.' : 'Esta matéria servirá de raiz para as séries.'}
                                </p>
                            </div>
                        </div>

                        {formError && (
                            <div className="alert alert-error text-sm py-2.5 rounded-xl mb-4 animate-in fade-in">
                                <AlertCircle className="w-5 h-5" />
                                <span>{formError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-base-content/80">Nome da Matéria</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Filosofia, Matemática, História..."
                                    className="input input-bordered w-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-base rounded-xl"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-base-content/80">Descrição Curta</span>
                                </label>
                                <textarea
                                    placeholder="Uma breve introdução que aparecerá no card principal do aluno..."
                                    className="textarea textarea-bordered h-24 w-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-base rounded-xl resize-none leading-relaxed"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                />
                            </div>

                            <div className="modal-action gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-ghost rounded-xl px-5"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-accent text-accent-content font-bold px-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        editingId ? 'Atualizar Matéria' : 'Salvar Matéria'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop bg-neutral-focus/30 backdrop-blur-xs" onClick={closeModal}></div>
                </div>

            </div>
        );
    }
});