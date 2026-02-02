import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Clock, ArrowRight, Star, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "@/services/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CountdownTimer = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.days}</span>
        <span className="text-xs uppercase opacity-70">{t('olympiadsSection.days')}</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.hours}</span>
        <span className="text-xs uppercase opacity-70">{t('olympiadsSection.hours')}</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.minutes}</span>
        <span className="text-xs uppercase opacity-70">{t('olympiadsSection.minutes')}</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.seconds}</span>
        <span className="text-xs uppercase opacity-70">{t('olympiadsSection.seconds')}</span>
      </div>
    </div>
  );
};

const OlympiadSection = () => {
  const { t, i18n } = useTranslation();
  const [upcomingOlympiads, setUpcomingOlympiads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tr = (text: string) => {
    if (!text) return '';
    const cleanText = text.trim();
    const lang = i18n.language.split('-')[0];
    const mappings: Record<string, Record<string, string>> = {
      'Matematika': { 'ru': 'Математика', 'uz': 'Matematika' },
      'Fizika': { 'ru': 'Физика', 'uz': 'Fizika' },
      'Ingliz tili': { 'ru': 'Английский язык', 'uz': 'Ingliz tili' },
      "Matematika Bo'yicha Sinov Olimpiadasi": { "ru": "Тестовая Олимпиада по Математике", "uz": "Matematika Bo'yicha Sinov Olimpiadasi" }
    };
    if (mappings[cleanText] && mappings[cleanText][lang]) return mappings[cleanText][lang];
    return t(cleanText, { keySeparator: false, defaultValue: cleanText });
  };

  useEffect(() => {
    const fetchOlympiads = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/olympiads/upcoming/`);
        if (response.data.success) {
          const langCode = i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU';
          const mapped = response.data.olympiads.map((item: any) => {
            const startDate = new Date(item.start_date);
            const tr = (text: string) => {
              if (!text) return '';
              const lower = text.toLowerCase();
              // Check if subject translation exists
              const translatedSubject = t(`subjects.${lower}`, { defaultValue: '' });
              if (translatedSubject) return translatedSubject;

              // Fallback or specific rules for titles
              if (i18n.language === 'ru') {
                if (text.includes('Olimpiadasi')) return text.replace('Olimpiadasi', 'Олимпиада');
                if (text.includes('Olimpiada')) return text.replace('Olimpiada', 'Олимпиада');
              }
              return text;
            };
            const translateStatus = (status: string) => {
              if (!status) return "Olimpiada";
              const statusKey = status.toLowerCase();
              return t(`olympiadStatuses.${statusKey}`, { defaultValue: status });
            };
            return {
              id: item.id,
              title: tr(item.title),
              subject: tr(item.subject),
              date: startDate.toLocaleDateString(langCode),
              time: startDate.toLocaleTimeString(langCode, { hour: '2-digit', minute: '2-digit' }),
              duration: `${item.duration} ${t('common.minutes')}`,
              participants: item.participants_count || 0,
              maxParticipants: item.max_participants || 1000,
              price: item.price === "0.00" || item.price === 0 ? t('common.free') : parseFloat(item.price).toLocaleString(),
              level: translateStatus(item.status_display),
              is_registered: item.is_registered,
              is_completed: item.is_completed,
              featured: item.participants_count > 500
            };
          });
          setUpcomingOlympiads(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch upcoming olympiads:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOlympiads();
  }, [i18n.language]);

  if (!isLoading && upcomingOlympiads.length === 0) return null;

  return (
    <section id="olympiad" className="py-16 md:py-24 relative bg-background transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="animate-slide-up text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4"
            >
              {t('olympiadsSection.badge')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground"
            >
              {t('olympiadsSection.title')}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-warning via-orange-500 to-warning animate-gradient-xy bg-[length:200%_auto]">
                {t('olympiadsSection.titleAccent')}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl"
            >
              {t('olympiadsSection.description')}
            </motion.p>
          </div>
          <Link to="/all-olympiads">
            <Button variant="outline" size="lg" className="self-start md:self-auto">
              {t('olympiadsSection.all')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Olympiad Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6 pb-4">
            {upcomingOlympiads.map((olympiad, index) => (
              <CarouselItem key={olympiad.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                <div
                  className={`group relative bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-strong transition-all duration-300 hover:-translate-y-1 h-full ${olympiad.featured ? 'ring-2 ring-warning' : ''
                    }`}
                >
                  {/* Featured badge */}
                  {olympiad.featured && (
                    <div className="absolute top-4 right-4 z-10 animate-pulse-soft">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning text-warning-foreground text-xs font-bold shadow-lg shadow-warning/20">
                        <Star className="w-3 h-3 fill-current" />
                        {t('olympiadsSection.featured')}
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className={`p-6 ${olympiad.featured ? 'gradient-accent' : 'gradient-primary'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-white/80 text-sm">{olympiad.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
                            {olympiad.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{olympiad.title}</h3>

                    {/* Countdown for featured olympiad */}
                    {olympiad.featured && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="text-white/80 text-xs mb-2 flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {t('olympiadsSection.startIn')}
                        </div>
                        <div className="text-white">
                          <CountdownTimer />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{olympiad.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{olympiad.time} • {olympiad.duration.split(' ')[0]} {t('common.hours')}</span>
                      </div>
                    </div>

                    {/* Participants progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{t('olympiadsSection.participants')}</span>
                        </div>
                        <span className="font-bold text-primary">
                          {olympiad.participants}/{olympiad.maxParticipants}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all duration-500"
                          style={{ width: `${(olympiad.participants / olympiad.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-sm text-muted-foreground">{t('olympiadsSection.price')}</span>
                        <div className="text-xl font-bold text-foreground">
                          {olympiad.price} <span className="text-sm font-normal">{t('olympiadsSection.currency')}</span>
                        </div>
                      </div>
                      {olympiad.is_registered ? (
                        <Link to={`/dashboard/olympiad/${olympiad.id}${olympiad.is_completed ? '/result' : ''}`}>
                          <Button variant={olympiad.featured ? "hero" : "default"} size="lg" className="w-full md:w-auto">
                            {olympiad.is_completed ? t('olympiadsPage.card.viewResults') : t('olympiadsPage.card.enter')}
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/auth">
                          <Button variant={olympiad.featured ? "hero" : "default"} size="lg" className="w-full md:w-auto">
                            {t('olympiadsSection.join')}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default OlympiadSection;
