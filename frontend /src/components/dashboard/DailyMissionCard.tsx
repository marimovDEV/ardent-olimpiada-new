import { Play, Sparkles, BookOpen, Clock, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface Mission {
    type: string;
    title: string;
    subtitle: string;
    duration: string;
    xp_reward: number;
    link: string;
}

import { useTranslation } from 'react-i18next';
// ...

const DailyMissionCard = ({ mission }: { mission: Mission }) => {
    const { t } = useTranslation();
    return (
        <div className="relative group">
            {/* Pulsing Border for Urgency */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-75 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse-soft"></div>

            <div className="relative bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center space-y-4 shadow-2xl overflow-hidden">

                {/* Background Rays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.2),transparent_70%)]"></div>

                {/* Header */}
                <div className="space-y-1 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider animate-bounce">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        {t('dashboard.mission.today')}
                    </div>
                    <h3 className="text-2xl font-black text-foreground leading-tight">
                        {mission.type === 'GENERIC' ? t(mission.title) : mission.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">
                        {mission.type === 'GENERIC' ? t(mission.subtitle) : mission.subtitle}
                    </p>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border w-full justify-center">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {mission.duration}
                    </div>
                    <div className="w-px h-4 bg-muted"></div>
                    <div className="flex items-center gap-1.5 text-yellow-400">
                        <Zap className="w-4 h-4 fill-yellow-400" />
                        +{mission.xp_reward} XP
                    </div>
                </div>

                {/* Action Button */}
                <Link to={mission.link} className="w-full">
                    <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base rounded-xl shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Play className="w-5 h-5 mr-2 fill-white" />
                        {t('dashboard.mission.start')}
                    </Button>
                </Link>

                <p className="text-[10px] text-muted-foreground">
                    {t('dashboard.mission.warning')}
                </p>
            </div>
        </div>
    );
};

export default DailyMissionCard;
