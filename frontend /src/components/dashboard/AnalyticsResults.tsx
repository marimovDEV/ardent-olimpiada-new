import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Trophy, Loader2, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface TestResult {
    id: number;
    olympiad_title: string;
    score: number;
    percentage: number;
    time_taken: number;
    submitted_at: string;
}

interface SubjectStat {
    subject: string;
    score: string;
    trend: number;
    status: string;
    count: number;
}

const API_BASE = 'http://localhost:8000/api';

const AnalyticsResults = () => {
    const { t } = useTranslation();
    const [results, setResults] = useState<TestResult[]>([]);
    const [stats, setStats] = useState<SubjectStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // Fetch user's test results
            const res = await fetch(`${API_BASE}/olympiads/my_results/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                const resultList = data.results || data || [];
                setResults(resultList);

                // Calculate subject statistics from results
                calculateStats(resultList);
            }
        } catch (err) {
            console.error('Error fetching results:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (resultList: TestResult[]) => {
        // Group results by subject (extracted from olympiad title)
        const subjectMap: Record<string, { total: number; count: number; scores: number[] }> = {};

        resultList.forEach(result => {
            // Try to extract subject from title
            const title = result.olympiad_title || '';
            let subject = 'general';

            if (title.toLowerCase().includes('matematika')) subject = 'matematika';
            else if (title.toLowerCase().includes('fizika')) subject = 'fizika';
            else if (title.toLowerCase().includes('kimyo')) subject = 'kimyo';
            else if (title.toLowerCase().includes('biologiya')) subject = 'biologiya';
            else if (title.toLowerCase().includes('informatika')) subject = 'informatika';
            else if (title.toLowerCase().includes('ingliz')) subject = 'ingliz';
            else if (title.toLowerCase().includes('ona tili')) subject = 'onatili';
            else if (title.toLowerCase().includes('mantiq')) subject = 'mantiq';

            if (!subjectMap[subject]) {
                subjectMap[subject] = { total: 0, count: 0, scores: [] };
            }
            subjectMap[subject].total += result.percentage;
            subjectMap[subject].count++;
            subjectMap[subject].scores.push(result.percentage);
        });

        // Convert to stats array
        const statsArray: SubjectStat[] = Object.entries(subjectMap).map(([subject, data]) => {
            const avgScore = data.total / data.count;
            const recentScores = data.scores.slice(-2);
            const trend = recentScores.length > 1 ? recentScores[1] - recentScores[0] : 0;

            let status = 'normal';
            if (avgScore >= 80) status = 'kuchli';
            else if (avgScore < 50) status = 'zaif';

            return {
                subject: `${t(`subjects.${subject.toLowerCase().replace(/\s/g, '')}`) !== `subjects.${subject.toLowerCase().replace(/\s/g, '')}` ? t(`subjects.${subject.toLowerCase().replace(/\s/g, '')}`) : subject}`,
                score: `${avgScore.toFixed(0)}%`,
                trend: Math.round(trend),
                status,
                count: data.count
            };
        });

        // Sort by score descending
        statsArray.sort((a, b) => parseInt(b.score) - parseInt(a.score));
        setStats(statsArray.slice(0, 3)); // Show top 3
    };

    if (isLoading) {
        return (
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">📈 {t('dashboard.analytics.title')}</h2>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </div>
        );
    }

    if (stats.length === 0) {
        return (
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">📈 {t('dashboard.analytics.title')}</h2>
                    <Link to="/results" className="text-sm font-semibold text-blue-600 hover:text-blue-700">{t('dashboard.analytics.all')}</Link>
                </div>
                <div className="flex flex-col items-center justify-center text-center py-8">
                    <Target className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-2">{t('dashboard.analytics.empty')}</p>
                    <Link to="/olympiads" className="text-blue-600 hover:underline text-sm">
                        {t('dashboard.analytics.joinOlympiads')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">📈 {t('dashboard.analytics.title')}</h2>
                <Link to="/results" className="text-sm font-semibold text-blue-600 hover:text-blue-700">{t('dashboard.analytics.all')}</Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={stat.subject} className="bg-muted/50 rounded-2xl p-4 relative group hover:bg-card hover:shadow-md transition-all border border-transparent hover:border-border">
                        {stat.status === 'kuchli' && (
                            <span className="absolute -top-2 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                <Trophy className="w-3 h-3" /> {t('dashboard.analytics.status.strong')}
                            </span>
                        )}
                        {stat.status === 'zaif' && (
                            <span className="absolute -top-2 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                {t('dashboard.analytics.status.weak')}
                            </span>
                        )}

                        <div className="text-muted-foreground text-sm font-medium mb-1">{stat.subject}</div>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-black text-foreground">{stat.score}</span>
                            <div className={`flex items-center text-xs font-bold mb-1.5 ${stat.trend > 0 ? 'text-green-600' : stat.trend < 0 ? 'text-red-500' : 'text-gray-400'
                                }`}>
                                {stat.trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> :
                                    stat.trend < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> :
                                        <Minus className="w-3 h-3 mr-1" />}
                                {stat.trend > 0 ? '+' : ''}{stat.trend}%
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span>{stat.count} {t('dashboard.analytics.testsCount')}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${stat.status === 'kuchli' ? 'bg-green-500' :
                                stat.status === 'zaif' ? 'bg-red-400' : 'bg-blue-400'
                                }`} style={{ width: stat.score }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent results */}
            {results.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                    <h3 className="text-sm font-bold text-foreground mb-3">{t('dashboard.analytics.recentResults')}</h3>
                    <div className="space-y-2">
                        {results.slice(0, 3).map(result => (
                            <div key={result.id} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground truncate flex-1">{result.olympiad_title}</span>
                                <span className={`font-bold ${result.percentage >= 80 ? 'text-green-600' :
                                    result.percentage < 50 ? 'text-red-500' : 'text-blue-600'
                                    }`}>
                                    {result.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsResults;
