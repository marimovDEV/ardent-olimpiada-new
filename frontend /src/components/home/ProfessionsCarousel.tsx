import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronRight, Code, Palette, Calculator, Database, Globe } from "lucide-react";
import { homepageService } from "@/services/homepageService";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { getLucideIcon } from "@/lib/icon-utils";

const ProfessionsCarousel = () => {
    const { t, i18n } = useTranslation();
    const [professions, setProfessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfessions = async () => {
            setIsLoading(true);
            try {
                const data = await homepageService.getProfessions();
                const lang = i18n.language === 'ru' ? 'ru' : 'uz';
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    name: item[`name_${lang}`] || item.name_uz, // Support dynamic key
                    icon: getLucideIcon(item.icon),
                    salary: item.salary,
                    coursesCount: item.courses_count,
                    color: "bg-blue-500", // Default or map from item.icon maybe?
                    link: item.roadmap_link
                }));
                setProfessions(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfessions();
    }, [i18n.language]);

    if (isLoading) return null; // Let global skeleton handle it

    return (
        <section className="py-16 container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex justify-between items-center mb-8"
            >
                <div>
                    <h2 className="text-3xl font-bold text-foreground">
                        {t('professions.title')}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {t('professions.subtitle')}
                    </p>
                </div>
                <Button variant="outline" asChild className="hidden md:flex rounded-full">
                    <Link to="/professions">
                        {t('professions.all')} <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </motion.div>

            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 pb-4">
                    {professions.map((prof, index) => (
                        <CarouselItem key={prof.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="h-full"
                            >
                                <Link to={`/profession/${prof.id}`} className="block h-full">
                                    <div className="group h-full p-6 bg-card rounded-2xl border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center">
                                        <div className={`w-16 h-16 rounded-2xl ${prof.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <div className={`bg-white/20 p-3 rounded-xl`}>
                                                <prof.icon className={`w-8 h-8 text-white`} />
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-lg mb-1">{prof.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{prof.coursesCount} {t('professions.courses_count')}</p>

                                        <div className="mt-auto w-full">
                                            <div className="text-xs text-muted-foreground mb-3 bg-muted py-1 px-3 rounded-full inline-block">
                                                {t('professions.avg_salary')}: <span className="font-semibold text-foreground">{prof.salary}</span>
                                            </div>
                                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                                {t('professions.view_roadmap')}
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 hidden md:flex" />
                <CarouselNext className="right-2 hidden md:flex" />
            </Carousel>

            {professions.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full py-12 px-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-blue-500/5 border border-dashed border-primary/20 flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Globe className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('professions.coming_soon', "Yangi yo'nalishlar tayyorlanmoqda")}</h3>
                    <p className="text-muted-foreground max-w-md">
                        {t('professions.coming_soon_desc', "Tez kunda platformamizda eng talabgir kasblar bo'yicha yo'l xaritalari paydo bo'ladi. Biz bilan qoling!")}
                    </p>
                </motion.div>
            )}
        </section>
    );
};

export default ProfessionsCarousel;
