import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsBlock from "@/components/home/StatsBlock";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";

// Lazy load below-the-fold components
const PrideCarousel = lazy(() => import("@/components/PrideCarousel"));
const OlympiadSection = lazy(() => import("@/components/OlympiadSection"));
const CoursesCarousel = lazy(() => import("@/components/home/CoursesCarousel"));
const TeaserBlock = lazy(() => import("@/components/home/TeaserBlock"));
const ProfessionsCarousel = lazy(() => import("@/components/home/ProfessionsCarousel"));
const ReviewsCarousel = lazy(() => import("@/components/home/ReviewsCarousel"));
const FreeCoursesSection = lazy(() => import("@/components/home/FreeCoursesSection"));
const TeachersSection = lazy(() => import("@/components/home/TeachersSection"));
const LeadForm = lazy(() => import("@/components/home/LeadForm"));

import { homepageService, HomePageConfig } from "@/services/homepageService";
import { useEffect, useState } from "react";

const SectionSkeleton = () => (
  <div className="w-full h-96 animate-pulse bg-muted/20 rounded-3xl mb-8" />
);

const Index = () => {
  const [config, setConfig] = useState<HomePageConfig | null>(null);

  useEffect(() => {
    homepageService.getConfig().then(res => {
      if (res && res.config) setConfig(res.config);
    }).catch(console.error);
  }, []);
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col">
      <Helmet>
        <title>{config ? (config as any)[`title_${i18n.language === 'ru' ? 'ru' : 'uz'}`] || config.hero_title : "Ardent Olimpiada - Kelajagingizni quring"}</title>
        <meta name="description" content={config ? (config as any)[`subtitle_${i18n.language === 'ru' ? 'ru' : 'uz'}`] || config.hero_subtitle : "O'zbekistonning eng nufuzli olimpiadalar portali"} />
        <meta property="og:title" content="Ardent Olimpiada" />
        <meta property="og:description" content="Bilimingizni sinang va yutib oling!" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>
      <Header />

      <main className="flex-1">
        <HeroSection />

        {(!config || config.show_stats) && <StatsBlock />}

        <Suspense fallback={<SectionSkeleton />}>
          {/* Conditionally Render Sections */}
          {(!config || config.show_winners) && ( // Assuming winners is part of PrideCarousel or missing field, sticking to default TRUE if config missing
            <div className="py-8"><PrideCarousel /></div>
          )}

          {(!config || config.show_olympiads) && <OlympiadSection />}

          {(!config || config.show_courses) && <CoursesCarousel />}

          {(!config || config.show_courses) && <TeaserBlock />}

          {(!config || config.show_professions) && <ProfessionsCarousel />}

          {(!config || config.show_testimonials) && <ReviewsCarousel />}

          <FreeCoursesSection />

          {(!config || config.show_mentors) && <TeachersSection />}

          {(!config || config.show_cta) && <LeadForm />}
        </Suspense>
      </main>

      <Footer />

      <AIChatWidget />
    </div>
  );
};

export default Index;
