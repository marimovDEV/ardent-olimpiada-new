import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, Trophy, GraduationCap, ArrowRight, Clock, Users, Star, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { API_URL } from "@/services/api";
import * as Icons from "lucide-react";
import { useTranslation } from "react-i18next";

interface Course {
    id: number;
    title: string;
    thumbnail: string | null;
    price: number;
    level: string;
    lesson_count: number;
}

interface Olympiad {
    id: number;
    title: string;
    slug: string;
    start_date: string;
    status: string;
    price: number;
}

interface Profession {
    id: number;
    name: string;
    icon: string;
    color: string;
    percentage: number;
}

interface SubjectDetail {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    xp_reward: number;
    courses_count: number;
    olympiads_count: number;
    professions_count: number;
    courses: Course[];
    olympiads: Olympiad[];
    professions: Profession[];
}

const SubjectDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [subject, setSubject] = useState<SubjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const res = await axios.get(`${API_URL}/subjects/${slug}/`);
                setSubject(res.data);
            } catch (err) {
                setError("Fan topilmadi");
            } finally {
                setLoading(false);
            }
        };
        fetchSubject();
    }, [slug]);

    const renderIcon = (iconName: string, className = "w-6 h-6") => {
        const Icon = (Icons as any)[iconName] || Icons.BookOpen;
        return <Icon className={className} />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !subject) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">{error || "Fan topilmadi"}</h1>
                <Link to="/subjects">
                    <Button>Barcha fanlar</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <div className={`bg-gradient-to-br ${subject.color.replace('bg-', 'from-')} to-slate-900 text-white`}>
                <div className="container mx-auto px-4 py-16">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                            {renderIcon(subject.icon, "w-10 h-10")}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black mb-2">{subject.name}</h1>
                            <p className="text-white/80 text-lg max-w-xl">
                                {subject.description || `${subject.name} bo'yicha kurslar, olimpiadalar va kasblar`}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-80" />
                            <div className="text-2xl font-black">{subject.courses_count}</div>
                            <div className="text-sm opacity-70">Kurslar</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <Trophy className="w-6 h-6 mx-auto mb-2 opacity-80" />
                            <div className="text-2xl font-black">{subject.olympiads_count}</div>
                            <div className="text-sm opacity-70">Olimpiadalar</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <GraduationCap className="w-6 h-6 mx-auto mb-2 opacity-80" />
                            <div className="text-2xl font-black">{subject.professions_count}</div>
                            <div className="text-sm opacity-70">Kasblar</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Courses Section */}
                {subject.courses.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-primary" />
                                Kurslar
                            </h2>
                            <Link to={`/courses?subject=${subject.slug}`}>
                                <Button variant="outline" size="sm">
                                    Barchasini ko'rish <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subject.courses.map((course) => (
                                <Link key={course.id} to={`/course/${course.id}`}>
                                    <Card className="overflow-hidden hover:shadow-xl transition-all group">
                                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="w-12 h-12 text-slate-400" />
                                                </div>
                                            )}
                                            <Badge className="absolute top-3 right-3">
                                                {course.price === 0 ? "Bepul" : `${course.price} AC`}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    {course.lesson_count} dars
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {t(`levels.${course.level}`, course.level)}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Olympiads Section */}
                {subject.olympiads.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-amber-500" />
                                Yaqinlashayotgan Olimpiadalar
                            </h2>
                            <Link to="/olympiads">
                                <Button variant="outline" size="sm">
                                    Barchasini ko'rish <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subject.olympiads.map((olympiad) => (
                                <Link key={olympiad.id} to={`/olympiad/${olympiad.slug}`}>
                                    <Card className="p-6 hover:shadow-xl transition-all group border-l-4 border-l-amber-500">
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors mb-2">
                                            {olympiad.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            {new Date(olympiad.start_date).toLocaleDateString('uz-UZ', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="mt-3">
                                            <Badge variant={olympiad.price === 0 ? "secondary" : "default"}>
                                                {olympiad.price === 0 ? "Bepul" : `${olympiad.price} AC`}
                                            </Badge>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Professions Section */}
                {subject.professions.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-green-500" />
                                Bu fan orqali ochiladigan kasblar
                            </h2>
                            <Link to="/professions">
                                <Button variant="outline" size="sm">
                                    Barchasini ko'rish <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subject.professions.map((profession) => (
                                <Link key={profession.id} to={`/profession/${profession.id}`}>
                                    <Card className="p-6 hover:shadow-xl transition-all group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${profession.color} flex items-center justify-center text-white`}>
                                                {renderIcon(profession.icon, "w-6 h-6")}
                                            </div>
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                {profession.name}
                                            </h3>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">{subject.name} kerakligi</span>
                                                <span className="font-bold">{profession.percentage}%</span>
                                            </div>
                                            <Progress value={profession.percentage} className="h-2" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {subject.courses.length === 0 && subject.olympiads.length === 0 && subject.professions.length === 0 && (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Ma'lumotlar hali qo'shilmagan</h3>
                        <p className="text-muted-foreground">
                            {subject.name} bo'yicha kurslar va olimpiadalar tez orada qo'shiladi
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectDetailPage;
