import { Palette } from 'lucide-react';

// arrays com os 32 temas do DaisyUI, separados por claro e escuro
const lightThemes = [
    'light',
    'acid',
    'autumn',
    'bumblebee',
    'cmyk',
    'corporate',
    'cupcake',
    'cyberpunk',
    'emerald',
    'fantasy',
    'garden',
    'lemonade',
    'lofi',
    'nord',
    'pastel',
    'retro',
    'valentine',
    'winter',
    'wireframe',
];

const darkThemes = [
    'dark',
    'aqua',
    'black',
    'business',
    'coffee',
    'dim',
    'dracula',
    'forest',
    'halloween',
    'luxury',
    'night',
    'sunset',
    'synthwave',
];

// função para renderizar cada item de tema, usada no dropdown de temas
const renderThemeItem = (theme: string) => (
    <li key={theme}>
        <label
            className="flex cursor-pointer gap-2 items-center hover:bg-base-200 rounded-lg p-2 transition-colors"
            onClick={(e) => {
                const details = e.currentTarget.closest('details');
                if (details) details.removeAttribute('open');
            }}
        >
            <input type="radio" name="theme-dropdown" className="theme-controller sr-only" value={theme} />
            <span data-theme={theme} className="grid grid-cols-2 gap-0.5 shrink-0 rounded-md p-1 bg-base-100">
                <span className="bg-primary w-1 h-1 rounded-sm"></span>
                <span className="bg-secondary w-1 h-1 rounded-sm"></span>
                <span className="bg-accent w-1 h-1 rounded-sm"></span>
                <span className="bg-neutral w-1 h-1 rounded-sm"></span>
            </span>
            <span className="text-sm font-medium text-base-content capitalize">{theme}</span>
        </label>
    </li>
);

export function ThemeDropdown() {
    return (
        <details className="dropdown dropdown-end">
            <summary className="btn btn-ghost btn-circle" title="Mudar Tema">
                <Palette className="w-6 h-6" />
            </summary>

            <div className="dropdown-content mt-4 z-1 p-4 shadow-lg bg-base-100 rounded-box w-64 sm:w-96 max-h-[70vh] overflow-y-auto border border-base-200 hide-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-base-content/60 mb-2 px-2 font-bold uppercase tracking-wider">
                            Temas Claros
                        </p>
                        <ul className="menu menu-sm p-0">{lightThemes.map(renderThemeItem)}</ul>
                    </div>

                    <div>
                        <p className="text-xs text-base-content/60 mb-2 px-2 font-bold uppercase tracking-wider">
                            Temas Escuros
                        </p>
                        <ul className="menu menu-sm p-0">{darkThemes.map(renderThemeItem)}</ul>
                    </div>
                </div>
            </div>
        </details>
    );
}