import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();
    const navItems = [
        {
            name: '概览',
            path: '/',
        },
        {
            name: '市场',
            path: '/markets'
        }
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="font-bold text-xl tracking-tight text-blue-500">
                            Quant<span className="text-slate-100">Board</span>
                        </div>
                        <nav className="hidden md:flex gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                                        ? 'bg-slate-800 text-blue-400'
                                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}