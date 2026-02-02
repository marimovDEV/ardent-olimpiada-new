import { Calculator, Atom, Code, Brain, BookOpen, Globe, Trophy, Users, Zap, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { homepageService } from "@/services/homepageService";
import * as Icons from "lucide-react";

// Helper for dynamic icons
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name] || BookOpen;
  return <Icon className={className} />;
};

const SubjectsSection = () => {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await homepageService.getFeaturedSubjects();
        if (data && Array.isArray(data)) {
          setSubjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fallback subjects if API returns empty (for demo)
  const defaultSubjects = [
    {
      id: 1,
      name: t('subjects.matematika'),
      description: t('subjectsSection.matematika_desc', "Olimpiada va maktab uchun chuqur tayyorgarlik"),
      icon: "Calculator",
      color: "bg-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      badges: ["olympiad", "popular"],
      xp_reward: 100,
      stats: { students: "3.2k", olympiads: 12 }
    },
    // ... add more mocked if needed, but for now relying on backend or empty state
  ];

  const displaySubjects = subjects.length > 0 ? subjects : []; // Don't show default if we want to enforce CMS, or use defaultEntities for transition

  const getBadgeContent = (badge: string) => {
    switch (badge) {
      case 'olympiad': return { icon: <Trophy className="w-3 h-3" />, text: t('subjectsSection.olympiad') };
      case 'popular': return { icon: <Zap className="w-3 h-3" />, text: t('subjectsSection.popular') };
      case 'free': return { icon: <Award className="w-3 h-3" />, text: t('subjectsSection.free') };
      case 'skill': return { icon: <Code className="w-3 h-3" />, text: t('subjectsSection.it') };
      default: return null;
    }
  };

  return (
    <section id="subjects" className="py-16 md:py-24 relative bg-background transition-colors duration-300 font-sans">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-4 uppercase tracking-wider">
            {t('subjectsSection.badge')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            {t('subjectsSection.title')}
            <span className="text-blue-600 dark:text-blue-400">{t('subjectsSection.titleAccent')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subjectsSection.description')}
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {displaySubjects.map((subject, index) => (
            <Link to={`/courses?subject=${subject.id}`} key={subject.id || index}>
              <div
                className="group bg-card rounded-3xl border border-border p-6 md:p-8 hover:shadow-2xl hover:shadow-blue-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full flex flex-col items-start"
              >
                {/* Decoration Circle */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${subject.color || "bg-blue-600"}`} />

                {/* Header */}
                <div className="flex justify-between items-start w-full mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${subject.color || "bg-blue-600"} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {/* Assuming icon is string name from backend */}
                    <DynamicIcon name={subject.icon} className="w-8 h-8 text-white" />
                  </div>
                  {/* XP Badge */}
                  <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    +{subject.xp_reward || 50} XP
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-2 text-sm text-left">
                  {subject.description || subject.desc}
                </p>

                {/* Badges - Mocking or using backend tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {/* Hardcoded logic for now as backend doesn't have badges field yet */}
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <Trophy className="w-3 h-3" /> {t('subjectsSection.badge_olympiad', 'Olimpiada')}
                  </span>
                </div>

                {/* Stats Footer */}
                <div className="mt-auto pt-6 border-t border-border w-full grid grid-cols-2 gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-black text-foreground">{subject.stats?.students || "1k+"}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase">{t('subjectsSection.student')}</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-black text-foreground">{subject.stats?.olympiads || "5+"}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase">{t('subjectsSection.olympiad')}</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}

          {displaySubjects.length === 0 && !loading && (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              {t('subjectsSection.empty', 'Fanlar topilmadi. Admin panel orqali qo\'shing.')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
