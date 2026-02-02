import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bell,
    Search,
    Menu,
    ChevronDown,
    LogOut,
    User as UserIcon,
    Settings,
    Trophy,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArdCoin from './ArdCoin';
import NotificationBell from './NotificationBell';
import PaymentModal from './payment/PaymentModal';
import LevelProgressModal from './dashboard/LevelProgressModal';

const API_BASE = 'http://localhost:8000/api';

interface NavbarProps {
    onMobileMenuClick?: () => void;
}

import { useTranslation } from 'react-i18next';

// ... imports

const DashboardNavbar = ({ onMobileMenuClick }: NavbarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>({});
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

    // Use user data instead of hardcoded mock
    const level = user.level || 1;
    const xp = user.xp || 0;
    const currentLevelProgress = user.level_progress?.xp_current || 0;
    const xpLeft = user.level_progress?.xp_left || 500;
    const progressPercent = user.level_progress?.progress_percent || 0;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Load user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const getRoleLabel = (role: string) => {
        if (role === 'ADMIN') return t('dashboard.navbar.roles.admin');
        if (role === 'TEACHER') return t('dashboard.navbar.roles.teacher');
        return t('dashboard.navbar.roles.student');
    };

    return (
        <header
            className={`sticky top-0 z-30 w-full transition-all duration-300 ${scrolled
                ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border'
                : 'bg-transparent'
                }`}
        >
            <div className="h-20 px-4 md:px-8 flex items-center justify-between gap-4">

                {/* Mobile Menu Trigger */}
                <div className="flex items-center gap-2 lg:hidden">
                    <Button variant="ghost" size="icon" onClick={onMobileMenuClick}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>

                {/* Left Side (Desktop: Search or Title) */}
                <div className="hidden lg:flex items-center gap-4 flex-1">
                    <div className="relative w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={t('dashboard.navbar.search')}
                            className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                {/* Right Side: Stats & Profile */}
                <div className="flex items-center gap-3 md:gap-6">

                    {/* Level & XP Widget */}
                    <div
                        className="hidden md:flex items-center gap-3 bg-background/50 p-1.5 pr-4 rounded-full border border-border hover:border-primary/20 transition-all cursor-pointer group relative active:scale-95"
                        onClick={() => setIsProgressModalOpen(true)}
                    >
                        {/* Level Badge */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                            {level}
                        </div>

                        {/* XP Bar */}
                        <div className="flex flex-col gap-0.5 min-w-[100px]">
                            <div className="flex justify-between items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                <span>{xp} XP</span>
                                <span className="text-primary/70">{t('dashboard.navbar.xpLeft', { xp: xpLeft })}</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000 group-hover:animate-pulse"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute top-full right-0 mt-2 w-48 p-3 bg-popover rounded-xl shadow-xl border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <p className="text-xs text-muted-foreground mb-1">{t('dashboard.navbar.currentLevel')} <span className="text-foreground font-bold">{level}</span></p>
                            <p className="text-xs text-muted-foreground">{t('dashboard.navbar.nextLevelText')} <span className="text-primary font-bold">{xpLeft} XP</span> {t('dashboard.navbar.collectXp')}</p>
                        </div>
                    </div>

                    {/* ArdCoin Balance */}
                    <div
                        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20 transition-colors"
                        onClick={() => setPaymentOpen(true)}
                    >
                        <ArdCoin amount={parseFloat(user.balance || 0)} className="scale-110" />
                    </div>

                    <PaymentModal
                        isOpen={paymentOpen}
                        onOpenChange={setPaymentOpen}
                        onSuccess={() => {
                            window.location.reload();
                        }}
                    />

                    {/* Notifications */}
                    <NotificationBell />

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-muted transition-colors outline-none group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                                        {user.first_name || user.username}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                                        {getRoleLabel(user.role)}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-muted border-2 border-background shadow-sm overflow-hidden relative">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                                            {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>{t('dashboard.navbar.myAccount')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <UserIcon className="w-4 h-4 mr-2" />
                                {t('dashboard.navbar.profile')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/settings')}>
                                <Settings className="w-4 h-4 mr-2" />
                                {t('dashboard.navbar.settings')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-500/10 cursor-pointer">
                                <LogOut className="w-4 h-4 mr-2" />
                                {t('dashboard.navbar.logout')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>

            <LevelProgressModal
                isOpen={isProgressModalOpen}
                onClose={() => setIsProgressModalOpen(false)}
                user={user}
            />
        </header>
    );
};

export default DashboardNavbar;
