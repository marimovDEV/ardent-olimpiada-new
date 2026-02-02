import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, ChevronRight, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

const PublicOlympiadsPage = () => {
    const { t } = useTranslation();

    const olympiads = [
        {
            id: 1,
            title: t('olympiadMock.math_republic'),
            subject: t('filters.math'),
            date: t('olympiadMock.dates.jan_20') + ", 10:00",
            participants: 847,
            price: "50,000",
            gradient: "from-blue-500 to-indigo-600",
            iconColor: "text-white"
        },
        {
            id: 2,
            title: t('olympiadMock.physics_challenge'),
            subject: t('filters.physics'),
            date: t('olympiadMock.dates.jan_25') + ", 14:00",
            participants: 342,
            price: "35,000",
            gradient: "from-emerald-400 to-teal-500",
            iconColor: "text-white"
        },
        {
            id: 3,
            title: t('olympiadMock.informatics_hackathon'),
            subject: t('filters.informatics'),
            date: t('olympiadMock.dates.feb_1') + ", 09:00",
            participants: 521,
            price: "75,000",
            gradient: "from-orange-400 to-red-500",
            iconColor: "text-white"
        },
        {
            id: 4,
            title: t('olympiadMock.english_ielts'),
            subject: t('filters.english'),
            date: t('olympiadMock.dates.feb_5') + ", 11:00",
            participants: 120,
            price: "100,000",
            gradient: "from-purple-500 to-pink-500",
            iconColor: "text-white"
        },
        {
            id: 5,
            title: t('olympiadMock.chemistry_olympiad'),
            subject: t('filters.chemistry'),
            date: t('olympiadMock.dates.feb_10') + ", 10:00",
            participants: 450,
            price: "40,000",
            gradient: "from-pink-500 to-rose-500",
            iconColor: "text-white"
        },
        {
            id: 6,
            title: t('olympiadMock.biology_life'),
            subject: t('filters.biology'),
            date: t('olympiadMock.dates.feb_15') + ", 14:00",
            participants: 300,
            price: "40,000",
            gradient: "from-green-500 to-emerald-600",
            iconColor: "text-white"
        },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-blob opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-50" />
            </div>

            <Header />

            <main className="flex-1 pt-28 pb-20 container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur border border-border shadow-sm mb-6">
                        <Sparkles className="w-4 h-4 text-warning animate-pulse" />
                        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            {t('olympiadsSection.calendar_badge')}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        <Trans i18nKey="olympiadsSection.all_olympiads" components={{ 1: <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-xy" /> }} />
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('olympiadsSection.hero_desc')}
                    </p>
                </div>

                {/* Creative Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {olympiads.map((olympiad, index) => (
                        <div
                            key={olympiad.id}
                            className="group relative bg-card border border-border rounded-3xl p-1 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 dark:bg-white/5 dark:backdrop-blur-xl"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Inner Card */}
                            <div className="bg-background/50 dark:bg-card/40 rounded-[1.3rem] p-6 h-full flex flex-col relative overflow-hidden">
                                {/* Gradient Blob in Card */}
                                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${olympiad.gradient} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`} />

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${olympiad.gradient} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                                        <Trophy className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="bg-muted backdrop-blur px-3 py-1.5 rounded-xl border border-border shadow-sm">
                                        <span className="font-bold text-primary">{olympiad.price}</span>
                                        <span className="text-[10px] text-muted-foreground ml-1 uppercase">{t('olympiadsSection.currency')}</span>
                                    </div>
                                </div>

                                <div className="mb-6 relative z-10">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-warning" />
                                        {olympiad.subject}
                                    </span>
                                    <h3 className="font-bold text-xl leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
                                        {olympiad.title}
                                    </h3>
                                </div>

                                <div className="mt-auto space-y-3 relative z-10">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span>{olympiad.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span>{olympiad.participants} {t('olympiadsSection.participants')}</span>
                                    </div>
                                </div>

                                <Link to="/auth" className="mt-6 relative z-10">
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/20 rounded-xl h-12 font-medium group/btn">
                                        {t('olympiadsSection.register')}
                                        <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PublicOlympiadsPage;
