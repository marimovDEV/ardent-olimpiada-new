import { useState, useEffect, useMemo } from "react";
import {
    User,
    Mail,
    Phone,
    BookOpen,
    Plus,
    Trash2,
    Edit2,
    Search,
    Shield,
    CheckCircle,
    XCircle,
    Clock,
    MoreHorizontal,
    Eye,
    Ban,
    ExternalLink,
    GraduationCap,
    Award,
    Calendar,
    ChevronRight,
    Loader2,
    MessageSquare,
    Globe,
    Instagram,
    Youtube,
    Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface TeacherProfile {
    bio: string;
    experience_years: number;
    specialization: string;
    verification_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
    rejection_reason?: string;
    telegram_username?: string;
    instagram_username?: string;
    youtube_channel?: string;
    linkedin_profile?: string;
    approved_at?: string;
}

interface Teacher {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    subjects_count?: number;
    courses_count?: number;
    avatar_url?: string;
    teacher_profile?: TeacherProfile;
    is_active: boolean;
    date_joined: string;
}

const BASE_URL = API_URL.replace('/api', '');

const AdminTeachersPage = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Dialog States
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Create/Edit State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        phone: "",
        password: ""
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/users/?role=TEACHER`, { headers: getAuthHeader() });
            setTeachers(res.data.results || res.data);
        } catch (error) {
            console.error(error);
            toast.error("O'qituvchilarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyStatus = async (teacherId: number, status: string, reason?: string) => {
        setIsSubmitting(true);
        try {
            await axios.post(`${API_URL}/users/${teacherId}/verify_teacher/`, {
                status,
                rejection_reason: reason
            }, { headers: getAuthHeader() });

            toast.success(`Status ${status} ga o'zgartirildi`);
            setRejectDialogOpen(false);
            setRejectionReason("");
            fetchTeachers();
            if (selectedTeacher?.id === teacherId) {
                // Update selected teacher in view modal if open
                const updatedRes = await axios.get(`${API_URL}/users/${teacherId}/`, { headers: getAuthHeader() });
                setSelectedTeacher(updatedRes.data);
            }
        } catch (error) {
            toast.error("Statusni o'zgartirishda xatolik");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleActive = async (userId: number, currentActive: boolean) => {
        try {
            await axios.post(`${API_URL}/users/${userId}/toggle_active/`, {}, { headers: getAuthHeader() });
            setTeachers(teachers.map(t => t.id === userId ? { ...t, is_active: !currentActive } : t));
            toast.success(!currentActive ? "Faollashtirildi" : "Bloklandi");
        } catch (error) {
            toast.error("Amaliyot bajarilmadi");
        }
    };

    const handleDeleteTeacher = async (userId: number) => {
        // Confirmation
        if (!window.confirm("Bu o'qituvchini butunlay o'chirmoqchimisiz? Bu amal qaytarib bo'lmaydi!")) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/users/${userId}/`, { headers: getAuthHeader() });
            setTeachers(teachers.filter(t => t.id !== userId));
            toast.success("O'qituvchi muvaffaqiyatli o'chirildi");
        } catch (error) {
            console.error(error);
            toast.error("O'qituvchini o'chirishda xatolik yuz berdi");
        }
    };

    const handleCreateTeacher = async () => {
        if (!formData.username || (!editMode && !formData.password) || !formData.first_name) {
            toast.error("Ma'lumotlarni to'liq to'ldiring");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editMode && selectedTeacher) {
                // Update User info
                await axios.patch(`${API_URL}/users/${selectedTeacher.id}/`, {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone ? `+998${formData.phone}` : "",
                }, { headers: getAuthHeader() });

                toast.success("O'qituvchi ma'lumotlari yangilandi");
            } else {
                // Create
                const userData = {
                    ...formData,
                    phone: formData.phone ? (formData.phone.startsWith('+') ? formData.phone : `+998${formData.phone}`) : "",
                    role: 'TEACHER'
                };
                await axios.post(`${API_URL}/auth/register/`, userData);
                toast.success("Yangi o'qituvchi qo'shildi");
            }

            setDialogOpen(false);
            fetchTeachers();
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error("Xatolik yuz berdi");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setEditMode(true);
        setFormData({
            first_name: teacher.first_name,
            last_name: teacher.last_name,
            username: teacher.username,
            phone: teacher.phone?.replace('+998', '') || '',
            password: ""
        });
        setDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({ first_name: "", last_name: "", username: "", phone: "", password: "" });
        setEditMode(false);
        setSelectedTeacher(null);
    };

    const filteredTeachers = useMemo(() => {
        return teachers.filter(t => {
            const fullName = `${t.first_name} ${t.last_name}`.toLowerCase();
            const matchesSearch = fullName.includes(search.toLowerCase()) ||
                (t.phone && t.phone.includes(search)) ||
                t.username.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === "ALL" ||
                t.teacher_profile?.verification_status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [teachers, search, statusFilter]);

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30">Tasdiqlangan</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30">Rad etilgan</Badge>;
            case 'BLOCKED':
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">Bloklangan</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30">Kutilmoqda</Badge>;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-8 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">O'qituvchilarni boshqarish</h1>
                        <p className="text-muted-foreground font-medium">Mentorlar ro'yxati, arizalar va tasdiqlash jarayoni</p>
                    </div>
                </div>

                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="h-14 px-8 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                            <Plus className="w-5 h-5" />
                            O'qituvchi qo'shish
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none bg-background shadow-2xl p-0 overflow-hidden">
                        <DialogHeader className="p-10 pb-4">
                            <DialogTitle className="text-3xl font-black tracking-tight">{editMode ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}</DialogTitle>
                            <DialogDescription className="text-base font-medium">
                                O'qituvchi shaxsiy ma'lumotlari va tizimga kirish uchun login yaratish.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-10 pt-4 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Ism *</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 font-bold"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Familiya</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 font-bold"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Login (Username) *</Label>
                                    <Input
                                        className="h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 font-bold"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        disabled={editMode}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Telefon</Label>
                                    <div className="flex items-center bg-muted/30 border-2 border-transparent focus-within:border-primary/20 rounded-2xl px-4 h-14">
                                        <span className="text-muted-foreground font-black mr-2">+998</span>
                                        <input
                                            className="flex-1 bg-transparent border-none outline-none h-full text-foreground font-bold"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                                setFormData({ ...formData, phone: val });
                                            }}
                                            placeholder="901234567"
                                        />
                                    </div>
                                </div>
                            </div>

                            {!editMode && (
                                <div className="space-y-3">
                                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Parol *</Label>
                                    <Input
                                        type="password"
                                        className="h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 font-bold"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter className="p-10 pt-0 gap-3">
                            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-14 px-8 rounded-2xl font-bold border-2">Bekor qilish</Button>
                            <Button
                                onClick={handleCreateTeacher}
                                disabled={isSubmitting}
                                className="h-14 px-10 rounded-2xl font-black bg-primary shadow-xl shadow-primary/20"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Saqlash"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Ism, telefon yoki login..."
                        className="pl-12 h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
                    <TabsList className="bg-muted/30 p-1.5 h-14 rounded-2xl border border-border">
                        <TabsTrigger value="ALL" className="rounded-xl px-6 font-bold h-11 data-[state=active]:bg-card data-[state=active]:shadow-md">Hammasi</TabsTrigger>
                        <TabsTrigger value="PENDING" className="rounded-xl px-6 font-bold h-11 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Kutilmoqda</TabsTrigger>
                        <TabsTrigger value="APPROVED" className="rounded-xl px-6 font-bold h-11 data-[state=active]:bg-green-600 data-[state=active]:text-white">Tasdiqlangan</TabsTrigger>
                        <TabsTrigger value="REJECTED" className="rounded-xl px-6 font-bold h-11 data-[state=active]:bg-red-600 data-[state=active]:text-white">Rad etilgan</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-card h-[380px] rounded-3xl border border-border animate-pulse" />
                    ))
                ) : filteredTeachers.map((teacher) => (
                    <Card key={teacher.id} className="group relative overflow-hidden rounded-3xl border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card">
                        <div className={`h-2.5 w-full ${teacher.teacher_profile?.verification_status === 'APPROVED' ? 'bg-green-500' :
                            teacher.teacher_profile?.verification_status === 'REJECTED' ? 'bg-red-500' :
                                'bg-yellow-500'
                            }`} />

                        <CardHeader className="pt-8 pb-4 px-8">
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-2xl uppercase border-2 border-primary/10">
                                        {teacher.avatar_url ? (
                                            <img
                                                src={teacher.avatar_url.startsWith('http') ? teacher.avatar_url : `${BASE_URL}${teacher.avatar_url}`}
                                                className="w-full h-full object-cover rounded-2xl"
                                                alt=""
                                            />
                                        ) : (
                                            `${teacher.first_name?.[0]}${teacher.last_name?.[0]}`
                                        )}
                                    </div>
                                    {teacher.is_active && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-card rounded-full shadow-lg" />
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted">
                                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-border shadow-2xl">
                                        <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Boshqaruv</DropdownMenuLabel>
                                        <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl py-2.5 px-3 focus:bg-primary/5" onClick={() => { setSelectedTeacher(teacher); setViewDialogOpen(true); }}>
                                            <Eye className="w-4 h-4 text-primary" /> Profilni ko'rish
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl py-2.5 px-3 focus:bg-primary/5" onClick={() => openEdit(teacher)}>
                                            <Edit2 className="w-4 h-4 text-blue-500" /> Tahrirlash
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="my-2" />

                                        {teacher.is_active ? (
                                            <DropdownMenuItem
                                                className="cursor-pointer gap-3 rounded-xl py-2.5 px-3 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 font-bold"
                                                onClick={() => handleToggleActive(teacher.id, true)}
                                            >
                                                <Ban className="w-4 h-4" /> Bloklash
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                className="cursor-pointer gap-3 rounded-xl py-2.5 px-3 text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-900/20 font-bold"
                                                onClick={() => handleToggleActive(teacher.id, false)}
                                            >
                                                <CheckCircle className="w-4 h-4" /> Faollashtirish
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator className="my-2" />

                                        <DropdownMenuItem
                                            className="cursor-pointer gap-3 rounded-xl py-2.5 px-3 text-red-700 focus:text-red-700 focus:bg-red-100 dark:focus:bg-red-950 font-black"
                                            onClick={() => handleDeleteTeacher(teacher.id)}
                                        >
                                            <Trash2 className="w-4 h-4" /> O'chirish
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <CardTitle className="text-xl font-black text-foreground mb-1">
                                    {(teacher.first_name && teacher.first_name !== 'undefined') ? teacher.first_name : ''} {(teacher.last_name && teacher.last_name !== 'undefined') ? teacher.last_name : ''}
                                    {(!teacher.first_name || teacher.first_name === 'undefined') && (!teacher.last_name || teacher.last_name === 'undefined') && teacher.username}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-sm font-bold text-primary/70">
                                    <Shield className="w-4 h-4" />
                                    {teacher.teacher_profile?.specialization || "Mutaxassislik belgilanmagan"}
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="px-8 pb-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-muted-foreground uppercase tracking-wider">Status:</span>
                                {getStatusBadge(teacher.teacher_profile?.verification_status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                                    <div className="text-xl font-black text-foreground">{teacher.courses_count || 0}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kurslar</div>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                                    <div className="text-xl font-black text-foreground">{teacher.teacher_profile?.experience_years || 0}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tajriba yil</div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    {teacher.phone || "Telefon yo'q"}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <span className="truncate">{teacher.email || teacher.username}</span>
                                </div>
                            </div>
                        </CardContent>

                        {teacher.teacher_profile?.verification_status === 'PENDING' && (
                            <CardFooter className="px-8 pb-8 pt-0 grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="rounded-xl h-12 font-black border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-900/20"
                                    onClick={() => { setSelectedTeacher(teacher); setRejectDialogOpen(true); }}
                                >
                                    <XCircle className="w-4 h-4 mr-2" /> Rad etish
                                </Button>
                                <Button
                                    className="rounded-xl h-12 font-black bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                                    onClick={() => handleVerifyStatus(teacher.id, 'APPROVED')}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> Tasdiqlash
                                </Button>
                            </CardFooter>
                        )}

                        {teacher.teacher_profile?.verification_status === 'REJECTED' && (
                            <CardFooter className="px-8 pb-8 pt-0">
                                <Button
                                    className="w-full rounded-xl h-12 font-black bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    onClick={() => handleVerifyStatus(teacher.id, 'APPROVED')}
                                >
                                    Fikrim o'zgardi: Tasdiqlash
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {!loading && filteredTeachers.length === 0 && (
                <div className="bg-card border border-border rounded-3xl p-20 text-center">
                    <GraduationCap className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-20" />
                    <h3 className="text-2xl font-black text-foreground">O'qituvchilar topilmadi</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2 italic">Qidiruv kriteriyalarini o'zgartirib ko'ring yoki boshqa statusni tanlang.</p>
                </div>
            )}

            {/* Detailed Profile View Modal */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-[32px] border-none bg-background shadow-2xl">
                    {selectedTeacher && (
                        <div className="flex flex-col h-full max-h-[90vh]">
                            {/* Modal Header/Hero */}
                            <div className="h-48 bg-gradient-to-br from-primary to-primary-foreground/20 relative">
                                <div className="absolute -bottom-16 left-10">
                                    <div className="w-32 h-32 rounded-3xl bg-background p-1.5 shadow-2xl">
                                        <div className="w-full h-full rounded-[22px] bg-muted flex items-center justify-center text-3xl font-black text-primary border-4 border-muted overflow-hidden">
                                            {selectedTeacher.avatar_url ? (
                                                <img
                                                    src={selectedTeacher.avatar_url.startsWith('http') ? selectedTeacher.avatar_url : `${BASE_URL}${selectedTeacher.avatar_url}`}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            ) : (
                                                `${selectedTeacher.first_name?.[0]}${selectedTeacher.last_name?.[0]}`
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute top-6 right-6 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/20"
                                    onClick={() => setViewDialogOpen(false)}
                                >
                                    <XCircle className="w-6 h-6 text-white" />
                                </Button>
                            </div>

                            <ScrollArea className="flex-1 pt-24 pb-10 px-10">
                                <div className="space-y-10">
                                    {/* Name & Basic Info */}
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-3xl font-black tracking-tight">{selectedTeacher.first_name} {selectedTeacher.last_name}</h2>
                                                {getStatusBadge(selectedTeacher.teacher_profile?.verification_status)}
                                            </div>
                                            <p className="text-lg font-bold text-primary flex items-center gap-2">
                                                <Award className="w-5 h-5" />
                                                {selectedTeacher.teacher_profile?.specialization || "O'qituvchi"}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="outline" className="rounded-xl h-12 px-6 font-bold border-2">
                                                <MessageSquare className="w-4 h-4 mr-2" /> Xabar yozish
                                            </Button>
                                            {selectedTeacher.teacher_profile?.verification_status === 'PENDING' && (
                                                <Button
                                                    className="rounded-xl h-12 px-6 font-black bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20"
                                                    onClick={() => handleVerifyStatus(selectedTeacher.id, 'APPROVED')}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" /> Tasdiqlash
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <Separator className="bg-border/60" />

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tajriba</p>
                                            <p className="text-xl font-black">{selectedTeacher.teacher_profile?.experience_years || 0} yil</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kurslar soni</p>
                                            <p className="text-xl font-black">{selectedTeacher.courses_count || 0} ta</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mutaxassislik</p>
                                            <p className="text-xl font-black truncate max-w-[150px]">{selectedTeacher.teacher_profile?.specialization || "-"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">A'zo bo'lgan sanasi</p>
                                            <p className="text-xl font-black">{new Date(selectedTeacher.date_joined).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Bio Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            Biografiya hamma haqida
                                        </h3>
                                        <div className="bg-muted/30 p-8 rounded-[32px] border border-border/50 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
                                            <p className="text-foreground/80 leading-relaxed font-medium">
                                                {selectedTeacher.teacher_profile?.bio || "Biografiya ma'lumotlari kiritilmagan."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contacts & Socials */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-black flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-blue-500" />
                                                </div>
                                                Aloqa ma'lumotlari
                                            </h3>
                                            <div className="space-y-4 font-bold">
                                                <div className="flex items-center gap-4 group cursor-pointer hover:text-primary transition-colors">
                                                    <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/5">
                                                        <Phone className="w-5 h-5" />
                                                    </div>
                                                    <span>{selectedTeacher.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-4 group cursor-pointer hover:text-primary transition-colors">
                                                    <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/5">
                                                        <Mail className="w-5 h-5" />
                                                    </div>
                                                    <span>{selectedTeacher.email || `${selectedTeacher.username}@ardent.uz`}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-xl font-black flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/5 flex items-center justify-center">
                                                    <Globe className="w-5 h-5 text-purple-500" />
                                                </div>
                                                Ijtimoiy tarmoqlar
                                            </h3>
                                            <div className="flex flex-wrap gap-4">
                                                <SocialButton icon={<Send />} label="Telegram" value={selectedTeacher.teacher_profile?.telegram_username} color="bg-[#0088cc]" />
                                                <SocialButton icon={<Instagram />} label="Instagram" value={selectedTeacher.teacher_profile?.instagram_username} color="bg-gradient-to-tr from-[#f09433] to-[#bc1888]" />
                                                <SocialButton icon={<Youtube />} label="YouTube" value={selectedTeacher.teacher_profile?.youtube_channel} color="bg-[#ff0000]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification History / Notes */}
                                    {selectedTeacher.teacher_profile?.rejection_reason && (
                                        <div className="p-8 rounded-[32px] bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
                                            <div className="flex items-center gap-3 mb-4 text-red-600">
                                                <XCircle className="w-6 h-6" />
                                                <span className="font-black uppercase tracking-widest text-xs">Oxirgi rad etish sababi</span>
                                            </div>
                                            <p className="text-red-700/80 font-bold leading-relaxed">{selectedTeacher.teacher_profile.rejection_reason}</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Rejection Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">Rad etish sababi</DialogTitle>
                        <DialogDescription className="font-medium">O'qituvchiga nega arizasi rad etilganini tushuntiring. Bu uning bildirishnomasida ko'rinadi.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 block">Sabab / Izoh *</Label>
                        <Textarea
                            placeholder="Masalan: Ma'lumotlar yetarli emas yoki mutaxassislik bizning yo'nalishimizga to'g'ri kelmaydi..."
                            className="rounded-2xl min-h-[150px] border-2 focus-visible:ring-primary/20 bg-muted/20"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="rounded-2xl h-12 px-8 font-bold">Bekor qilish</Button>
                        <Button
                            variant="destructive"
                            disabled={!rejectionReason || isSubmitting}
                            onClick={() => handleVerifyStatus(selectedTeacher!.id, 'REJECTED', rejectionReason)}
                            className="rounded-2xl h-12 px-8 font-black shadow-lg shadow-red-500/20"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rad etishni tasdiqlash"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const SocialButton = ({ icon, label, value, color }: { icon: any, label: string, value?: string, color: string }) => {
    if (!value) return null;
    return (
        <a
            href={value.startsWith('http') ? value : `https://${label.toLowerCase()}.com/${value.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className={`${color} text-white px-5 py-3 rounded-2xl flex items-center gap-3 font-black text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group`}
        >
            <span className="w-5 h-5">{icon}</span>
            {label}
            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>
    );
}

export default AdminTeachersPage;
