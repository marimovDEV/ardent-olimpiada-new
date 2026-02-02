import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight, Loader2, Target, BookOpen, FileQuestion, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface Goal {
    id: number;
    title: string;
    subtitle: string;
    completed: boolean;
    type: 'lesson' | 'test' | 'olympiad' | 'other';
    link?: string;
}

interface Enrollment {
    id: number;
    course: {
        id: number;
        title: string;
    };
    progress: number;
    created_at: string;
}

interface Olympiad {
    id: number;
    title: string;
    subject: string;
}

const API_BASE = 'http://localhost:8000/api';

const DailyGoals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        loadDailyGoals();
    }, []);

    const loadDailyGoals = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        const dailyGoals: Goal[] = [];

        try {
            // Fetch enrolled courses for lesson goals
            const coursesRes = await fetch(`${API_BASE}/courses/my_courses/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (coursesRes.ok) {
                const coursesData = await coursesRes.json();
                let courses: Enrollment[] = [];

                if (Array.isArray(coursesData)) {
                    courses = coursesData;
                } else if (coursesData && Array.isArray(coursesData.results)) {
                    courses = coursesData.results;
                }

                // Add incomplete courses as goals
                courses.slice(0, 2).forEach((enrollment, index) => {
                    if (enrollment.progress < 100) {
                        dailyGoals.push({
                            id: 100 + index,
                            title: `${enrollment.course.title}: Davom etish`,
                            subtitle: `${enrollment.progress}% tugallangan`,
                            completed: false,
                            type: 'lesson',
                            link: `/course/${enrollment.course.id}`
                        });
                    }
                });
            }

            // Fetch available olympiads for registration goals
            const olympiadsRes = await fetch(`${API_BASE}/olympiads/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (olympiadsRes.ok) {
                const olympiadsData = await olympiadsRes.json();
                let olympiads: Olympiad[] = [];

                if (Array.isArray(olympiadsData)) {
                    olympiads = olympiadsData;
                } else if (olympiadsData && Array.isArray(olympiadsData.results)) {
                    olympiads = olympiadsData.results;
                }

                // Add upcoming olympiad as goal
                if (olympiads.length > 0) {
                    const nextOlympiad = olympiads[0];
                    dailyGoals.push({
                        id: 200,
                        title: "Olimpiadaga tayyorlanish",
                        subtitle: nextOlympiad.title || 'Yangi olimpiada',
                        completed: false,
                        type: 'olympiad',
                        link: `/olympiad/${nextOlympiad.id}`
                    });
                }
            }

            // Fetch test results to check for completed tests today
            const resultsRes = await fetch(`${API_BASE}/olympiads/my_results/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (resultsRes.ok) {
                const resultsData = await resultsRes.json();
                let results = [];

                if (Array.isArray(resultsData)) {
                    results = resultsData;
                } else if (resultsData && Array.isArray(resultsData.results)) {
                    results = resultsData.results;
                }

                // Check for test completed today
                const today = new Date().toDateString();
                const completedToday = results.filter((r: any) =>
                    new Date(r.submitted_at).toDateString() === today
                );

                if (completedToday.length > 0) {
                    dailyGoals.unshift({
                        id: 300,
                        title: "Bugungi testni topshirish",
                        subtitle: completedToday[0].olympiad_title || "Test",
                        completed: true,
                        type: 'test',
                        link: '/results'
                    });
                } else {
                    // Add test goal
                    dailyGoals.push({
                        id: 301,
                        title: "Mashq testini yechish",
                        subtitle: "Kunlik mashq",
                        completed: false,
                        type: 'test',
                        link: '/olympiads'
                    });
                }
            }

        } catch (err) {
            console.error('Error fetching daily goals:', err);
        }

        // If no goals generated, add default ones
        if (dailyGoals.length === 0) {
            dailyGoals.push({
                id: 1,
                title: "Birinchi kursga yoziling",
                subtitle: "Kurslarni ko'ring va tanlang",
                completed: false,
                type: 'lesson',
                link: '/courses'
            });
            dailyGoals.push({
                id: 2,
                title: "Olimpiadada qatnashing",
                subtitle: "Bilimingizni sinab ko'ring",
                completed: false,
                type: 'olympiad',
                link: '/olympiads'
            });
        }

        setGoals(dailyGoals.slice(0, 3)); // Max 3 goals
        setCompletedCount(dailyGoals.filter(g => g.completed).length);
        setIsLoading(false);
    };

    const getGoalIcon = (type: string) => {
        switch (type) {
            case 'lesson': return <BookOpen className="w-4 h-4" />;
            case 'test': return <FileQuestion className="w-4 h-4" />;
            case 'olympiad': return <Trophy className="w-4 h-4" />;
            default: return <Target className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                    🎯 Bugungi maqsadlar
                </h2>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </div>
        );
    }

    if (goals.length === 0) {
        return (
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                    🎯 Bugungi maqsadlar
                </h2>
                <div className="flex flex-col items-center justify-center text-center py-8">
                    <Target className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-2">Bugungi reja bo'sh</p>
                    <Link to="/courses">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Kurslarni ko'rish
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        🎯 Bugungi maqsadlar
                    </h2>
                    <p className="text-sm text-muted-foreground">Bugungi rejangiz: {goals.length} ta vazifa</p>
                </div>
                <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {completedCount}/{goals.length} bajarildi
                </div>
            </div>

            <div className="space-y-3">
                {goals.map((goal) => (
                    <div key={goal.id} className={`group flex items-center p-3 rounded-2xl transition-all ${goal.completed ? 'bg-green-50/50 dark:bg-green-900/20' : 'bg-muted hover:bg-muted/80'
                        }`}>
                        <button className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${goal.completed ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                            }`}>
                            {goal.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-transparent" />}
                        </button>

                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                            {getGoalIcon(goal.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-sm truncate ${goal.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                                }`}>
                                {goal.title}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">{goal.subtitle}</p>
                        </div>

                        {!goal.completed && goal.link && (
                            <Link to={goal.link}>
                                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-100">
                                    Bajarish <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyGoals;
