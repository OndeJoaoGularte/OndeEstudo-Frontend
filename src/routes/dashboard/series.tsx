import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Layers, Edit3, X, AlertCircle, Filter } from 'lucide-react';
import { api } from '../../lib/api';
import { DashboardCardGrades } from '../../components/ui/cards/DashboardCardGrades';
import { isAxiosError } from 'axios';

// Interfaces para garantir que o componente saiba o tipo de dado que vai receber da API
interface SubjectOption {
    id: string;
    name: string;
}

interface GradeDashboard {
    id: string;
    name: string;
    orderIndex: number;
    subject?: {
        id: string;
        name: string;
    };
}

export const Route = createFileRoute('/dashboard/series')({
    component: function DashboardSeries() {
        const queryClient = useQueryClient();
        const [isModalOpen, setIsModalOpen] = useState(false);

        const [filterSubjectId, setFilterSubjectId] = useState<string>('all');

        const [editingId, setEditingId] = useState<string | null>(null);
        const [formData, setFormData] = useState({ name: '', subjectId: '', orderIndex: 1 });
        const [formError, setFormError] = useState('');

        const { data: subjects = [] } = useQuery<SubjectOption[]>({
            queryKey: ['dashboard-subjects'],
            queryFn: async () => {
                const response = await api.get('/subjects');
                return response.data;
            },
        });

        const { data: grades = [], isLoading } = useQuery<GradeDashboard[]>({
            queryKey: ['dashboard-grades'],
            queryFn: async () => {
                const response = await api.get('/grades');
                return response.data;
            },
        });

        const filteredGrades = useMemo(() => {
            if (filterSubjectId === 'all') return grades;
            return grades.filter(grade => grade.subject?.id === filterSubjectId);
        }, [grades, filterSubjectId]);

        const closeModal = () => {
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', subjectId: '', orderIndex: 1 });
            setFormError('');
        };

        const createGradeMutation = useMutation({
            mutationFn: async () => {
                const response = await api.post('/grades', {
                    name: formData.name,
                    subjectId: formData.subjectId,
                    orderIndex: Number(formData.orderIndex),
                });
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard-grades'] });
                closeModal();
            },
            onError: (error: unknown) => {
                if (isAxiosError(error)) {
                    setFormError(error.response?.data?.error || 'Erro ao criar série.');
                } else {
                    setFormError('Erro inesperado ao criar série.');
                }
            },
        });

        const updateGradeMutation = useMutation({
            mutationFn: async () => {
                const response = await api.put(`/grades/${editingId}`, {
                    name: formData.name,
                    subjectId: formData.subjectId,
                    orderIndex: Number(formData.orderIndex),
                });
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard-grades'] });
                closeModal();
            },
            onError: (error: unknown) => {
                if (isAxiosError(error)) {
                    setFormError(error.response?.data?.error || 'Erro ao atualizar série.');
                } else {
                    setFormError('Erro inesperado ao atualizar série.');
                }
            },
        });

        const deleteGradeMutation = useMutation({
            mutationFn: async (id: string) => {
                await api.delete(`/grades/${id}`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dashboard-grades'] });
            },
        });

        const handleCreateClick = () => {
            setEditingId(null);
            setFormData({ name: '', subjectId: filterSubjectId === 'all' ? '' : filterSubjectId, orderIndex: 1 });
            setIsModalOpen(true);
        };

        const handleEditClick = (grade: GradeDashboard) => {
            setEditingId(grade.id);
            setFormData({
                name: grade.name,
                subjectId: grade.subject?.id || '',
                orderIndex: grade.orderIndex
            });
            setIsModalOpen(true);
        };

        const handleDeleteClick = (id: string) => {
            if (window.confirm('Tem certeza que deseja excluir esta série? Todas as unidades atreladas a ela também serão excluídas!')) {
                deleteGradeMutation.mutate(id);
            }
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!formData.name || !formData.subjectId || !formData.orderIndex) {
                setFormError('Todos os campos são obrigatórios.');
                return;
            }

            if (editingId) {
                updateGradeMutation.mutate();
            } else {
                createGradeMutation.mutate();
            }
        };

        const isSubmitting = createGradeMutation.isPending || updateGradeMutation.isPending;

        return (
            <div className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content tracking-tight">Gerenciar Séries</h1>
                        <p className="text-base-content/60 mt-1">
                            Cadastre as séries e vincule-as diretamente a uma matéria ativa no sistema.
                        </p>
                    </div>

                    <div className="form-control w-full md:w-72">
                        <label className="input input-bordered flex items-center gap-2 h-11 rounded-xl bg-base-100 focus-within:outline-none">
                            <Filter className="w-4 h-4 text-base-content/40" />
                            <select
                                className="bg-transparent text-sm text-base-content grow focus:outline-none cursor-pointer h-full font-medium"
                                value={filterSubjectId}
                                onChange={(e) => setFilterSubjectId(e.target.value)}
                            >
                                <option value="all" className="bg-base-100 text-base-content">Todas as Matérias</option>
                                {subjects.map((sub) => (
                                    <option key={sub.id} value={sub.id} className="bg-base-100 text-base-content">{sub.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {filteredGrades.map((grade) => (
                            <DashboardCardGrades
                                key={grade.id}
                                grade={grade}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                                isDeleting={deleteGradeMutation.isPending}
                            />
                        ))}

                        <div
                            onClick={handleCreateClick}
                            className="card border-2 border-dashed border-accent bg-accent/5 text-accent hover:bg-accent/10 hover:border-accent cursor-pointer transition-all duration-300 rounded-2xl flex flex-col items-center justify-center min-h-40 p-6 text-center group hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="p-4 rounded-full bg-accent/10 text-accent mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Plus className="w-8 h-8" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-base tracking-wide">Nova Série</span>
                            <span className="text-xs opacity-70 mt-1 max-w-45">Aloque um ano dentro da matéria selecionada</span>
                        </div>

                    </div>
                )}

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
                                {editingId ? <Edit3 className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-base-content">
                                    {editingId ? 'Editar Série' : 'Criar Nova Série'}
                                </h3>
                                <p className="text-xs text-base-content/50">
                                    {editingId ? 'Atualize as informações de alocação ou nomenclatura.' : 'Vincule este nível a um guarda-chuva de conteúdo.'}
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
                                    <span className="label-text font-semibold text-base-content/80">Selecione a Matéria PAI</span>
                                </label>
                                <select
                                    className="select select-bordered w-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-base rounded-xl font-normal"
                                    value={formData.subjectId}
                                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                >
                                    <option value="" disabled>Escolha a matéria correspondente...</option>
                                    {subjects.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-base-content/80">Nome da Série</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: 1º Ano, Módulo Básico, Avançado..."
                                    className="input input-bordered w-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-base rounded-xl"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-base-content/80">Ordem de Exibição</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Ex: 1 (aparece primeiro), 2, 3..."
                                    className="input input-bordered w-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-base rounded-xl"
                                    value={formData.orderIndex}
                                    onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
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
                                        editingId ? 'Atualizar Série' : 'Salvar Série'
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