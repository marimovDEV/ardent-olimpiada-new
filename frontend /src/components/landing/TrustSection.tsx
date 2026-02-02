import { ShieldCheck, Users, Building2, CheckCircle2, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { homepageService, HomeAdvantage } from "@/services/homepageService";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

// Helper to render dynamic icon
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (Icons as any)[name] || Star;
    return <Icon className={className} />;
};

// Mock Avatars
const teachers = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
];

const TrustSection = () => {
    const { t } = useTranslation();
    const [advantages, setAdvantages] = useState<HomeAdvantage[]>([]);

    useEffect(() => {
        const fetchAdvantages = async () => {
            try {
                const data = await homepageService.getAdvantages();
                if (data && data.length > 0) {
                    setAdvantages(data.filter((s: HomeAdvantage) => s.is_active));
                }
            } catch (err) {
                console.error("Failed to load advantages", err);
            }
        };
        fetchAdvantages();
    }, []);

    const defaultAdvantages = [
        {
            icon: "ShieldCheck",
            title: t('trust.qrTitle'),
            description: t('trust.qrDesc'),
            colorClass: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        },
        {
            icon: "Users",
            title: t('trust.teacherTitle'),
            description: t('trust.teacherDesc'),
            colorClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        },
        {
            icon: "Building2",
            title: t('trust.schoolTitle'),
            description: t('trust.schoolDesc'),
            colorClass: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        }
    ];

    const displayAdvantages = defaultAdvantages; // advantages.length > 0 ? advantages : defaultAdvantages;

    const getColorClass = (index: number) => {
        const colors = [
            "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
            "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
            "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        ];
        return colors[index % colors.length];
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 bg-muted/30 border-y border-border transition-colors duration-300"
        >
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Stats & Text */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-foreground">
                            {t('trust.title')}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {t('trust.description')}
                        </p>

                        <div className="space-y-4">
                            {displayAdvantages.map((adv, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className={`${(adv as any).colorClass || getColorClass(idx)} p-2 rounded-lg mt-1`}>
                                        <DynamicIcon name={(adv as any).icon} className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{adv.title}</h4>
                                        <p className="text-sm text-muted-foreground">{(adv as any).description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual Proof */}
                    <div className="bg-card rounded-[2rem] p-8 shadow-xl shadow-muted/50 border border-border relative transition-colors">
                        {/* Floating Badges */}
                        <div className="absolute -top-6 -right-6 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-xl shadow-lg rotate-3 z-10 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            {t('trust.halal')}
                        </div>

                        <div className="text-center mb-8">
                            <div className="flex justify-center -space-x-4 mb-4">
                                {teachers.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt="Teacher"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-14 h-14 rounded-full border-4 border-card object-cover"
                                    />
                                ))}
                                <div className="w-14 h-14 rounded-full border-4 border-card bg-muted flex items-center justify-center font-bold text-muted-foreground text-xs">
                                    +15
                                </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('trust.team')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted rounded-xl p-4 text-center">
                                <div className="text-2xl font-black text-foreground mb-1">10,000+</div>
                                <div className="text-xs font-bold text-muted-foreground uppercase">{t('trust.students')}</div>
                            </div>
                            <div className="bg-muted rounded-xl p-4 text-center">
                                <div className="text-2xl font-black text-primary mb-1">₽ 500mln</div>
                                <div className="text-xs font-bold text-muted-foreground uppercase">{t('trust.prizeFund')}</div>
                            </div>
                            <div className="bg-muted rounded-xl p-4 text-center col-span-2">
                                <div className="text-2xl font-black text-green-600 dark:text-green-400 mb-1">4.9/5</div>
                                <div className="text-xs font-bold text-muted-foreground uppercase">{t('trust.rating')}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.section>
    );
};

export default TrustSection;
