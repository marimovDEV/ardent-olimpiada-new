import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    Users,
    LogOut,
    User,
    MessageSquare,
    Bell,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NotificationBell from './NotificationBell';
import { useTranslation } from "react-i18next";
import authService from "@/services/authService";

const TeacherLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Try to get from localStorage first for immediate UI
                const cachedUser = localStorage.getItem('user');
                if (cachedUser) {
                    setUser(JSON.parse(cachedUser));
                }

                // Call API to get fresh data
                const freshUser = await authService.getMe();
                if (freshUser) {
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                }
            } catch (error) {
                console.error("Failed to sync teacher profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Derived states
    const isAuthorized = user?.role === 'TEACHER';
    const isProfileComplete = user?.teacher_profile?.bio &&
        user?.teacher_profile?.specialization &&
        user?.teacher_profile?.verification_status === 'APPROVED';

    const isPending = !!(user?.teacher_profile?.verification_status === 'PENDING' && user?.teacher_profile?.bio);

    useEffect(() => {
        if (!loading && !isAuthorized) {
            navigate('/teacher/login');
            return;
        }

        if (!loading) {
            // If on onboarding page, allow it
            if (location.pathname === '/teacher/onboarding') return;

            // If profile not complete, not pending, and not on onboarding, force redirection
            if (!isProfileComplete && !isPending && location.pathname !== '/teacher/onboarding') {
                navigate('/teacher/onboarding');
            }
        }
    }, [navigate, isAuthorized, isProfileComplete, isPending, location.pathname, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/teacher/login');
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: t('teacher.dashboard.title'), path: "/teacher/dashboard" },
        { icon: BookOpen, label: t('teacher.courses.title'), path: "/teacher/courses" },
        { icon: Trophy, label: t('teacher.olympiads.title'), path: "/teacher/olympiads" },
        { icon: Users, label: t('teacher.dashboard.stats.students'), path: "/teacher/students" },
        { icon: MessageSquare, label: t('nav.messages'), path: "/teacher/messages" },
        { icon: User, label: t('nav.profile'), path: "/teacher/profile" },
    ];

    return (
        <div className="min-h-screen bg-muted/40 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r fixed inset-y-0 left-0 z-50 flex flex-col">
                <div className="p-6 border-b flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl">Ardent Mentor</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {!isProfileComplete && !isPending && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800/30 mb-4">
                            <p className="text-[11px] font-black uppercase tracking-widest text-yellow-700 dark:text-yellow-500 mb-2">
                                {t('teacher.onboarding.attentionTitle')}
                            </p>
                            <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400 leading-tight">
                                {t('teacher.onboarding.attentionDescription')}
                            </p>
                        </div>
                    )}

                    {isPending && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800/30 mb-4">
                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-500 mb-2">
                                {t('teacher.onboarding.pendingTitle')}
                            </p>
                            <p className="text-xs font-bold text-blue-800 dark:text-blue-400 leading-tight">
                                {t('teacher.onboarding.pendingDescription')}
                            </p>
                        </div>
                    )}
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    disabled={!isProfileComplete && item.path !== '/teacher/profile' && item.path !== '/teacher/onboarding'}
                                    className={`w-full justify-start gap-3 mb-1 ${isActive ? "bg-indigo-50 dark:bg-indigo-900/20 font-bold text-indigo-600 dark:text-indigo-400" : "text-muted-foreground opacity-70"}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-sm font-medium">{t('dashboard.navbar.settings')}</span>
                        <ThemeToggle />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center gap-2 mb-2"
                        onClick={() => i18n.changeLanguage(i18n.language === 'uz' ? 'ru' : 'uz')}
                    >
                        <Globe className="w-4 h-4" />
                        {i18n.language === 'uz' ? '🇺🇿 O\'zbek' : '🇷🇺 Русский'}
                    </Button>
                    <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        {t('common.exit')}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        {/* Dynamic Header could go here, or empty for now */}
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        {user?.avatar_url || user?.avatar ? (
                            <img
                                src={
                                    user.avatar_url?.startsWith('http')
                                        ? user.avatar_url
                                        : user.avatar?.startsWith('http')
                                            ? user.avatar
                                            : `http://localhost:8000${user.avatar_url || user.avatar}`
                                }
                                alt={user.first_name || 'Teacher'}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <div className={`w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold ${(user?.avatar_url || user?.avatar) ? 'hidden' : ''}`}>
                            {user?.first_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'T'}
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;
