
import React from 'react';
import {
    BookOpen,
    Trophy,
    Zap,
    ChevronRight,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as LucideIcons from 'lucide-react';

interface SubjectStat {
    id: number;
    name: string;
    icon: string;
    color: string;
    courses_count: number;
    olympiads_count: number;
    xp_earned: number;
}

interface SubjectStatsProps {
    stats: SubjectStat[];
}

const SubjectStats: React.FC<SubjectStatsProps> = ({ stats }) => {
    const { t } = useTranslation();

    if (!stats || stats.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    {t('dashboard.widgets.subjects', 'Fanlar')}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((subject, index) => {
                    const IconComponent = (LucideIcons as any)[subject.icon] || BookOpen;

                    return (
                        <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card border border-border rounded-2xl p-4 hover:shadow-lg hover:border-primary/30 transition-all group overflow-hidden relative"
                        >
                            {/* Background Decoration */}
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-125 transition-transform duration-500 ${subject.color || 'bg-primary'}`} />

                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${subject.color || 'bg-primary'}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-primary font-black text-lg">
                                        <Zap className="w-4 h-4 fill-primary" />
                                        {subject.xp_earned}
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Jami XP</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                                    {subject.name}
                                </h4>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        {subject.courses_count} {t('common.courses', 'kurs')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Trophy className="w-3.5 h-3.5" />
                                        {subject.olympiads_count} {t('common.olympiads', 'olimpiada')}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Batafsil ko'rish</span>
                                <ChevronRight className="w-4 h-4 text-primary" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubjectStats;
