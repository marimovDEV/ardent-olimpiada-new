import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Star, ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { homepageService, HeroConfig, Banner } from "@/services/homepageService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'ru' ? 'ru' : 'uz') as 'uz' | 'ru';
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroData, bannerData] = await Promise.all([
          homepageService.getHero(),
          homepageService.getBanners()
        ]);

        const activeHero = heroData ? (Array.isArray(heroData) ? (heroData.find((h: any) => h.is_active) || heroData[0]) : heroData) : null;
        setHero(activeHero);

        const activeBanners = bannerData ? (Array.isArray(bannerData) ? bannerData.filter((b: Banner) => b.is_active) : (bannerData.results || []).filter((b: Banner) => b.is_active)) : [];
        setBanners(activeBanners);
      } catch (err) {
        console.error("Failed to fetch hero/banners", err);
      }
    };
    fetchData();
  }, []);

  // Prioritize translation keys to ensure proper localization
  const title = t('hero.title1', { defaultValue: hero ? ((hero as any)[`title_${lang}`] || hero.hero_title || hero.title_uz) : '' });
  const subtitle = t('hero.subtitle', { defaultValue: hero ? ((hero as any)[`subtitle_${lang}`] || hero.hero_subtitle || hero.subtitle_uz) : '' });
  const btnText = t('hero.cta_primary', { defaultValue: hero ? ((hero as any)[`button_text_${lang}`] || hero.hero_button_text || hero.button_text_uz) : '' });
  const btnLink = hero ? hero.hero_button_link || hero.button_link : "/olympiads";

  // Render Banner Slider if banners exist
  if (banners.length > 0) {
    return (
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden bg-background">
        <div className="container px-4">
          <Carousel
            plugins={[plugin.current]}
            className="w-full relative shadow-2xl rounded-3xl overflow-hidden"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{ loop: true }}
          >
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id} className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.5/1]">
                  <div className="absolute inset-0">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  </div>
                  <div className="absolute inset-0 flex items-center p-8 md:p-16">
                    <div className="max-w-2xl text-white space-y-6">
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
                      >
                        {banner.title}
                      </motion.h2>
                      {banner.subtitle && (
                        <p className="text-lg md:text-xl text-white/90 line-clamp-3">
                          {banner.subtitle}
                        </p>
                      )}
                      {(banner.button_text) && (
                        <Button size="lg" className="rounded-full text-lg px-8 mt-4" asChild>
                          <Link to={banner.button_link || '#'}>{banner.button_text}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 border-none text-white" />
            <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 border-none text-white" />
          </Carousel>
        </div>
      </section>
    )
  }

  // Fallback to Standard Hero (Config based)
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8"
          >
            <Trophy className="w-4 h-4" />
            <span className="tracking-wide uppercase text-xs">{t('hero.badge')}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-8"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-primary to-purple-600 animate-gradient-x">
              {title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="xl" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105" asChild>
              <Link to={btnLink}>
                {btnText} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-muted/50 transition-all" asChild>
              <Link to="/courses">
                {t('hero.cta_secondary')}
              </Link>
            </Button>
          </motion.div>

          {/* Trust/Stats Mini Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 pt-8 border-t border-border/50 grid grid-cols-3 gap-8 md:gap-16"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold">10k+</span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">{t('hero.stats_students')}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold flex items-center gap-1">50 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /></span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">{t('hero.stats_olympiads')}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold">100%</span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">{t('hero.stats_transparency')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
