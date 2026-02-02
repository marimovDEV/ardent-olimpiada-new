import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, Quote, Sparkles, Instagram, Github, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { homepageService } from "@/services/homepageService";
import { API_URL } from "@/services/api";

const TeachersSection = () => {
    const { t, i18n } = useTranslation();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    useEffect(() => {
        const fetchMentors = async () => {
            setIsLoading(true);
            try {
                const data = await homepageService.getMentors();
                const lang = i18n.language === 'ru' ? 'ru' : 'uz';
                const mapped = data.map((item: any) => {
                    // Media files are served from root, not /api/
                    const baseUrl = 'http://localhost:8000';
                    const imageUrl = item.image?.startsWith('http') ? item.image : `${baseUrl}${item.image}`;
                    console.log('Teacher image URL:', imageUrl, 'Original:', item.image);
                    return {
                        id: item.id,
                        name: item.name,
                        role: item.position,
                        experience: item.experience,
                        image: imageUrl,
                        companies: [item.company], // Wrap in array
                        bio: item[`bio_${lang}`] || item.bio_uz,
                        color: "from-blue-500 to-indigo-600" // Default color
                    };
                });
                // If mock data is empty, maybe don't overwrite or handle empty state?
                // For demo purposes, if data is empty, we might want to keep the hardcoded ones?
                // User said "Real project level".
                // In real project, if no mentors, section might be hidden or empty.
                // I'll set it.
                if (mapped.length > 0) setTeachers(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMentors();
    }, [i18n.language]);

    if (!isLoading && teachers.length === 0) return null;

    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -ml-32 -mt-32" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full -mr-48 -mb-48" />

            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="outline" className="mb-6 px-6 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 backdrop-blur-sm font-bold uppercase tracking-widest">
                            <Sparkles className="w-4 h-4 mr-2" />
                            {t('teachers.badge', "Kuchli Jamoa")}
                        </Badge>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-foreground">
                        {t('teachers.title')} <span className="text-primary italic">{t('teachers.mentors', 'Mentorlar')}</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        {t('teachers.description', "O'z sohasining haqiqiy professionallaridan bilim oling va maqsadlaringizga tezroq erishing.")}
                    </p>
                </div>

                <Carousel
                    plugins={[plugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    className="w-full relative px-4 md:px-12"
                >
                    <CarouselContent className="-ml-4 md:-ml-6">
                        {teachers.map((teacher) => (
                            <CarouselItem key={teacher.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                                <div className="group relative bg-card rounded-[2.5rem] overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                                    {/* Image Container with creative effect */}
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                                        <img
                                            src={teacher.image}
                                            alt={teacher.name}
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => {
                                                // Fallback to a placeholder avatar
                                                e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(teacher.name) + '&size=400&background=4f46e5&color=fff';
                                            }}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />

                                        {/* Social Links Overlay */}
                                        <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                            <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
                                                <Instagram className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
                                                <Linkedin className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
                                                <Github className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-8 left-8 right-8 text-white">
                                            <div className={`w-12 h-1 h-1 bg-gradient-to-r ${teacher.color} mb-4 rounded-full group-hover:w-20 transition-all duration-500`} />
                                            <h3 className="text-2xl font-black leading-tight mb-1 group-hover:text-primary transition-colors">{teacher.name}</h3>
                                            <p className="text-sm text-white/70 font-bold uppercase tracking-widest">{teacher.role}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-1 relative">
                                        <Quote className="absolute top-4 right-8 w-12 h-12 text-muted/30 group-hover:text-primary/10 transition-colors" />
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {teacher.companies.map((company, i) => (
                                                <Badge key={i} variant="secondary" className="px-3 py-0.5 text-[10px] font-black uppercase bg-muted text-muted-foreground border-0">
                                                    {company}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground font-medium mb-8 leading-relaxed italic">
                                            "{teacher.bio}"
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shadow-inner">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-black text-foreground">
                                                    {teacher.experience} {t('teachers.experience_suffix')}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/5 rounded-xl group/btn transition-all">
                                                {t('teachers.more', 'Batafsil')}
                                                <ExternalLink className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Centered Controls for premium look */}
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all" />
                        <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
};

export default TeachersSection;
