import { CheckCircle2 } from 'lucide-react';

// Interface para definir que este componente espera receber um valor de progresso e uma classe opcional para customização
interface ProgressIconProps {
    progress: number;
    className?: string;
}

export function ProgressIcon({ progress, className = 'w-6 h-6' }: ProgressIconProps) {
    // Evita que o valor do progresso seja menor que 0 ou maior que 100, garantindo que o SVG não quebre
    const clampedProgress = Math.max(0, Math.min(100, progress));

    // Se o progresso for 100%, retorna um ícone de "Concluído" em vez do círculo de progresso
    if (clampedProgress === 100) {
        return (
            <CheckCircle2
                className={`text-success ${className}`}
                strokeWidth={2.5}
                aria-label="Concluído"
                role="img"
            />
        );
    }

    const radius = 9;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <svg className={`transform -rotate-90 ${className}`} viewBox="0 0 24 24">
            <circle
                cx="12"
                cy="12"
                r={radius}
                stroke="currentColor"
                strokeWidth="2.5"
                fill="transparent"
                className="text-base-300"
            />

            <circle
                cx="12"
                cy="12"
                r={radius}
                stroke="currentColor"
                strokeWidth="2.5"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`text-primary transition-all duration-700 ease-out ${progress === 0 ? 'opacity-0' : 'opacity-100'}`}
            />
        </svg>
    );
}
