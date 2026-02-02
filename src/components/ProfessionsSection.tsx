import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    ArrowRight,
    Code,
    Calculator,
    Microscope,
    Globe,
    PenTool,
    Building2,
    Stethoscope,
    Scale,
    Star,
    Sparkles,
    GraduationCap,
    CheckCircle2
} from "lucide-react";
import { professionService, Profession } from "@/services/professionService";
import * as Icons from "lucide-react";

// Helper to render dynamic icon
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    // @ts-ignore
    const Icon = Icons[name] || Briefcase;
    return <Icon className={className} />;
};

const ProfessionsSection = () => {
    const { t } = useTranslation();
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                const data = await professionService.getAll();
                setProfessions(data.sort((a, b) => a.order - b.order));
            } catch (error) {
                console.error("Failed to fetch professions:", error);
            } finally {
                setLoading(false);
            }
        };

        // fetchProfessions(); // Disabled for demo to ensure translations work via fallback
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="py-24 text-center">Loading...</div>;
    }

    // Default fallbacks if no professions via APi yet (during dev)
    const displayProfessions = professions.length > 0 ? professions : [
        {
            id: 1,
            name: t('professions.list.software_engineer.name'),
            description: t('professions.list.software_engineer.description'),
            icon: "Code",
            color: "bg-blue-600",
            required_subjects: [
                { name: t('subjects.matematika'), importance: 5 },
                { name: t('subjects.informatika'), importance: 5 },
                { name: t('subjects.ingliz_tili'), importance: 4 }
            ]
        },
        {
            id: 2,
            name: t('professions.list.doctor.name'),
            description: t('professions.list.doctor.description'),
            icon: "Stethoscope",
            color: "bg-emerald-600",
            required_subjects: [
                { name: "Biologiya", importance: 5 },
                { name: t('subjects.kimyo'), importance: 5 },
                { name: "Ona tili", importance: 3 }
            ]
        },
        {
            id: 3,
            name: t('professions.list.engineer.name'),
            description: t('professions.list.engineer.description'),
            icon: "Building2",
            color: "bg-orange-600",
            required_subjects: [
                { name: t('subjects.fizika'), importance: 5 },
                { name: t('subjects.matematika'), importance: 5 },
                { name: "Chizmachilik", importance: 4 }
            ]
        }
    ];

    return (
        <section id="professions" className="py-16 md:py-24 relative bg-background transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        {t('professions.badge', 'Kelajak Kasblari')}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                        {t('professions.title', 'O\'z kelajak yo\'lingizni')} <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
                            {t('professions.titleAccent', 'tanlang va boshlang')}
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t('professions.description', 'Har bir kasb uchun maxsus tayyorlangan o\'quv dasturlari va yo\'l xaritalari. Maqsad sari aniq qadamlar tashlang.')}
                    </p>
                </div>

                {/* Professions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProfessions.map((prof, index) => (
                        <div
                            key={prof.id}
                            className="group relative bg-card rounded-[2rem] p-8 border border-border hover:border-primary/50 shadow-card hover:shadow-strong transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon & title */}
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-16 h-16 rounded-2xl ${prof.color} flex items-center justify-center text-white shadow-lg`}>
                                    <DynamicIcon name={prof.icon} className="w-8 h-8" />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-6 h-6 text-primary -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                {prof.name}
                            </h3>

                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed flex-grow">
                                {prof.description}
                            </p>

                            {/* Required Subjects */}
                            <div className="mb-8 p-5 rounded-xl bg-muted/50 border border-border/50">
                                <div className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    {t('professions.required_subjects', 'Talab etiladigan fanlar')}
                                </div>
                                <div className="space-y-3">
                                    {/* @ts-ignore */}
                                    {prof.required_subjects?.map((subj, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{subj.name}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < subj.importance ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action */}
                            <Link to={`/professions/${prof.id}`} className="mt-auto">
                                <Button className="w-full h-12 rounded-xl text-base font-semibold group-hover:bg-primary group-hover:text-white transition-all">
                                    {t('professions.start_path', 'Tayyorlanishni boshlash')}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-16 text-center">
                    <p className="text-muted-foreground mb-4">
                        {t('professions.not_found', 'O\'z kasbingizni topa olmadingizmi?')}
                    </p>
                    <Link to="/all-courses">
                        <Button variant="link" className="text-primary font-bold text-lg">
                            {t('professions.view_all_courses', 'Barcha kurslarni ko\'rish')} &rarr;
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default ProfessionsSection;
