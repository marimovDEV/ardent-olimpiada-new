import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, MoreVertical, Plus, BookOpen, DollarSign, TrendingUp, AlertTriangle, Archive, Users, Eye, Edit2, Trash2, GraduationCap, Clock, Star, ExternalLink, ShieldCheck, Settings2, BarChart3, Layers } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";
import CourseWizard from "@/components/admin/CourseWizard";
import CourseContentManager from "@/components/admin/CourseContentManager";

// API Data Types
interface Course {
    id: number;
    title: string;
    description: string;
    subject: number | null;
    subject_name: string;
    level: string;
    students_count: number;
    price: number;
    is_active: boolean;
    status: string;
    status_display: string;
    lessons_count: number;
    rating: number;
    thumbnail_url?: string;
    teacher_name?: string;
    teacher_avatar?: string;
    created_at: string;
}

const AdminCoursesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subjectFilter, setSubjectFilter] = useState("all");
    const [subjects, setSubjects] = useState<any[]>([]);

    // UI States
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
    const [isContentManagerOpen, setIsContentManagerOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Course>>({
        subject: null,
        level: "Beginner",
        is_active: false,
        price: 0,
        title: "",
        description: ""
    });

    useEffect(() => {
        fetchCourses();
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${API_URL}/subjects/`, { headers: getAuthHeader() });
            setSubjects(res.data.results || res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/courses/`, { headers: getAuthHeader() });
            setCourses(res.data.results || res.data);
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: t('admin.olympiads.loadError'), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // FILTER LOGIC
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" ||
            course.status === statusFilter ||
            (statusFilter === "Active" && course.is_active) ||
            (statusFilter === "Draft" && course.status === "DRAFT");
        const matchesSubject = subjectFilter === "all" || course.subject?.toString() === subjectFilter;
        return matchesSearch && matchesStatus && matchesSubject;
    });

    // HANDLERS
    const handleSaveCourse = async () => {
        if (!formData.title || !formData.description) {
            toast({ title: t('common.error'), description: t('common.fillFields'), variant: "destructive" });
            return;
        }

        try {
            if (editMode && currentCourseId) {
                // Update
                const res = await axios.put(`${API_URL}/courses/${currentCourseId}/`, formData, { headers: getAuthHeader() });
                setCourses(courses.map(c => c.id === currentCourseId ? res.data : c));
                toast({ title: t('common.success'), description: t('admin.courseUpdated') });
            } else {
                // Create
                const res = await axios.post(`${API_URL}/courses/`, formData, { headers: getAuthHeader() });
                setCourses([res.data, ...courses]);
                toast({ title: t('common.success'), description: t('admin.newCourse') + " " + t('common.add') });
            }
            setIsSheetOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: t('admin.saveError'), variant: "destructive" });
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${API_URL}/courses/${deleteId}/`, { headers: getAuthHeader() });
            setCourses(courses.filter(c => c.id !== deleteId));
            toast({ title: t('admin.delete'), description: t('admin.courseDeleted') || "Kurs o'chirildi", variant: "destructive" });
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: t('admin.deleteError'), variant: "destructive" });
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await axios.post(`${API_URL}/courses/${id}/approve/`, {}, { headers: getAuthHeader() });
            setCourses(courses.map(c => c.id === id ? { ...c, status: 'APPROVED' } : c));
            toast({ title: t('common.success'), description: t('admin.courseApproved') });
        } catch (error) {
            toast({ title: t('common.error'), description: t('admin.approveError') || "Tasdiqlashda xatolik", variant: "destructive" });
        }
    };

    const handleReject = async (id: number) => {
        try {
            await axios.post(`${API_URL}/courses/${id}/reject/`, {}, { headers: getAuthHeader() });
            setCourses(courses.map(c => c.id === id ? { ...c, status: 'REJECTED', is_active: false } : c));
            toast({ title: t('common.success'), description: t('admin.courseRejected') });
        } catch (error) {
            toast({ title: t('common.error'), description: t('admin.rejectError') || "Rad etishda xatolik", variant: "destructive" });
        }
    };

    const openEdit = (course: Course) => {
        setEditMode(true);
        setCurrentCourseId(course.id);
        setFormData({
            title: course.title,
            description: course.description,
            subject: course.subject,
            level: course.level,
            price: course.price,
            is_active: course.is_active
        });
        setIsSheetOpen(true);
    };

    const resetForm = () => {
        setFormData({ subject: null, level: "Beginner", is_active: false, price: 0, title: "", description: "" });
        setEditMode(false);
        setCurrentCourseId(null);
    };

    const getStatusBadge = (course: Course) => {
        if (course.is_active) return <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-500 hover:bg-green-200 border-green-200">{t('admin.active')}</Badge>;

        switch (course.status) {
            case 'PENDING':
                return <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 border-yellow-200">{t('admin.pending')}</Badge>;
            case 'REJECTED':
                return <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-500 border-red-200">{t('admin.rejected')}</Badge>;
            case 'APPROVED':
                return <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 border-blue-200">{t('admin.approved')}</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border-gray-200">{t('admin.draft')}</Badge>;
        }
    };

    const formatMoney = (amount: number) => {
        if (amount === 0) return t('courseDetail.free');
        return `${amount.toLocaleString()} ${t('olympiadsSection.currency')}`;
    };

    // Calculate Stats
    const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.students_count), 0);
    const totalStudents = courses.reduce((acc, c) => acc + c.students_count, 0);

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-8 rounded-3xl border border-border shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">{t('admin.courseMgmt')}</h1>
                    <p className="text-muted-foreground font-medium">{t('admin.courseMgmtDesc')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="h-14 px-6 rounded-2xl font-bold border-border/50 hover:bg-muted transition-all"
                        onClick={() => navigate('/admin/finance')}
                    >
                        <BarChart3 className="w-5 h-5 mr-3 text-primary" />
                        {t('admin.reports')}
                    </Button>
                    <Button
                        onClick={() => { resetForm(); setIsSheetOpen(true); }}
                        className="h-14 px-8 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        {t('admin.newCourse')}
                    </Button>
                </div>
            </div>

            <CourseWizard
                open={isSheetOpen}
                onOpenChange={(open) => { setIsSheetOpen(open); if (!open) resetForm(); }}
                onSuccess={fetchCourses}
                courseId={currentCourseId}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: t('admin.courses'), value: courses.length, icon: BookOpen, color: "blue" },
                    { label: t('admin.activeStudents'), value: totalStudents, icon: Users, color: "green" },
                    { label: t('admin.totalRevenue'), value: formatMoney(totalRevenue), icon: DollarSign, color: "yellow" },
                    { label: t('admin.avgRating'), value: "4.8", icon: Star, color: "purple" }
                ].map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-5 group hover:border-primary/20 transition-all">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : stat.color === 'green' ? 'bg-green-500/10 text-green-500' : stat.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-purple-500/10 text-purple-500'}`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-foreground">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Toolbar */}
            <div className="bg-card/50 backdrop-blur-xl p-4 rounded-3xl border border-border/50 flex flex-col lg:flex-row gap-6 justify-between items-center shadow-sm">
                <div className="relative w-full lg:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder={t('admin.searchPlaceholder')}
                        className="h-12 pl-12 rounded-2xl bg-background border-none shadow-inner text-base font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap w-full lg:w-auto gap-4">
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger className="h-12 min-w-[160px] rounded-2xl bg-background border-none shadow-sm font-bold">
                            <Layers className="w-4 h-4 mr-2 text-primary" />
                            <SelectValue placeholder={t('admin.fan')} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border shadow-xl">
                            <SelectItem value="all" className="rounded-xl">{t('filters.all_subjects')}</SelectItem>
                            {subjects.map(s => (
                                <SelectItem key={s.id} value={s.id.toString()} className="rounded-xl">{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="h-12 p-1.5 bg-background rounded-2xl shadow-sm flex gap-1">
                        {[
                            { id: "all", label: t('admin.allStatuses') },
                            { id: "PENDING", label: t('admin.pending') },
                            { id: "Active", label: t('admin.active') },
                            { id: "DRAFT", label: t('admin.draft') }
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setStatusFilter(s.id)}
                                className={`px-4 h-full rounded-xl text-xs font-black transition-all ${statusFilter === s.id ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="group relative bg-card rounded-[32px] border border-border shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500">
                        {/* Course Thumbnail */}
                        <div className="relative h-48 w-full overflow-hidden bg-muted">
                            {course.thumbnail_url ? (
                                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-blue-500/10">
                                    <GraduationCap className="w-16 h-16 text-primary/20" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                {getStatusBadge(course)}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <Badge className="bg-background/90 backdrop-blur-md text-foreground border-none px-3 py-1.5 rounded-xl font-bold text-xs">
                                    {course.subject_name}
                                </Badge>
                                <div className="bg-primary text-white px-4 py-2 rounded-2xl font-black shadow-lg">
                                    {formatMoney(course.price)}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-bold">{course.rating || 0}</span>
                                    <span className="text-xs text-muted-foreground ml-1">({t('admin.studentsCountLabel', { count: course.students_count })})</span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex -space-x-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-full border-2 border-card bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary overflow-hidden">
                                        {course.teacher_avatar ? (
                                            <img src={course.teacher_avatar} className="w-full h-full object-cover" />
                                        ) : (
                                            course.teacher_name?.substring(0, 1) || 'T'
                                        )}
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground italic">
                                        +{course.students_count > 0 ? (course.students_count > 99 ? '99' : course.students_count) : '0'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-black text-muted-foreground">
                                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-xl">
                                        <Layers className="w-3.5 h-3.5 text-primary" />
                                        {t('admin.lessonsCountLabel', { count: course.lessons_count })}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-xl">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                        {t('admin.hoursCountLabel', { count: 12 })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-2xl h-12 font-bold border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                                    onClick={() => openEdit(course)}
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    {t('admin.edit')}
                                </Button>
                                <Button
                                    className="flex-1 rounded-2xl h-12 font-black shadow-md shadow-primary/10"
                                    onClick={() => { setCurrentCourseId(course.id); setIsContentManagerOpen(true); }}
                                >
                                    <Layers className="w-4 h-4 mr-2" />
                                    {t('admin.content')}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-border">
                                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-border shadow-2xl">
                                        <DropdownMenuItem className="rounded-xl h-11 font-bold gap-3" onClick={() => openEdit(course)}>
                                            <Settings2 className="w-4 h-4 text-primary" /> {t('admin.settings')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl h-11 font-bold gap-3">
                                            <Eye className="w-4 h-4 text-blue-500" /> {t('admin.view')}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-2" />
                                        {course.status === 'PENDING' && (
                                            <>
                                                <DropdownMenuItem className="rounded-xl h-11 font-bold gap-3 text-green-600 focus:text-green-700" onClick={() => handleApprove(course.id)}>
                                                    <ShieldCheck className="w-4 h-4" /> {t('common.approve')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl h-11 font-bold gap-3 text-red-600 focus:text-red-700" onClick={() => handleReject(course.id)}>
                                                    <Trash2 className="w-4 h-4" /> {t('common.reject')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                            </>
                                        )}
                                        <DropdownMenuItem className="rounded-xl h-11 font-bold gap-3 text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => setDeleteId(course.id)}>
                                            <Trash2 className="w-4 h-4" /> {t('admin.delete')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {!loading && filteredCourses.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center bg-card rounded-[40px] border border-dashed border-border">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground animate-pulse">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h3 className="font-black text-2xl text-foreground mb-2">{t('admin.noResults')}</h3>
                    <p className="text-muted-foreground max-w-sm mb-8 font-medium">{t('admin.tryChangingSearch')}</p>
                    <Button
                        variant="outline"
                        className="h-12 px-8 rounded-2xl font-bold"
                        onClick={() => { setSearchQuery(""); setStatusFilter("all"); setSubjectFilter("all") }}
                    >
                        {t('admin.clearFilters')}
                    </Button>
                </div>
            )}

            {/* Delete Confirmation */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none bg-background shadow-2xl">
                    <DialogHeader className="space-y-4 pt-4">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <div className="text-center space-y-2">
                            <DialogTitle className="text-2xl font-black text-foreground">
                                {t('admin.deleteCourse')}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground font-medium px-4">
                                {t('admin.deleteConfirmText', { title: courses.find(c => c.id === deleteId)?.title })}
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row gap-3 p-4">
                        <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setDeleteId(null)}>{t('admin.cancel')}</Button>
                        <Button variant="destructive" className="flex-1 h-12 rounded-2xl font-black shadow-lg shadow-red-500/20" onClick={handleDelete}>{t('admin.delete')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Course Content Manager Overlay */}
            {isContentManagerOpen && currentCourseId && (
                <div className="fixed inset-0 z-50 bg-background overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
                    <CourseContentManager
                        courseId={currentCourseId}
                        onClose={() => setIsContentManagerOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminCoursesPage;
