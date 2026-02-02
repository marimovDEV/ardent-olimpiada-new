import { useEffect, useState } from "react";
import { Users, BookOpen, Star, Clock, Video, Plus, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { WalletCard } from "@/components/teacher/WalletCard";

const TeacherDashboard = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [stats, setStats] = useState({
        students_count: 0,
        active_courses: 0,
        rating: 0,
        total_lessons: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }

        // Check if welcome message was shown in this session
        const welcomeShown = sessionStorage.getItem('teacher_welcome_shown');
        if (!welcomeShown) {
            setShowWelcome(true);
            sessionStorage.setItem('teacher_welcome_shown', 'true');
            // Hide after 3 seconds
            setTimeout(() => {
                setShowWelcome(false);
            }, 3000);
        }

        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/teacher/stats/`, { headers: getAuthHeader() });
            setStats(res.data);
        } catch (error) {
            console.error(error);
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const statItems = [
        { label: t('teacher.dashboard.stats.students'), value: stats.students_count, icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" },
        { label: t('teacher.dashboard.stats.courses'), value: stats.active_courses, icon: BookOpen, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/20" },
        { label: t('teacher.dashboard.stats.rating'), value: stats.rating, icon: Star, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/20" },
        { label: t('teacher.dashboard.stats.lessons'), value: stats.total_lessons, icon: Clock, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {/* Welcome Animation Overlay */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-1000 pointer-events-none
                ${showWelcome ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className={`text-center transition-transform duration-1000 ${showWelcome ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
                    <div className="inline-flex p-4 rounded-full bg-blue-100 text-blue-600 mb-6 shadow-lg shadow-blue-200 animate-bounce">
                        <Star className="w-12 h-12 fill-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                        {t('teacher.dashboard.welcome')}
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        {t('teacher.dashboard.welcomeMessage')}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{t('teacher.dashboard.title')}</h1>
                <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statItems.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 text-green-500 font-medium">
                                {t('teacher.dashboard.stats.realTime')}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('teacher.dashboard.quickActions')}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            <Link to="/teacher/courses">
                                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                                    <Plus className="w-4 h-4" /> {t('teacher.courses.newCourse')}
                                </Button>
                            </Link>
                            <Link to="/teacher/olympiads">
                                <Button variant="outline" className="gap-2">
                                    <Plus className="w-4 h-4" /> {t('teacher.olympiads.new')}
                                </Button>
                            </Link>
                            {/* Placeholder for future features */}
                            <Button variant="secondary" className="gap-2 opacity-50 cursor-not-allowed">
                                <Video className="w-4 h-4" /> {t('teacher.dashboard.googleMeet')}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Upcoming Classes Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('teacher.dashboard.recentActivity')}</CardTitle>
                            <CardDescription>{t('teacher.dashboard.recentActivityDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                {t('teacher.dashboard.noActivity')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <Card className={`${user?.teacher_profile?.is_premium ? 'bg-gradient-to-br from-indigo-600 to-purple-700' : 'bg-gradient-to-br from-slate-600 to-slate-700'} text-white border-none`}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {user?.teacher_profile?.is_premium ? t('teacher.dashboard.premiumTitle') : t('teacher.dashboard.premiumTitleStandard')}
                            </CardTitle>
                            <CardDescription className="text-indigo-100">{t('teacher.dashboard.ratingDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-2xl font-bold">{stats.rating}/5.0</span>
                            </div>
                            <p className="text-sm text-indigo-100 mb-4">
                                {t('teacher.dashboard.studentsSatisfied')}
                            </p>
                            {!user?.teacher_profile?.is_premium && (
                                <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                                    {t('teacher.dashboard.upgradeButton')}
                                </Button>
                            )}
                            {user?.teacher_profile?.is_premium && (
                                <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                                    {t('common.details')}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <WalletCard />
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;

