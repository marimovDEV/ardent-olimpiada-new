import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Trophy,
    MapPin,
    ArrowRight,
    Star,
    Sparkles,
    Medal,
    Crown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { homepageService } from '@/services/homepageService';

interface Winner {
    id: number;
    rank: number;
    student_name: string;
    region: string;
    score: number;
    max_score: number;
}

interface OlympiadResult {
    id: number;
    title: string;
    subject: string;
    displaySubject?: string;
    date: string;
    stage: string;
    participants_count: number;
    winners: Winner[];
}

// Helper functions
const getMedalStyle = (rank: number, t: any) => {
    switch (rank) {
        case 1: return { bg: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500', border: 'border-yellow-200/50', text: 'text-yellow-950', glow: 'shadow-[0_0_25px_rgba(250,204,21,0.6)]', icon: '🥇', label: t('common.gold') };
        case 2: return { bg: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400', border: 'border-white/50', text: 'text-slate-900', glow: 'shadow-[0_0_25px_rgba(203,213,225,0.5)]', icon: '🥈', label: t('common.silver') };
        case 3: return { bg: 'bg-gradient-to-br from-orange-400 via-amber-600 to-amber-700', border: 'border-orange-300/50', text: 'text-white', glow: 'shadow-[0_0_25px_rgba(249,115,22,0.5)]', icon: '🥉', label: t('common.bronze') };
        default: return { bg: 'bg-gradient-to-br from-indigo-500 to-blue-700', border: 'border-blue-400/50', text: 'text-white', glow: 'shadow-blue-500/20', icon: '🏅', label: `${rank}-${t('common.ball')}` };
    }
};

const getSubjectTheme = (subjectKey: string) => {
    // Extract base subject key if it contains dot notation (e.g. "subjects.matematika" -> "matematika")
    const subject = subjectKey.includes('.') ? subjectKey.split('.')[1] : subjectKey;

    switch (subject?.toLowerCase()) {
        case 'matematika': return { gradient: 'from-blue-600 via-indigo-600 to-violet-700', glow: 'rgba(79, 70, 229, 0.7)', accent: 'bg-indigo-600' };
        case 'fizika': return { gradient: 'from-fuchsia-600 via-purple-600 to-indigo-800', glow: 'rgba(192, 38, 211, 0.7)', accent: 'bg-fuchsia-600' };
        case 'informatika': return { gradient: 'from-emerald-500 via-teal-600 to-cyan-700', glow: 'rgba(16, 185, 129, 0.7)', accent: 'bg-emerald-600' };
        case 'ingliz_tili': return { gradient: 'from-rose-500 via-red-600 to-orange-600', glow: 'rgba(244, 63, 94, 0.7)', accent: 'bg-rose-600' };
        case 'kimyo': return { gradient: 'from-cyan-500 via-sky-600 to-blue-700', glow: 'rgba(6, 182, 212, 0.7)', accent: 'bg-cyan-600' };
        default: return { gradient: 'from-slate-700 via-gray-800 to-zinc-900', glow: 'rgba(100, 116, 139, 0.6)', accent: 'bg-slate-600' };
    }
};

const PrideCarousel = () => {
    const { t, i18n } = useTranslation();
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [olympiads, setOlympiads] = useState<OlympiadResult[]>([]);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchWinners = async () => {
            try {
                const data = await homepageService.getPrideResults();
                if (data && data.length > 0) {
                    setOlympiads(data);
                } else {
                    setOlympiads(mockOlympiads);
                }
            } catch (e) {
                console.error(e);
                setOlympiads(mockOlympiads);
            }
        };
        fetchWinners();
    }, []);

    const mockOlympiads: OlympiadResult[] = [
        {
            id: 1,
            title: "mock.pride.math_2024",
            subject: "subjects.matematika",
            date: "2024-03-15",
            stage: "mock.stage.republic",
            participants_count: 1248,
            winners: [
                { id: 1, rank: 1, student_name: "Azizbek Toxirov", region: "Toshkent", score: 96, max_score: 100 },
                { id: 2, rank: 2, student_name: "Malika Karimova", region: "Samarqand", score: 93, max_score: 100 },
                { id: 3, rank: 3, student_name: "Javohir Aliyev", region: "Buxoro", score: 91, max_score: 100 }
            ]
        },
        {
            id: 2,
            title: "mock.pride.phys_2024",
            subject: "subjects.fizika",
            date: "2024-04-20",
            stage: "mock.stage.region",
            participants_count: 856,
            winners: [
                { id: 6, rank: 1, student_name: "Sardor Umarov", region: "Xorazm", score: 94, max_score: 100 },
                { id: 7, rank: 2, student_name: "Dilnoza Saidova", region: "Navoiy", score: 91, max_score: 100 },
                { id: 8, rank: 3, student_name: "Temur Qodirov", region: "Qashqadaryo", score: 88, max_score: 100 }
            ]
        },
        {
            id: 3,
            title: "mock.pride.it_2024",
            subject: "subjects.informatika",
            date: "2024-05-10",
            stage: "mock.stage.republic",
            participants_count: 624,
            winners: [
                { id: 11, rank: 1, student_name: "Shoxrux Abdullayev", region: "Toshkent", score: 98, max_score: 100 },
                { id: 12, rank: 2, student_name: "Laylo Mirzayeva", region: "Namangan", score: 95, max_score: 100 },
                { id: 13, rank: 3, student_name: "Doniyor Xolmatov", region: "Buxoro", score: 92, max_score: 100 }
            ]
        },
        {
            id: 4,
            title: "mock.pride.eng_2024",
            subject: "subjects.ingliz_tili",
            date: "2024-06-01",
            stage: "mock.stage.region",
            participants_count: 950,
            winners: [
                { id: 14, rank: 1, student_name: "Sevara Alimova", region: "Farg'ona", score: 99, max_score: 100 },
                { id: 15, rank: 2, student_name: "Bobur Tursunov", region: "Andijon", score: 96, max_score: 100 },
                { id: 16, rank: 3, student_name: "Guli Karimova", region: "Toshkent", score: 94, max_score: 100 }
            ]
        },
        {
            id: 5,
            title: "mock.pride.chem_2024",
            subject: "subjects.kimyo",
            date: "2024-06-15",
            stage: "mock.stage.republic",
            participants_count: 540,
            winners: [
                { id: 17, rank: 1, student_name: "Akmal Saidov", region: "Jizzax", score: 97, max_score: 100 },
                { id: 18, rank: 2, student_name: "Nigora Umarova", region: "Sirdaryo", score: 93, max_score: 100 },
                { id: 19, rank: 3, student_name: "Olimjon Valiev", region: "Xorazm", score: 90, max_score: 100 }
            ]
        }
    ];

    // Auto Rotation with Strict 3s Interval
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % mockOlympiads.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, mockOlympiads.length]);

    // Handle drag end
    const handleDragEnd = (event: any, info: any) => {
        const threshold = 50; // More sensitive drag
        if (info.offset.x < -threshold) {
            setIndex((prev) => (prev + 1) % mockOlympiads.length);
        } else if (info.offset.x > threshold) {
            setIndex((prev) => (prev - 1 + mockOlympiads.length) % mockOlympiads.length);
        }
    };

    // Card styling
    const getCardStyles = (i: number) => {
        const isActive = i === index;
        return isActive
            ? "scale-100 opacity-100 z-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-white/40 ring-1 ring-white/20"
            : "scale-[0.85] opacity-40 z-10 blur-[3px] grayscale-[0.5] border-white/5";
    };

    return (
        <section className="relative py-24 bg-background overflow-hidden min-h-[900px]">
            {/* Dynamic Background Glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-30 blur-[180px] pointer-events-none transition-colors duration-700"
                animate={{
                    backgroundColor: olympiads.length > 0 ? (
                        getSubjectTheme(olympiads[index]?.subject || 'default').accent.replace('bg-', '') === 'bg-indigo-600' ? '#4f46e5' :
                            getSubjectTheme(olympiads[index]?.subject || 'default').accent.replace('bg-', '') === 'bg-fuchsia-600' ? '#c026d3' :
                                getSubjectTheme(olympiads[index]?.subject || 'default').accent.replace('bg-', '') === 'bg-emerald-600' ? '#059669' :
                                    getSubjectTheme(olympiads[index]?.subject || 'default').accent.replace('bg-', '') === 'bg-rose-600' ? '#e11d48' : '#0891b2'
                    ) : '#0891b2'
                }}
            />

            <div className="container mx-auto px-4 relative z-20">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
                        <Crown className="w-4 h-4 fill-yellow-500" />
                        {t('carousel.badge')}
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-foreground mb-4 tracking-tighter">
                        {t('carousel.title')}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        {t('carousel.subtitle', { defaultValue: 'Discover the brilliant minds leading the future of science and technology.' })}
                    </p>
                </div>

                <div
                    className="flex justify-center items-center py-10 perspective-[1000px]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <motion.div
                        className="flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
                        drag="x"
                        dragConstraints={{ left: -100, right: 100 }} // Allow some movement
                        dragElastic={0.2} // Add elasticity
                        onDragEnd={handleDragEnd}
                        style={{ x: 0 }}
                        whileTap={{ cursor: "grabbing" }}
                    >
                        <div className="relative w-full max-w-7xl h-[600px] flex items-center justify-center">
                            {/* Render Items from Main State */}
                            {olympiads.length > 0 && olympiads.map((olympiad, i) => {
                                let offset = i - index;
                                if (offset < -2) offset += olympiads.length;
                                if (offset > 2) offset -= olympiads.length;

                                if (Math.abs(offset) > 2) return null;

                                const theme = getSubjectTheme(olympiad.subject);
                                const isActive = i === index;

                                return (
                                    <motion.div
                                        key={olympiad.id}
                                        className={`absolute w-[350px] md:w-[600px] h-[550px] rounded-[3rem] p-1.5 border backdrop-blur-3xl transition-all duration-500 ease-out flex flex-col overflow-hidden ${getCardStyles(i)}`}
                                        initial={false}
                                        whileInView={{ opacity: isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.4) }}
                                        viewport={{ once: true }}
                                        animate={{
                                            x: offset * (window.innerWidth < 768 ? 340 : 440),
                                            scale: isActive ? 1 : 0.85,
                                            opacity: isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.4),
                                            zIndex: 100 - Math.abs(offset),
                                            rotateY: offset * -15
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 250,
                                            damping: 25
                                        }}
                                    >
                                        <div className={`w-full h-full rounded-[2.7rem] overflow-hidden bg-gradient-to-br ${theme.gradient} relative shadow-2xl`}>

                                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlay"></div>
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-20 -mt-20 mix-blend-overlay" />
                                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full blur-[80px] -ml-20 -mb-20 mix-blend-multiply" />

                                            <div className="absolute top-8 right-8 flex flex-col gap-4 z-20">
                                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg transform rotate-3">
                                                    <Trophy className="w-8 h-8 text-yellow-300 drop-shadow-md" />
                                                </div>
                                            </div>

                                            <div className="relative z-10 p-10 flex flex-col h-full justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <span className="px-4 py-1.5 rounded-xl bg-black/30 backdrop-blur-md text-white text-[11px] font-black tracking-widest uppercase border border-white/10 shadow-sm">
                                                            {/* Ensure we use just the key part for translation if it's dotted */}
                                                            {t(olympiad.subject, { defaultValue: olympiad.subject })}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-white/90 text-[11px] font-bold border border-white/10">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            {t(olympiad.stage, { defaultValue: olympiad.stage })}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-lg mb-3">
                                                        {t(olympiad.title, { defaultValue: olympiad.title })}
                                                    </h3>
                                                    <p className="text-white/70 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                                        <span className="w-8 h-[2px] bg-white/50 inline-block"></span>
                                                        {new Date(olympiad.date).toLocaleDateString(i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>

                                                <div className="space-y-3 pl-2">
                                                    {olympiad.winners.slice(0, 3).map((winner) => {
                                                        const medal = getMedalStyle(winner.rank, t);
                                                        return (
                                                            <div key={winner.id} className="group/winner flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                                                                <div className={`w-10 h-10 rounded-xl ${medal.bg} flex items-center justify-center text-lg shadow-lg ring-2 ring-white/10 group-hover/winner:scale-110 transition-transform`}>
                                                                    {medal.icon}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-white font-black text-base truncate tracking-tight">{winner.student_name}</div>
                                                                    <div className="text-xs text-white/60 font-medium">{winner.region} • <span className="text-white font-bold">{winner.score} {t('common.ball')}</span></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="pt-4">
                                                    <Link to={`/olympiad/${olympiad.id}/results`} className="block group/btn pointer-events-auto cursor-pointer">
                                                        <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl text-black p-5 flex items-center justify-between shadow-xl hover:bg-white hover:scale-[1.02] transition-all duration-300">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] uppercase tracking-widest font-extrabold text-black/40 mb-0.5">{t('carousel.view_results')}</span>
                                                                <span className="text-lg font-black tracking-tight">{t('carousel.more')}</span>
                                                            </div>
                                                            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover/btn:bg-yellow-400 group-hover/btn:text-black transition-all duration-300 shadow-lg">
                                                                <ArrowRight className="w-6 h-6 transform group-hover/btn:translate-x-1 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                <div className="flex justify-center gap-3 mt-8">
                    {olympiads.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${i === index ? 'w-10 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/20' : 'w-2 bg-white/10 hover:bg-white/30'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PrideCarousel;
