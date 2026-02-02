import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    ChevronLeft,
    ArrowRight,
    CheckCircle2,
    Clock,
    TrendingUp,
    Target,
    Zap,
    Users,
    Rocket,
    Brain,
    Coins,
    Lock,
    Play,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import api from "@/services/api";
import { toast } from "sonner";
import * as Icons from "lucide-react";

interface RoadmapStep {
    id: number;
    title: string;
    description: string;
    step_type_display: string;
    course_id: number | null;
    course_title: string | null;
    is_mandatory: boolean;
    is_course_completed: boolean;
    order: number;
}

interface Profession {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    suitability: string;
    requirements: string;
    salary_range: string;
    learning_time: string;
    certification_info: string;
    career_opportunities: string;
    roadmap_steps: RoadmapStep[];
    user_progress?: {
        progress_percent: number;
        status: string;
    };
}

const ProfessionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [profession, setProfession] = useState<Profession | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        fetchProfession();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProfession = async () => {
        try {
            const res = await api.get(`/professions/${id}/`);
            setProfession(res.data);
        } catch (error) {
            console.error(error);
            toast.error(t('common.error', "Xatolik yuz berdi"));
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth/login');
            return;
        }

        setIsEnrolling(true);
        try {
            await api.post(`/professions/${id}/enroll/`, {});
            toast.success(t('professions.enrolled_success', "Yo'nalishga muvaffaqiyatli qo'shildingiz!"));
            fetchProfession();
        } catch (error) {
            console.error(error);
            toast.error(t('common.error', "Xatolik yuz berdi"));
        } finally {
            setIsEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!profession) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <Brain className="w-20 h-20 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-4">{t('professions.not_found', "Kasb topilmadi")}</h2>
                <Link to="/">
                    <Button>{t('common.back', "Orqaga")}</Button>
                </Link>
            </div>
        );
    }

    // Dynamic Icon
    const Icon = (Icons as any)[profession.icon] || Icons.Briefcase;
    const colorClass = profession.color || "from-blue-500 to-indigo-600";
    const bgLightClass = colorClass.replace('from-', 'bg-').split(' ')[0] + '/10';

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <main className="flex-grow pt-28 pb-20">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <Link to="/" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-8 group transition-all">
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        {t('professions.all', "Barcha kasblar")}
                    </Link>

                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-[3rem] bg-card border border-border shadow-2xl mb-12">
                        <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${colorClass} opacity-5 blur-[100px] -mr-48 -mt-48 rounded-full`} />

                        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-10">
                            <div className="flex-shrink-0">
                                <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] bg-gradient-to-br ${colorClass} flex items-center justify-center rotate-6 shadow-2xl`}>
                                    <Icon className="w-16 h-16 md:w-24 md:h-24 text-white -rotate-6" />
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bgLightClass} text-primary font-bold text-xs uppercase tracking-widest mb-6`}>
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    {t('professions.badge', "Kelajak Kasblari")}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-foreground leading-[1.1]">
                                    {profession.name} <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                                        Roadmap 2025
                                    </span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
                                    {profession.description}
                                </p>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="border-t border-border bg-muted/30 p-8 md:px-16">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm border border-border text-primary">
                                        <Coins className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{t('professions.avg_salary', "Maosh")}</div>
                                        <div className="text-lg font-black">{profession.salary_range || "---"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm border border-border text-purple-500">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{t('common.duration', "Vaqt")}</div>
                                        <div className="text-lg font-black">{profession.learning_time || "---"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm border border-border text-orange-500">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{t('common.difficulty', "Qiyinchilik")}</div>
                                        <div className="text-lg font-black">{t('difficulty.medium', "O'rta")}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm border border-border text-emerald-500">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{t('common.progress', "Progress")}</div>
                                        <div className="text-lg font-black">{profession.user_progress?.progress_percent || 0}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Roadmap Section */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">{t('professions.view_roadmap', "O'rganish yo'li (Roadmap)")}</h2>
                                <div className="flex-1 h-px bg-border ml-4"></div>
                            </div>

                            <div className="space-y-6">
                                {profession.roadmap_steps.length > 0 ? (
                                    profession.roadmap_steps.map((step, idx) => (
                                        <div key={step.id} className={`group flex gap-6 p-8 bg-card rounded-[2rem] border transition-all ${step.is_course_completed ? 'border-green-500/50 bg-green-500/5' : 'border-border hover:border-primary/50'} hover:shadow-xl`}>
                                            <div className="flex-shrink-0 relative">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${step.is_course_completed ? 'bg-green-500 text-white' : 'bg-muted group-hover:bg-primary group-hover:text-white'}`}>
                                                    {step.is_course_completed ? <CheckCircle2 className="w-7 h-7" /> : idx + 1}
                                                </div>
                                                {idx < profession.roadmap_steps.length - 1 && (
                                                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-primary/20 to-transparent" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                                    <h3 className="text-xl font-black group-hover:text-primary transition-colors">{step.title}</h3>
                                                    {step.course_id && (
                                                        <Link to={`/course/${step.course_id}`}>
                                                            <Button size="sm" variant={step.is_course_completed ? "outline" : "default"} className="rounded-xl h-8 text-xs">
                                                                {step.is_course_completed ? t('common.completed', "Tugatilgan") : t('common.start_course', "Kursni boshlash")}
                                                                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground font-medium mb-3">{step.description}</p>
                                                {step.course_title && (
                                                    <div className="flex items-center gap-2 text-primary font-bold text-xs bg-primary/5 px-3 py-1.5 rounded-lg w-fit">
                                                        <Play className="w-3 h-3 fill-current" />
                                                        {step.course_title}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-border">
                                        <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground font-bold">{t('professions.no_steps', "Hozircha yo'l xaritasi mavjud emas")}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-lg relative overflow-hidden">
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-primary" />
                                    {t('professions.why_this', "Bu kasb haqida")}
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">{t('professions.suitability', "Kimlar uchun mos?")}</h4>
                                        <p className="text-sm font-medium leading-relaxed">{profession.suitability || "---"}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">{t('professions.requirements', "Talablar")}</h4>
                                        <p className="text-sm font-medium leading-relaxed">{profession.requirements || "---"}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">{t('professions.career_opportunities', "Imkoniyatlar")}</h4>
                                        <p className="text-sm font-medium leading-relaxed">{profession.career_opportunities || "---"}</p>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    {profession.user_progress ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm font-bold">
                                                <span>{t('professions.your_progress', "Sizning natijangiz")}</span>
                                                <span className="text-primary">{profession.user_progress.progress_percent}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                                                    style={{ width: `${profession.user_progress.progress_percent}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground text-center italic">
                                                {t('professions.keep_going', "Davom eting, muvaffaqiyatga yaqin qoldingiz!")}
                                            </p>
                                        </div>
                                    ) : (
                                        <Button
                                            size="lg"
                                            className="w-full h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 group"
                                            onClick={handleEnroll}
                                            disabled={isEnrolling}
                                        >
                                            {isEnrolling ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    {t('professions.start_path', "Yo'lni boshlash")}
                                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Rocket className="w-24 h-24" />
                                </div>
                                <h3 className="text-2xl font-black mb-4">{t('professions.action_title', "Sertifikat oling!")}</h3>
                                <p className="text-indigo-100 font-medium mb-6 leading-relaxed">
                                    {profession.certification_info || t('professions.default_cert_info', "Barcha kurslarni tugatib, xalqaro darajadagi sertifikatga ega bo'ling.")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfessionDetailPage;
