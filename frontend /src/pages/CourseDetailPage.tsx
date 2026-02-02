import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Play, Clock, Users, Star, CheckCircle2, Lock, ChevronDown, ChevronUp,
  Trophy, ArrowLeft, GraduationCap, BookOpen, Loader2, ShoppingCart, Check, Gift,
  Globe, AlertTriangle
} from "lucide-react";
import ArdCoin from "@/components/ArdCoin";
import PaymentModal from "@/components/payment/PaymentModal";
import { toast } from "sonner";
import api from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSubjectTheme as getTheme } from "@/lib/course-themes";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

interface Course {
  id: number;
  title: string;
  subject: string;
  level: string;
  language: string;
  lessons_count: number;
  duration: string;
  enrolled_count: number;
  rating: number;
  thumbnail: string;
  is_free: boolean;
  price: number;
  description: string;
  teacher_name?: string;
  what_you_learn?: string[];
  requirements?: string[];
  is_enrolled?: boolean;
  enrollment?: {
    id: number;
    progress: number;
    current_lesson: number | null;
    updated_at: string;
  };
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  is_free: boolean;
  order: number;
}

interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  // Wallet State
  const [userBalance, setUserBalance] = useState<number>(0);
  const [showPayModal, setShowPayModal] = useState(false);

  useEffect(() => {
    loadCourse();
    loadUserBalance();
  }, [id]);

  const loadUserBalance = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.balance !== undefined) {
        setUserBalance(parseFloat(user.balance));
      }
    }
  };

  const loadCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/courses/${id}/`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setCourse(data);
        setIsEnrolled(data.is_enrolled);
        loadModules();
      } else {
        navigate('/courses');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadModules = async () => {
    try {
      const res = await fetch(`${API_BASE}/courses/${id}/modules/`);
      if (res.ok) {
        const data = await res.json();
        const moduleList = Array.isArray(data) ? data : data.results || [];
        setModules(moduleList);
        if (moduleList.length > 0) {
          setExpandedModules([moduleList[0].id]);
        }
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/login');
      return;
    }

    if (course?.is_free || course?.price === 0) {
      enrollDirectly(token);
      return;
    }

    if (userBalance < (course?.price || 0)) {
      setShowPayModal(true);
      return;
    }

    purchaseWithWallet(token);
  };

  const enrollDirectly = async (token: string) => {
    setIsPurchasing(true);
    try {
      const res = await api.post(`/courses/${id}/enroll/`);

      if (res.status === 200 || res.status === 201) {
        setIsEnrolled(true);
        toast.success(t('dashboard.courseDetail.successEnroll'));
        setTimeout(() => navigate('/my-courses'), 1500);
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      toast.error(errorData?.detail || t('common.error'));
    } finally {
      setIsPurchasing(false);
    }
  };

  const purchaseWithWallet = async (token: string) => {
    if (!confirm(t('dashboard.courseDetail.confirmPurchase', { price: course?.price }))) return;

    setIsPurchasing(true);
    try {
      const res = await api.post(`/wallet/purchase/`, {
        type: 'COURSE',
        id: course?.id
      });

      if (res.data.success) {
        setIsEnrolled(true);
        toast.success(t('dashboard.courseDetail.successPurchase'));
        setTimeout(() => navigate('/my-courses'), 1500);
        setUserBalance(res.data.balance);
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const u = JSON.parse(userStr);
          u.balance = res.data.balance;
          localStorage.setItem('user', JSON.stringify(u));
        }
      } else {
        toast.error(res.data.error || t('dashboard.courseDetail.errorPurchase'));
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      // If it's a 401/403, the interceptor will handle the logout.
      // We only handle other errors here.
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        toast.error(errorData?.error || t('common.serverError'));
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  // Replaced local getSubjectTheme with central utility

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
        <BookOpen className="w-20 h-20 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('dashboard.courseDetail.notFound')}</h2>
        <Link to="/courses">
          <Button>{t('dashboard.courseDetail.backToCourses')}</Button>
        </Link>
      </div>
    );
  }

  const isFree = course.is_free || course.price === 0;
  const courseTheme = getTheme(course.subject);
  const showLanguageWarning = course.language && course.language !== i18n.language && !isEnrolled;
  const courseLang = t(`courses.languages.${course.language}`) || course.language;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <Header />
      <div className="flex-1 pt-16">
        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${courseTheme.bg} text-white relative overflow-hidden`}>
          {/* Abstract Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMiA0LTJ6bTAgMGMwIDItMiA0LTIgNHMtMi0yLTItNC0yLTQgMi00IDIgMiAyIDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

          <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('dashboard.courseDetail.backToCourses')}
            </Link>

            {showLanguageWarning && (
              <div className="mb-6 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/40 p-4 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-yellow-100">
                    {t('courses.languageWarning', { language: courseLang })}
                  </p>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-10">
              {/* Course Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold border border-white/10">
                    {t(`subjects.${course.subject?.toLowerCase()}`) || t(course.subject) || course.subject || 'Kurs'}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold border border-white/10">
                    {t(`levels.${course.level}`) || course.level || t('common.general')}
                  </span>
                  {course.language && (
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold border border-white/10 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {t(`courses.languages.${course.language}`)}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl lg:text-5xl font-black leading-tight drop-shadow-md">
                  {t(`courses.${course.title}`) || t(course.title) || course.title}
                </h1>

                <p className="text-xl text-white/90 leading-relaxed max-w-2xl drop-shadow-sm">
                  {t(`courses.${course.description}`) || t(course.description) || course.description || t('dashboard.courseDetail.defaultDesc')}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{Number(course.rating || 0).toFixed(1)}</span>
                    <span className="text-white/70">({course.enrolled_count || 0} {t('dashboard.courseDetail.reviews')})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="text-lg">{course.enrolled_count || 0} {t('dashboard.courseDetail.students')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="w-6 h-6" />
                    <span className="text-lg">{course.lessons_count || 0} {t('dashboard.courseDetail.lessons')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    <span className="text-lg">
                      {course.duration ? (
                        course.duration.toString().includes(' ')
                          ? `${course.duration.split(' ')[0]} ${t('common.hours')}`
                          : `${course.duration} ${t('common.hours')}`
                      ) : '---'}
                    </span>
                  </div>
                </div>

                {/* Teacher */}
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 border border-white/10 flex items-center justify-center text-2xl font-bold shadow-inner">
                    {course.teacher_name?.[0] || 'O'}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{course.teacher_name || t('dashboard.courseDetail.teacher')}</div>
                    <div className="text-white/70">{t('dashboard.courseDetail.author')}</div>
                  </div>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="lg:col-span-1">
                <div className="bg-card dark:bg-card/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden sticky top-24 border border-border">
                  {/* Course Image */}
                  <div className="h-48 relative">
                    <img
                      src={course.thumbnail || courseTheme.fallbackImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      {isFree ? (
                        <div className="flex flex-col items-center">
                          <span className="text-4xl font-black text-green-600 dark:text-green-400">{t('dashboard.courseDetail.free')}</span>
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2">
                            <Gift className="w-5 h-5" />
                            <span className="font-semibold">{t('dashboard.courseDetail.totallyFree')}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          {/* Price / Status Block */}
                          <div className="flex flex-col items-center justify-center min-h-[60px]">
                            {isEnrolled ? (
                              <div className="flex flex-col items-center gap-1 animate-in zoom-in-95 duration-300">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-500/20">
                                  <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <span className="text-lg font-black text-green-600 dark:text-green-400 mt-1">
                                  {t('dashboard.myCoursesPage.enrolled') || 'Sotib olingan'}
                                </span>
                              </div>
                            ) : isFree ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-4xl font-black text-green-600 dark:text-green-400">{t('badges.free')}</span>
                              </div>
                            ) : (
                              <ArdCoin amount={course.price} size="xl" />
                            )}
                          </div>

                          {isEnrolled && course.enrollment && (
                            <div className="mb-6 animate-in slide-in-from-top-2">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-muted-foreground">{t('dashboard.myCoursesPage.progress')}</span>
                                <span className="text-sm font-black text-primary">{Math.round(course.enrollment.progress)}%</span>
                              </div>
                              <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                                  style={{ width: `${course.enrollment.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* CTA Button */}
                          {isEnrolled ? (
                            <Button
                              size="lg"
                              className="w-full h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                              onClick={() => navigate(`/course/${id}/lesson/${course.enrollment?.current_lesson || ''}`)}
                            >
                              <Play className="w-5 h-5 mr-2" />
                              {t('dashboard.courseDetail.continue')}
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              className={`w-full h-14 text-lg rounded-2xl ${isFree
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 shadow-lg shadow-orange-500/20 text-white'
                                } transition-all hover:scale-[1.02] active:scale-[0.98]`}
                              onClick={handleEnroll}
                              disabled={isPurchasing}
                            >
                              {isPurchasing ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              ) : isFree ? (
                                <Play className="w-5 h-5 mr-2" />
                              ) : (
                                <ShoppingCart className="w-5 h-5 mr-2" />
                              )}
                              {isPurchasing ? t('dashboard.courseDetail.processing') : isFree ? t('dashboard.courseDetail.startFree') : t('dashboard.courseDetail.buy')}
                            </Button>
                          )}

                          {/* Balance Warning */}
                          {!isEnrolled && !isFree && userBalance < course.price && (
                            <div className="text-center text-sm text-destructive bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                              {t('dashboard.courseDetail.insufficientFunds', { balance: userBalance.toLocaleString() })}
                            </div>
                          )}

                          {/* Features */}
                          <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              <span>{t('dashboard.courseDetail.lifetimeAccess')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              <span>{t('dashboard.courseDetail.certificateIncluded')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs / Modules */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">{t('dashboard.courseDetail.curriculum')}</h2>

              <div className="space-y-4">
                {modules.length === 0 ? (
                  <div className="text-center py-10 bg-card rounded-xl border border-border animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('dashboard.courseDetail.comingSoon')}</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      {t('dashboard.courseDetail.noLessonsComingSoon')}
                    </p>
                  </div>
                ) : (
                  modules.map((module) => (
                    <div key={module.id} className="border border-border rounded-xl bg-card overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors text-left"
                      >
                        <span className="font-semibold flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                            {module.order}
                          </div>
                          {t(`modules.${module.title}`) || t(module.title) || module.title}
                        </span>
                        {expandedModules.includes(module.id) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>

                      {expandedModules.includes(module.id) ? (
                        <div className="divide-y divide-border">
                          {module.lessons && module.lessons.length > 0 ? (
                            module.lessons.map((lesson) => (
                              <div key={lesson.id} className="p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                                {isEnrolled || lesson.is_free ? (
                                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Play className="w-4 h-4 fill-current" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Lock className="w-4 h-4" />
                                  </div>
                                )}

                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{t(`lessons.${lesson.title}`) || t(lesson.title) || lesson.title}</span>
                                    {lesson.is_free && !isEnrolled && (
                                      <span className="text-[10px] uppercase font-bold bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                                        {t('dashboard.courseDetail.free')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{lesson.duration ? `${lesson.duration} ${t('common.minutes')}` : `10 ${t('common.minutes')}`}</div>
                                </div>

                                {(isEnrolled || lesson.is_free) && (
                                  <Link to={`/course/${id}/lesson/${lesson.id}`}>
                                    <Button size="sm" variant={isEnrolled ? "ghost" : "default"} className={!isEnrolled && lesson.is_free ? "bg-green-600 hover:bg-green-700 text-white h-7 text-xs" : ""}>
                                      {isEnrolled ? t('dashboard.courseDetail.start') : t('dashboard.courseDetail.watchDemo', "Demo ko'rish")}
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              {t('dashboard.courseDetail.noLessons')}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Requirements */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {t('dashboard.courseDetail.requirements')}
                </h3>
                {course.requirements && course.requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('dashboard.courseDetail.noRequirements')}</p>
                )}
              </div>
            </div>
          </div>

          <PaymentModal
            isOpen={showPayModal}
            onClose={() => setShowPayModal(false)}
            requiredAmount={course ? Math.max(0, course.price - userBalance) : 0}
            onSuccess={(newBalance) => {
              setUserBalance(newBalance);
              toast.info(t('dashboard.courseDetail.balanceUpdated'));
            }}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CourseDetailPage;
