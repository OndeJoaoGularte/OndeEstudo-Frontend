import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import type { Subject } from '../../../types/entities';
import { Link } from '@tanstack/react-router';

export function Navbar() {
    // hook do Tanstack Query para gerenciar a requisição, cache e os estados (carregamento, erro ou quando encontrar os dados). A chave (querykey) garante que o sistema faça uma única requisição relacionada a essa chave.
    const {
        data: subjects,
        isLoading,
        isError,
    } = useQuery<Subject[]>({
        queryKey: ['subjects'],
        queryFn: async () => {
            const response = await api.get('/subjects');
            return response.data;
        },
    });

    return (
        <nav className="bg-base-200/60 backdrop-blur-md">
            <div className="flex overflow-x-auto whitespace-nowrap px-8 py-3 gap-8 hide-scrollbar items-center justify-center-safe min-h-12">
                {/* Renderização baseada no estado da requisição */}
                {isLoading && <span className="loading loading-spinner loading-sm text-primary"></span>}

                {isError && <span className="text-sm text-error">Erro ao carregar matérias.</span>}

                {/* Mapeia a lista de matérias retornado pela API utilizando a interface criada no arquivo entities */}
                {subjects?.map((subject: Subject) => (
                    <Link
                        key={subject.id}
                        // Rota definida pelo Tanstack Router
                        to="/materias/$subjectId"
                        // Passa o ID para a URL
                        params={{ subjectId: subject.id }}
                        className="
              relative font-semibold text-base-content/70 transition-colors duration-300 hover:text-primary
              after:content-[''] after:absolute after:bottom-0 after:left-0 
              after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300
              hover:after:w-full
            "
                        // Destaca o link correspondente a URL atual
                        activeProps={{ className: 'text-primary after:w-full' }}
                    >
                        {subject.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}