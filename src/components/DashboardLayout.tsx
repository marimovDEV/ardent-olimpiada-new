import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    LayoutGrid,
    BookOpen,
    Trophy,
    Award,
    Zap,
    Menu,
    PlayCircle,
    LogOut,
    Moon,
    Sun,
    Globe,
    FileCheck
} from "lucide-react";
import SupportWidget from '@/components/support/SupportWidget';
import DashboardNavbar from "./DashboardNavbar";
import { useTranslation } from "react-i18next";

const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Authentication Check Only - No Role-Based Redirects
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/auth/login');
            return;
        }
        // Allow any authenticated user to access student dashboard
        // Teachers and Admins can view student perspective if needed
    }, [navigate]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path: string) => location.pathname === path;

    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'uz' ? 'ru' : 'uz';
        i18n.changeLanguage(newLang);
    };

    const menuItems = [
        { path: '/dashboard', label: t('dashboard.menu.home'), icon: LayoutGrid },
        { path: '/courses', label: t('dashboard.menu.allCourses'), icon: BookOpen },
        { path: '/my-courses', label: t('dashboard.menu.myCourses'), icon: PlayCircle },
        { path: '/olympiads', label: t('dashboard.menu.olympiads'), icon: Trophy },
        { path: '/results', label: t('dashboard.menu.results'), icon: Award },
        { path: '/my-certificates', label: 'Sertifikatlarim', icon: FileCheck },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
    };

    return (
        <div className="min-h-screen bg-muted/40 flex">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="p-8 pb-4">
                    <Link to="/" className="flex items-center gap-2 mb-6">
                        <img src="/logo.png" alt="Ardent Logo" decoding="async" className="w-8 h-8 rounded-xl object-contain" />
                        <span className="text-xl font-black text-foreground tracking-tight">Ardent</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group relative overflow-hidden ${isActive(item.path)
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${isActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                            <span className="relative z-10">{item.label}</span>
                            {isActive(item.path) && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 justify-center gap-2"
                            onClick={toggleLanguage}
                        >
                            <Globe className="w-4 h-4" />
                            {i18n.language === 'uz' ? '🇺🇿 O\'zbek' : '🇷🇺 Русский'}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3 px-4 rounded-xl h-11"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        {t('dashboard.menu.logout')}
                    </Button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-[100dvh]">

                {/* Fixed Premium Navbar */}
                <DashboardNavbar onMobileMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto w-full relative">
                    <Outlet />
                    {/* Floating Support Widget */}
                    <SupportWidget />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
