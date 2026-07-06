import { Link, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../../stores/useAuthStore';
import { LayoutDashboard, BookOpen, Layers, FileText, Users, LogOut, Library } from 'lucide-react';

export function DashboardSidebar() {
    // Busca a função de logout da store
    const logout = useAuthStore((state) => state.logout);

    const navigate = useNavigate();

    // Redireciona para a Home ao deslogar
    const handleLogout = () => {
        logout();
        navigate({ to: '/' });
    };

    return (
        <aside className="w-64 bg-base-100 border-r border-base-200 hidden md:flex flex-col">
            <ul className="menu p-4 w-full gap-2 text-base-content/80 mt-4 flex-1">
                <li className="menu-title text-xs tracking-widest opacity-60">CONTEÚDO</li>
                <li>
                    <Link
                        to="/dashboard"
                        // Destaca o link correspondente a URL atual. O uso do exact: true é devido ao fato de todas as rotas iniciarem com "/dashboard"
                        activeProps={{ className: 'bg-primary/10 text-primary font-medium' }}
                        activeOptions={{ exact: true }}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Geral
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/materias" activeProps={{ className: 'bg-primary/10 text-primary font-medium' }}>
                        <BookOpen className="w-5 h-5" /> Matérias
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/series" activeProps={{ className: 'bg-primary/10 text-primary font-medium' }}>
                        <Layers className="w-5 h-5" /> Séries
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/unidades" activeProps={{ className: 'bg-primary/10 text-primary font-medium' }}>
                        <Library className="w-5 h-5" /> Unidades
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/aulas" activeProps={{ className: 'bg-primary/10 text-primary font-medium' }}>
                        <FileText className="w-5 h-5" /> Aulas
                    </Link>
                </li>

                <div className="divider my-2"></div>

                <li className="menu-title text-xs tracking-widest opacity-60">ADMINISTRAÇÃO</li>
                <li>
                    <Link to="/dashboard/usuarios" activeProps={{ className: 'bg-primary/10 text-primary font-medium' }}>
                        <Users className="w-5 h-5" /> Usuários
                    </Link>
                </li>
            </ul>

            <div className="p-4 border-t border-base-200">
                <button onClick={handleLogout} className="btn btn-ghost w-full justify-start text-error hover:bg-error/10">
                    <LogOut className="w-5 h-5" /> Sair
                </button>
            </div>
        </aside>
    );
}