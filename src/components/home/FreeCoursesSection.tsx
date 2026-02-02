import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlayCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const FreeCoursesSection = () => {
    const { t } = useTranslation();

    const freeLessons = [
        {
            id: 101,
            title: t('freeCourses.lesson1_title', "Dasturlashga kirish"),
            category: t('freeCourses.cat_beginner', "Boshlang'ich"),
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            duration: `45 ${t('common.minutes')}`
        },
        {
            id: 102,
            title: t('freeCourses.lesson2_title', "Grafik Dizayn asoslari"),
            category: t('freeCourses.cat_design', "Dizayn"),
            image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            duration: `30 ${t('common.minutes')}`
        },
        {
            id: 103,
            title: t('freeCourses.lesson3_title', "SMM nima?"),
            category: t('freeCourses.cat_marketing', "Marketing"),
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            duration: `20 ${t('common.minutes')}`
        }
    ];

    const CourseCard = ({ lesson, t }: { lesson: any, t: any }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group cursor-pointer bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={lesson.image}
                    alt={lesson.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                        <PlayCircle className="w-8 h-8 fill-white/20" />
                    </div>
                </div>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded">
                    {lesson.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded">
                    {lesson.duration}
                </div>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{lesson.title}</h3>
                <Link to="/auth/register" className="text-sm text-primary font-medium hover:underline inline-flex items-center">
                    {t('freeCourses.view_lesson', "Darsni ko'rish")} <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
            </div>
        </motion.div>
    );

    return (
        <section className="py-20 bg-muted/20">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-primary font-bold mb-2 uppercase tracking-wider text-sm">{t('freeCourses.badge', "Mutlaqo Bepul")}</div>
                        <h2 className="text-3xl md:text-4xl font-bold">{t('freeCourses.title', "O'rganishni hoziroq boshlang")}</h2>
                        <p className="text-muted-foreground mt-2 max-w-xl">
                            {t('freeCourses.description', "Hech qanday to'lovsiz, ro'yxatdan o'tmasdan ham ko'rishingiz mumkin bo'lgan darslar.")}
                        </p>
                    </motion.div>
                    <Button variant="default" asChild>
                        <Link to="/all-courses?filter=free">
                            {t('freeCourses.all_button', "Barcha bepul darslar")} <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {freeLessons.map((lesson) => (
                        <CourseCard key={lesson.id} lesson={lesson} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FreeCoursesSection;
