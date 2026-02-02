import { Flame, Clock } from 'lucide-react';

interface StreakInfo {
    title: string;
    subtitle: string;
    streak_count: number;
    is_danger: boolean;
    hours_left: number;
}

import { useTranslation } from 'react-i18next';
// ...
const StreakHero = ({ data }: { data: StreakInfo }) => {
    const { t } = useTranslation();
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-1 shadow-lg shadow-orange-900/20">
            {/* ... noise div ... */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>

            <div className="relative bg-black/20 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-white min-h-[140px]">

                {/* Left: Fire Animation */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500 blur-[40px] opacity-60 animate-pulse"></div>
                        <Flame className="w-16 h-16 text-yellow-300 drop-shadow-[0_0_15px_rgba(255,200,0,0.8)] animate-float-slow" fill="currentColor" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 blur-sm rounded-full"></div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight italic">
                            {data.streak_count} {t('dashboard.streak.daily')} <span className="text-yellow-300">{t('dashboard.streak.streak')}</span>
                        </h2>
                        <p className="text-orange-100/90 font-medium max-w-sm leading-tight">
                            {t(data.subtitle)}
                        </p>
                    </div>
                </div>

                {/* Right: Timer / Danger */}
                <div className="flex flex-col items-center md:items-end">
                    <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg border border-white/10">
                        <Clock className="w-5 h-5 text-red-200 animate-pulse" />
                        <span className="font-bold font-mono text-xl">{data.hours_left}:00:00</span>
                        <span className="text-xs text-red-200 uppercase font-bold ml-1">{t('dashboard.streak.left')}</span>
                    </div>
                    <p className="text-[10px] text-red-100 mt-2 opacity-80 uppercase font-bold tracking-widest">
                        {t('dashboard.streak.keepStreak')}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default StreakHero;
