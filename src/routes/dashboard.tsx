import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../stores/useAuthStore';
import { DashboardSidebar } from '../components/layout/sidebars/DashboardSidebar';

export const Route = createFileRoute('/dashboard')({
    beforeLoad: () => {
        const isLoggedIn = useAuthStore.getState().isLoggedIn;
        if (!isLoggedIn) {
            throw redirect({ to: '/login' });
        }
    },
    component: function DashboardLayout() {
        return (
            <div className="flex w-full min-h-[calc(100vh-4rem)] bg-base-200/50">
                
                {/* O componente isolado sendo chamado aqui */}
                <DashboardSidebar />

                {/* Área Dinâmica: Aqui entram as páginas específicas (Index, Materias, etc) */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <Outlet />
                </main>
                
            </div>
        );
    }
});