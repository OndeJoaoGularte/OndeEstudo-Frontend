import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';
import logoSrc from '../assets/ondeestudo.png';

export const Route = createFileRoute('/_auth')({
    component: function AuthLayout() {
        return (
            <div className="min-h-screen w-full flex bg-base-100 font-sans relative overflow-hidden">
                
                {/* Formulário de Login/Cadastro */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10 bg-base-100">
                    <div className="absolute top-8 left-8 sm:left-16 md:left-24 xl:left-32">
                        <Link to="/" className="btn btn-ghost btn-sm px-2 gap-2 text-base-content/70 hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar ao Início
                        </Link>
                    </div>

                    <div className="w-full max-w-md mx-auto mt-16 lg:mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="lg:hidden mb-8">
                            <img src={logoSrc} alt="Onde Estudo" className="h-12 w-auto object-contain" />
                        </div>

                        <Outlet />
                    </div>
                </div>

                {/* Lado Decorativo */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12 xl:p-24 border-l border-base-200">
                    
                    <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-secondary/20 to-accent/30 opacity-70"></div>
                    
                    <div className="absolute top-[-10%] right-[-10%] w-125 h-125 rounded-full bg-primary/40 blur-3xl opacity-60 mix-blend-multiply pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 rounded-full bg-secondary/40 blur-3xl opacity-60 mix-blend-multiply pointer-events-none"></div>
                    <div className="absolute top-[30%] left-[20%] w-75 h-75 rounded-full bg-accent/30 blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>

                    {/* Card Flutuante */}
                    <div className="relative z-9 w-full max-w-lg text-center flex flex-col items-center">
                        <img src={logoSrc} alt="Onde Estudo" className="h-24 w-auto object-contain mb-8 drop-shadow-xl" />

                        <div className="bg-base-100/70 backdrop-blur-xl border border-base-100/50 p-8 rounded-3xl shadow-2xl text-left transform hover:scale-[1.02] transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-4 text-primary">
                                <Sparkles className="w-6 h-6" />
                                <h3 className="font-bold text-xl text-base-content">Sua central de estudos.</h3>
                            </div>
                            
                            <p className="text-base-content/90 text-lg leading-relaxed mb-8 font-medium">
                                "Quando não souber por onde começar (ou Onde Estudar), estaremos aqui!"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-full ring ring-primary bg-neutral flex items-center justify-center p-1.5 shadow-md">
                                        <img src="/ondeestudologo.png" alt="Equipe Onde Estudo" className="object-contain" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-base text-base-content">Equipe Onde Estudo</span>
                                    <span className="text-sm text-base-content/70">Democratizando o conhecimento</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});