import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import {
    LayoutDashboard,
    Users,
    Book,
    BookOpen,
    Trophy,
    Wallet,
    HeadphonesIcon,
    Award,
    Settings,
    LogOut,
    Bot,
    Bell,
    PanelTop,
    Briefcase,
    DollarSign,
    Globe,
    GraduationCap,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationBell from './NotificationBell';
import { useTranslation } from "react-i18next";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role !== 'ADMIN') {
                    // toast.error("Sizda Admin huquqi yo'q"); // Optional: Don't show toast if just redirecting? User asked for strict security.
                    navigate('/admin/login'); // Redirect to Admin Login directly as requested "srazu admin login page"
                }
            } catch (e) {
                navigate('/admin/login');
            }
        } else {
            navigate('/admin/login');
        }
    }, [navigate]);

    // Prevent rendering children if checking (simple check)
    const { t, i18n } = useTranslation();
    const userStr = localStorage.getItem('user');
    let isAdmin = false;
    try {
        if (userStr) {
            const user = JSON.parse(userStr);
            isAdmin = user.role === 'ADMIN';
        }
    } catch (e) { }

    if (!isAdmin) {
        return null; // Or a loader
    }

    const handleLogout = () => {
        // logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: t('admin.dashboard.title'), path: "/admin/dashboard" },
        { icon: Users, label: t('admin.users'), path: "/admin/users" },
        { icon: GraduationCap, label: t('admin.teachers'), path: "/admin/teachers" },
        { icon: BookOpen, label: t('admin.courses'), path: "/admin/courses" },
        { icon: Trophy, label: t('admin.olympiads.title'), path: "/admin/olympiads" },
        { icon: DollarSign, label: t('admin.finance'), path: "/admin/finance" },
        { icon: PanelTop, label: t('admin.cms'), path: "/admin/cms" },
        { icon: Briefcase, label: t('admin.professions'), path: "/admin/professions" },
        { icon: Book, label: t('admin.subjects'), path: "/admin/subjects" },
        { icon: Award, label: t('admin.certificates'), path: "/admin/certificates" },
        { icon: HeadphonesIcon, label: t('admin.support.title'), path: "/admin/support" },
        { icon: Bell, label: t('admin.notifications.title'), path: "/admin/notifications" },
        { icon: MessageSquare, label: t('admin.ai.title'), path: "/admin/ai-assistant" },
        { icon: Settings, label: t('admin.settings'), path: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen bg-muted/40 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r fixed inset-y-0 left-0 z-50 flex flex-col">
                <div className="p-6 border-b flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl text-foreground">Ardent Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 mb-1 ${isActive ? "bg-muted font-bold text-primary" : "text-muted-foreground"}`}
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
                        <span className="text-sm font-medium">{t('admin.darkMode')}</span>
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
                        {t('admin.logout')}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-end mb-6">
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            A
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
