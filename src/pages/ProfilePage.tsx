import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User, MapPin, School, GraduationCap, Calendar, Phone, Trophy, Star,
    Zap, Edit3, Save, X, Camera, ArrowLeft, AtSign, Loader2, CheckCircle, XCircle,
    BookOpen, CreditCard,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { API_URL, getAuthHeader } from "@/services/api";
import axios from "axios";
import { useTranslation } from "react-i18next";
import LevelProgressModal from "@/components/dashboard/LevelProgressModal";

// --- Types ---
interface UserData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar: string | null;
    role: string;
    xp: number;
    level: number;
    birth_date?: string;
    region?: string;
    school?: string;
    grade?: string;
    balance?: string;
    level_progress?: {
        current: number;
        next: number;
        xp_current: number;
        xp_next: number;
        xp_left: number;
        progress_percent: number;
    };
}

import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Course {
    id: number;
    title: string;
    subject: string;
    level: string;
    lessons_count: number;
    duration: string;
    enrolled_count: number;
    rating: number;
    thumbnail: string;
    is_free: boolean;
    price: number;
    description: string;
    teacher_name?: string;
}

interface Enrollment {
    id: number;
    course: Course;
    enrolled_at: string;
    progress: number;
    is_completed: boolean;
}

interface OlympiadResult {
    id: number;
    olympiad: {
        id: number;
        title: string;
        subject: string;
    };
    score: number;
    correct_answers: number;
    total_questions: number;
    submitted_at: string;
}

interface OlympiadRegistration {
    id: number;
    olympiad: {
        id: number;
        title: string;
        subject: string;
        start_time: string;
        status: string;
    };
    registered_at: string;
    status: string;
}

interface Transaction {
    id: number;
    amount: string;
    description: string;
    payment_method: string;
    status: string;
    created_at: string;
    payment_id: string;
}

// --- Constants ---
const REGIONS = [
    "Toshkent shahri", "Toshkent viloyati", "Andijon viloyati", "Buxoro viloyati",
    "Farg'ona viloyati", "Jizzax viloyati", "Xorazm viloyati", "Namangan viloyati",
    "Navoiy viloyati", "Qashqadaryo viloyati", "Qoraqalpog'iston", "Samarqand viloyati",
    "Sirdaryo viloyati", "Surxondaryo viloyati",
];

const GRADES = [
    { value: "5", label: "5-sinf" }, { value: "6", label: "6-sinf" },
    { value: "7", label: "7-sinf" }, { value: "8", label: "8-sinf" },
    { value: "9", label: "9-sinf" }, { value: "10", label: "10-sinf" },
    { value: "11", label: "11-sinf" }, { value: "STUDENT", label: "Talaba" },
    { value: "GRADUATE", label: "Bitiruvchi" },
];

const getSubjectTheme = (subject: string) => {
    switch (subject?.toLowerCase()) {
        case 'matematika': return { bg: 'from-blue-500 to-blue-700', text: 'text-blue-600', light: 'bg-blue-50 dark:bg-blue-900/20' };
        case 'fizika': return { bg: 'from-violet-500 to-purple-700', text: 'text-violet-600', light: 'bg-violet-50 dark:bg-violet-900/20' };
        case 'informatika': return { bg: 'from-emerald-500 to-green-700', text: 'text-emerald-600', light: 'bg-emerald-50 dark:bg-emerald-900/20' };
        case 'ingliz tili': return { bg: 'from-pink-500 to-rose-700', text: 'text-pink-600', light: 'bg-pink-50 dark:bg-pink-900/20' };
        case 'mantiq': return { bg: 'from-orange-500 to-amber-700', text: 'text-orange-600', light: 'bg-orange-50 dark:bg-orange-900/20' };
        case 'kimyo': return { bg: 'from-teal-500 to-cyan-700', text: 'text-teal-600', light: 'bg-teal-50 dark:bg-teal-900/20' };
        case 'biologiya': return { bg: 'from-green-500 to-emerald-700', text: 'text-green-600', light: 'bg-green-50 dark:bg-green-900/20' };
        default: return { bg: 'from-blue-500 to-indigo-700', text: 'text-blue-600', light: 'bg-blue-50 dark:bg-blue-900/20' };
    }
};

// --- Sub-Components ---

const MyCoursesTab = () => {
    const { t } = useTranslation();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const res = await axios.get(`${API_URL}/courses/my_courses/`, { headers: getAuthHeader() });
            if (res.data.success) {
                setEnrollments(res.data.enrollments);
            }
        } catch (error) {
            console.error("Courses error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

    if (enrollments.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/50 border-border">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-bold text-foreground mb-2">{t('dashboard.profile.empty.coursesTitle')}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t('dashboard.profile.empty.coursesDesc')}
                </p>
                <Link to="/courses">
                    <Button>{t('dashboard.profile.empty.viewCourses')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {enrollments.map((enrollment) => {
                const { course } = enrollment;
                const theme = getSubjectTheme(course.subject);

                return (
                    <Link
                        key={course.id}
                        to={`/course/${course.id}`}
                        className="group bg-card rounded-2xl border border-border hover:border-primary/50 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
                    >
                        {/* Thumbnail */}
                        <div className="h-40 relative overflow-hidden bg-muted">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${theme.bg} flex items-center justify-center`}>
                                    <BookOpen className="w-12 h-12 text-white/30" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                {course.level || 'General'}
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold uppercase ${theme.text} bg-muted px-2 py-1 rounded`}>
                                    {course.subject}
                                </span>
                                {enrollment.is_completed && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                        <CheckCircle className="w-3 h-3" /> {t('dashboard.profile.status.completed')}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {course.title}
                            </h3>

                            {/* Progress Bar */}
                            <div className="mt-auto pt-4">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>{t('dashboard.profile.status.progress')}</span>
                                    <span>{enrollment.progress || 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${enrollment.is_completed ? 'bg-green-500' : 'bg-blue-500'}`}
                                        style={{ width: `${enrollment.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

const MyOlympiadsTab = () => {
    const { t } = useTranslation();
    const [registrations, setRegistrations] = useState<OlympiadRegistration[]>([]);
    const [results, setResults] = useState<OlympiadResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [regRes, resRes] = await Promise.all([
                axios.get(`${API_URL}/olympiads/my_registrations/`, { headers: getAuthHeader() }),
                axios.get(`${API_URL}/test-results/`, { headers: getAuthHeader() })
            ]);

            if (regRes.data.success || Array.isArray(regRes.data)) setRegistrations(regRes.data.registrations || regRes.data);
            // TestResultViewSet returns list directly (no .success wrapper usually unless custom response)
            // But let's check ViewSet. Usually ViewSet list returns [ ... ] or { count: ..., results: [...] } if pagination.
            // TestResultViewSet uses StandardPagination probably? ModelViewSet defaults to StandardPagination if set globally.
            // Checking backend/api/views.py TestResultViewSet definition.
            // It inherits ReadOnlyModelViewSet.
            // If pagination is on, data is { results: [...] }.
            // Let's assume pagination is on (standard).
            const data = resRes.data;
            if (data.results) setResults(data.results);
            else if (Array.isArray(data)) setResults(data);

        } catch (error) {
            console.error("Olympiads error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

    if (registrations.length === 0 && results.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/50 border-border">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-bold text-foreground mb-2">{t('dashboard.profile.empty.olympiadsTitle')}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t('dashboard.profile.empty.olympiadsDesc')}
                </p>
                <Link to="/olympiads">
                    <Button>{t('dashboard.profile.empty.viewOlympiads')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Active Registrations */}
            {registrations.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        {t('dashboard.profile.olympiads.active')}
                    </h3>
                    <div className="grid gap-4">
                        {registrations.map(reg => (
                            <div key={reg.id} className="bg-card p-5 rounded-xl border border-border flex items-center justify-between shadow-sm">
                                <div>
                                    <h4 className="font-bold text-lg text-foreground">{reg.olympiad.title}</h4>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-medium">{reg.olympiad.subject}</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(reg.olympiad.start_time).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <Badge variant={reg.olympiad.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                    {reg.olympiad.status === 'ACTIVE' ? t('dashboard.profile.olympiads.status.active') : t('dashboard.profile.olympiads.status.upcoming')}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Past Results */}
            {results.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        {t('dashboard.profile.olympiads.results')}
                    </h3>
                    <div className="grid gap-4">
                        {results.map(res => (
                            <div key={res.id} className="bg-card p-5 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
                                <div>
                                    <h4 className="font-bold text-lg text-foreground">{res.olympiad.title}</h4>
                                    <p className="text-sm text-muted-foreground">{new Date(res.submitted_at).toLocaleDateString()}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-blue-600">{res.score}%</div>
                                        <div className="text-xs text-muted-foreground">{t('dashboard.profile.olympiads.result')}</div>
                                    </div>
                                    <div className="text-center px-4 border-l border-border">
                                        <div className="text-lg font-bold text-green-600">{res.correct_answers} / {res.total_questions}</div>
                                        <div className="text-xs text-muted-foreground">{t('dashboard.profile.olympiads.correct')}</div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/olympiad/${res.olympiad.id}/result`}>
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                                {t('dashboard.profile.olympiads.viewResult')}
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                                            <Link to={`/olympiad/${res.olympiad.id}/results`}>
                                                <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                                                {t('dashboard.profile.olympiads.analysis')}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const PaymentsTab = () => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${API_URL}/payments/`, { headers: getAuthHeader() });
            setTransactions(res.data.results || res.data);
        } catch (error) {
            console.error("Payments error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/50 border-border">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-bold text-foreground mb-2">{t('dashboard.profile.empty.paymentsTitle')}</h3>
                <p className="text-muted-foreground">
                    {t('dashboard.profile.empty.paymentsDesc')}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>{t('dashboard.profile.payments.id')}</TableHead>
                            <TableHead>{t('dashboard.profile.payments.desc')}</TableHead>
                            <TableHead>{t('dashboard.profile.payments.amount')}</TableHead>
                            <TableHead>{t('dashboard.profile.payments.date')}</TableHead>
                            <TableHead>{t('dashboard.profile.payments.status')}</TableHead>
                            <TableHead className="text-right">{t('dashboard.profile.payments.method')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((trx) => (
                            <TableRow key={trx.id}>
                                <TableCell className="font-mono text-xs text-muted-foreground">{trx.payment_id || trx.id}</TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {trx.description?.toLowerCase().includes('kurs') ?
                                            <BookOpen className="w-4 h-4 text-blue-500" /> :
                                            <Trophy className="w-4 h-4 text-purple-500" />
                                        }
                                        {trx.description}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-bold">{parseInt(trx.amount).toLocaleString()} UZS</span>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{new Date(trx.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                                        ${trx.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                            trx.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'}
                                    `}>
                                        {trx.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">{trx.payment_method}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};


// --- TopUp Component ---
const TopUpDialog = ({ onSuccess }: { onSuccess: () => void }) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('PAYME');
    const [loading, setLoading] = useState(false);

    const handleTopUp = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) < 1000) {
            toast.error("Minimal summa 1000 so'm");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/payments/initiate/`, {
                type: 'TOPUP',
                amount: Number(amount),
                method,
                reference_id: 'wallet_topup' // generic ref
            }, { headers: getAuthHeader() });

            if (res.data.success && res.data.payment_url) {
                window.location.href = res.data.payment_url;
            }
        } catch (err) {
            toast.error("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold gap-2 shadow-lg hover:shadow-green-500/20 transition-all">
                    <CreditCard className="w-4 h-4" />
                    Hisobni to'ldirish
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hisobni to'ldirish</DialogTitle>
                    <DialogDescription>
                        To'lov tizimini tanlang va summani kiriting.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>To'lov tizimi</Label>
                        <RadioGroup defaultValue="PAYME" value={method} onValueChange={setMethod} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="PAYME" id="payme" className="peer sr-only" />
                                <Label
                                    htmlFor="payme"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span className="text-lg font-bold">Payme</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="CLICK" id="click" className="peer sr-only" />
                                <Label
                                    htmlFor="click"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span className="text-lg font-bold">Click</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label>Summa (UZS)</Label>
                        <Input
                            type="number"
                            placeholder="Masalan: 50000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleTopUp} disabled={loading} className="w-full">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        To'lashga o'tish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- Main Profile Page Component ---

const ProfilePage = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

    // Edit form state
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [region, setRegion] = useState('');
    const [school, setSchool] = useState('');
    const [grade, setGrade] = useState('');

    // Username validation
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [usernameError, setUsernameError] = useState('');

    // Avatar
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await axios.get(`${API_URL}/auth/me/`, { headers: getAuthHeader() });
                if (res.data.success && res.data.user) {
                    updateLocalUser(res.data.user);
                }
            } catch (err) {
                console.error('Error fetching user from API');
            }
        }

        // Load initially from local storage or fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                updateLocalUser(userData);
            } catch (e) {
                console.error('Error parsing user data');
            }
        }
    };

    const updateLocalUser = (userData: UserData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Initialize form
        setUsername(userData.username || '');
        setFirstName(userData.first_name || '');
        setLastName(userData.last_name || '');
        setPhone(userData.phone || '');
        setBirthDate(userData.birth_date || '');
        setRegion(userData.region || '');
        setSchool(userData.school || '');
        setGrade(userData.grade || '');
        setAvatarPreview(userData.avatar || null);
    };

    // Check username availability
    const checkUsername = async (newUsername: string) => {
        if (!newUsername || newUsername.length < 3) {
            setUsernameError(t('dashboard.profile.info.usernameLength'));
            setUsernameStatus('idle');
            return;
        }

        if (user && newUsername === user.username) {
            setUsernameStatus('available');
            setUsernameError('');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
            setUsernameError(t('dashboard.profile.info.usernameChars'));
            setUsernameStatus('idle');
            return;
        }

        setUsernameStatus('checking');
        setUsernameError('');

        try {
            const res = await fetch(`${API_URL}/auth/check-username/?username=${newUsername}`);
            const data = await res.json();

            if (data.available) {
                setUsernameStatus('available');
                setUsernameError('');
            } else {
                setUsernameStatus('taken');
                setUsernameError(t('dashboard.profile.info.usernameTaken'));
            }
        } catch (err) {
            setUsernameStatus('available');
            setUsernameError('');
        }
    };

    // Handle avatar file selection
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast({ title: t('dashboard.profile.info.error'), description: "Faqat rasm fayllari yuklash mumkin", variant: "destructive" });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: t('dashboard.profile.info.error'), description: "Rasm hajmi 5MB dan oshmasligi kerak", variant: "destructive" });
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        if (usernameStatus === 'taken') {
            toast({ title: t('dashboard.profile.info.error'), description: t('dashboard.profile.info.usernameTaken'), variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            let avatarUrl = user.avatar;

            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);
                try {
                    const avatarRes = await axios.post(`${API_URL}/auth/upload-avatar/`, formData, {
                        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
                    });
                    if (avatarRes.data.avatar_url) {
                        avatarUrl = avatarRes.data.avatar_url;
                    }
                } catch (err) {
                    avatarUrl = avatarPreview;
                }
            }

            const res = await axios.put(`${API_URL}/auth/profile/`, {
                username, first_name: firstName, last_name: lastName, phone,
                birth_date: birthDate || null, region, school, grade
            }, { headers: getAuthHeader() });

            if (res.data.success) {
                const savedUser = { ...user, ...res.data.user, avatar: avatarUrl };
                updateLocalUser(savedUser);
                setIsEditing(false);
                setAvatarFile(null);
                setUsernameStatus('idle');
                toast({ title: t('dashboard.profile.info.saved') });
            }
        } catch (err: any) {
            toast({ title: t('dashboard.profile.info.error'), description: err.response?.data?.error || "Error", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) updateLocalUser(user);
        setIsEditing(false);
    };

    const getGradeLabel = (gradeValue?: string) => {
        if (!gradeValue) return '-';
        const found = GRADES.find(g => g.value === gradeValue);
        return found ? found.label : gradeValue;
    };

    if (!user) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">{t('dashboard.profile.notFound')}</p>
                    <Button onClick={() => navigate('/auth/login')}>{t('dashboard.profile.login')}</Button>
                </div>
            </div>
        );
    }

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
    const initials = (user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase();
    const displayAvatar = avatarPreview || user.avatar;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in min-h-screen">
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />

            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t('dashboard.profile.back')}</span>
                </button>
            </div>

            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="relative group">
                        {displayAvatar ? (
                            <img src={displayAvatar} alt={fullName} className="w-32 h-32 rounded-3xl object-cover border-4 border-white/20 shadow-2xl" />
                        ) : (
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-5xl font-bold border-4 border-white/20 shadow-2xl">
                                {initials}
                            </div>
                        )}
                        {isEditing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                            >
                                <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </button>
                        )}
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{fullName}</h1>
                        <p className="text-blue-200 mb-6 font-medium">@{user.username}</p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{user.level || 1}</p>
                                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">{t('dashboard.profile.level')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-green-400 fill-green-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{user.xp || 0}</p>
                                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">{t('dashboard.profile.xp')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-purple-400 fill-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">0</p>
                                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">{t('dashboard.profile.achievements')}</p>
                                </div>
                            </div>

                            {/* Balance Card */}
                            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm ring-2 ring-yellow-400/50">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div className="mr-2">
                                    <p className="text-xl font-bold">{parseFloat(user.balance || "0").toLocaleString()} UZS</p>
                                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">{t('dashboard.profile.balance')}</p>
                                </div>
                                <TopUpDialog onSuccess={() => loadUser()} />
                            </div>
                        </div>

                        {/* Level Progress Bar (Dynamic) */}
                        <div
                            className="mt-6 w-full max-w-lg cursor-pointer group/xp transition-all hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => setIsProgressModalOpen(true)}
                        >
                            <div className="flex justify-between text-xs font-bold text-blue-200 mb-2 uppercase tracking-widest group-hover/xp:text-white transition-colors">
                                <span>{t('dashboard.widgets.xpLeft', { xp: user.level_progress?.xp_left || 0 })}</span>
                                <span>{user.level_progress?.progress_percent || 0}%</span>
                            </div>
                            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 ring-1 ring-white/0 group-hover/xp:ring-white/20 transition-all">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                                    style={{ width: `${user.level_progress?.progress_percent || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Actions */}
                    <div className="self-start">
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)} variant="secondary" className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                                <Edit3 className="w-4 h-4" /> {t('dashboard.profile.edit')}
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={handleCancel} variant="ghost" className="text-white hover:bg-white/20">
                                    <X className="w-4 h-4 mr-2" /> {t('dashboard.profile.cancel')}
                                </Button>
                                <Button onClick={handleSave} disabled={isLoading || usernameStatus === 'taken'} className="bg-green-500 hover:bg-green-600 border-0">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    {t('dashboard.profile.save')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TABS CONTENT */}
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 bg-card p-1 rounded-2xl border border-border h-auto">
                    <TabsTrigger value="profile" className="py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">{t('dashboard.profile.tabs.info')}</TabsTrigger>
                    <TabsTrigger value="courses" className="py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">{t('dashboard.profile.tabs.courses')}</TabsTrigger>
                    <TabsTrigger value="olympiads" className="py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">{t('dashboard.profile.tabs.olympiads')}</TabsTrigger>
                    <TabsTrigger value="payments" className="py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">{t('dashboard.profile.tabs.payments')}</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Account Info */}
                        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <AtSign className="w-5 h-5 text-purple-600" /> {t('dashboard.profile.info.account')}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.username')}</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => {
                                                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                                    setUsername(val);
                                                    if (val.length >= 3) checkUsername(val);
                                                    else setUsernameStatus('idle');
                                                }}
                                                className={`w-full h-12 pl-10 pr-10 rounded-xl bg-muted/50 border outline-none ${usernameStatus === 'taken' ? 'border-red-500' : 'border-border focus:border-primary'} text-foreground`}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
                                                {usernameStatus === 'available' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                                {usernameStatus === 'taken' && <XCircle className="w-4 h-4 text-red-500" />}
                                            </div>
                                            {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
                                        </div>
                                    ) : (
                                        <p className="font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border">@{user.username}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.role')}</label>
                                    <div className="flex">
                                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                            {user.role === 'ADMIN' ? t('dashboard.profile.info.admin') : t('dashboard.profile.info.student')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" /> {t('dashboard.profile.info.personal')}
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.firstName')}</label>
                                        {isEditing ? (
                                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary outline-none text-foreground" placeholder={t('dashboard.profile.info.firstName')} />
                                        ) : (
                                            <p className="font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border">{user.first_name || '-'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.lastName')}</label>
                                        {isEditing ? (
                                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary outline-none text-foreground" placeholder={t('dashboard.profile.info.lastName')} />
                                        ) : (
                                            <p className="font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border">{user.last_name || '-'}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.phone')}</label>
                                    {isEditing ? (
                                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary outline-none text-foreground" placeholder="+998" />
                                    ) : (
                                        <p className="font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border">{user.phone || '-'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.birthDate')}</label>
                                    {isEditing ? (
                                        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary outline-none text-foreground" />
                                    ) : (
                                        <p className="font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border">{user.birth_date || '-'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border md:col-span-2">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <School className="w-5 h-5 text-orange-500" /> {t('dashboard.profile.info.education')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.region')}</label>
                                    {isEditing ? (
                                        <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary outline-none text-foreground">
                                            <option value="">{t('dashboard.profile.info.region')}</option>
                                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    ) : (
                                        <p className="font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            {user.region || '-'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.school')}</label>
                                    {isEditing ? (
                                        <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary outline-none text-foreground" placeholder={t('dashboard.profile.info.school')} />
                                    ) : (
                                        <p className="font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border flex items-center gap-2">
                                            <School className="w-4 h-4 text-muted-foreground" />
                                            {user.school || '-'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">{t('dashboard.profile.info.grade')}</label>
                                    {isEditing ? (
                                        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary outline-none text-foreground">
                                            <option value="">{t('dashboard.profile.info.grade')}</option>
                                            {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                        </select>
                                    ) : (
                                        <p className="font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                            {getGradeLabel(user.grade)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="courses" className="focus-visible:outline-none">
                    <MyCoursesTab />
                </TabsContent>

                <TabsContent value="olympiads" className="focus-visible:outline-none">
                    <MyOlympiadsTab />
                </TabsContent>

                <TabsContent value="payments" className="focus-visible:outline-none">
                    <PaymentsTab />
                </TabsContent>
            </Tabs>
            <LevelProgressModal
                isOpen={isProgressModalOpen}
                onClose={() => setIsProgressModalOpen(false)}
                user={user}
            />
        </div>
    );
};

export default ProfilePage;
