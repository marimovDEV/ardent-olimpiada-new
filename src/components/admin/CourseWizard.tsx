import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    DollarSign,
    Layers,
    Video,
    FileText,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Settings,
    Upload,
    Image as ImageIcon
} from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

interface Subject {
    id: number;
    name: string;
}

interface Teacher {
    id: number;
    full_name: string;
    role: string;
}

interface CourseWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    courseId?: number | null;
}

const CourseWizard = ({ open, onOpenChange, onSuccess, courseId }: CourseWizardProps) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [internalCourseId, setInternalCourseId] = useState<number | null>(null);

    // Sync internal ID with prop
    useEffect(() => {
        setInternalCourseId(courseId || null);
    }, [courseId]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "",
        level: "BEGINNER",
        price: 0,
        is_active: false,
        xp_reward: 50,
        language: "uz",
        status: "DRAFT",
        teacher: "",
        is_certificate_enabled: false,
        certificate_template: "",
        thumbnail: null as File | string | null
    });
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [newSubject, setNewSubject] = useState("");
    const [showNewSubject, setShowNewSubject] = useState(false);
    const [modules, setModules] = useState<{ id?: number, title: string, order: number }[]>([]);

    useEffect(() => {
        if (open) {
            fetchSubjects();
            fetchTeachers();
            if (internalCourseId) {
                fetchCourseDetails();
            } else {
                resetForm();
            }
        }
    }, [open, internalCourseId]);

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${API_URL}/subjects/`, { headers: getAuthHeader() });
            setSubjects(res.data.results || res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/?role=TEACHER`, { headers: getAuthHeader() });
            setTeachers(res.data.results || res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCourseDetails = async () => {
        if (!internalCourseId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/courses/${internalCourseId}/`, { headers: getAuthHeader() });
            const data = res.data;
            setFormData({
                title: data.title,
                description: data.description,
                subject: data.subject?.toString() || "",
                level: data.level,
                price: Number(data.price),
                is_active: data.is_active,
                xp_reward: data.xp_reward,
                language: data.language,
                status: data.status,
                teacher: data.teacher?.toString() || "",
                is_certificate_enabled: data.is_certificate_enabled || false,
                certificate_template: data.certificate_template || ""
            });
            if (data.modules) {
                setModules(data.modules);
            }
            if (data.thumbnail) {
                setThumbnailPreview(data.thumbnail);
            }
        } catch (error) {
            toast({ title: "Xatolik", description: "Kurs ma'lumotlarini yuklashda xatolik", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            subject: "",
            level: "BEGINNER",
            price: 0,
            is_active: false,
            xp_reward: 50,
            language: "uz",
            status: "DRAFT",
            teacher: "",
            is_certificate_enabled: false,
            certificate_template: "",
            thumbnail: null
        });
        setThumbnailPreview(null);
        setModules([]);
        setInternalCourseId(null);
        setStep(1);
    };

    const handleCreateSubject = async () => {
        if (!newSubject) return;
        try {
            const res = await axios.post(`${API_URL}/subjects/`, { name: newSubject }, { headers: getAuthHeader() });
            setSubjects([...subjects, res.data]);
            setFormData({ ...formData, subject: res.data.id.toString() });
            setNewSubject("");
            setShowNewSubject(false);
            toast({ title: "Muvaffaqiyatli", description: "Fan qo'shildi" });
        } catch (error) {
            toast({ title: "Xatolik", description: "Fan qo'shishda xatolik", variant: "destructive" });
        }
    };

    const handleAddModule = async () => {
        if (!internalCourseId) return;
        const title = prompt(t('admin.moduleTitlePlaceholder') || "Modul nomi");
        if (!title) return;

        try {
            const res = await axios.post(`${API_URL}/modules/`, {
                course: internalCourseId,
                title,
                order: modules.length + 1
            }, { headers: getAuthHeader() });
            setModules([...modules, res.data]);
            toast({ title: "Muvaffaqiyatli", description: "Modul qo'shildi" });
        } catch (error) {
            toast({ title: "Xatolik", description: "Modul qo'shishda xatolik", variant: "destructive" });
        }
    };

    const handleDeleteModule = async (id: number) => {
        if (!confirm(t('admin.confirmDelete') || "O'chirishni tasdiqlaysizmi?")) return;
        try {
            await axios.delete(`${API_URL}/modules/${id}/`, { headers: getAuthHeader() });
            setModules(modules.filter(m => m.id !== id));
            toast({ title: "O'chirildi", description: "Modul o'chirildi" });
        } catch (error) {
            toast({ title: "Xatolik", description: "Modulni o'chirishda xatolik", variant: "destructive" });
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            if (!formData.title || !formData.subject) {
                toast({ title: "Xatolik", description: "Sarlavha va fanni tanlang", variant: "destructive" });
                return;
            }
            // Save Basic Info
            setLoading(true);
            try {
                const url = internalCourseId ? `${API_URL}/courses/${internalCourseId}/` : `${API_URL}/courses/`;
                const method = internalCourseId ? 'patch' : 'post'; // Use patch for updates to avoid overwriting all fields

                const data = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (key === 'thumbnail') {
                        if (value instanceof File) {
                            data.append(key, value);
                        }
                        // If it's a string (existing URL), we don't need to send it back as it's already there
                    } else if (value !== null && value !== undefined) {
                        data.append(key, value.toString());
                    }
                });

                const res = await axios[method](url, data, {
                    headers: {
                        ...getAuthHeader(),
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (!internalCourseId) {
                    const newId = res.data.course?.id || res.data.id;
                    if (newId) {
                        setInternalCourseId(newId);
                    }
                    onSuccess();
                }
                setStep(2);
            } catch (error: any) {
                toast({
                    title: "Saqlashda xatolik",
                    description: error.response?.data?.errors?.non_field_errors?.[0] || "Ma'lumotlarni saqlashda xatolik yuz berdi",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            // Save final status and activation
            setLoading(true);
            try {
                const url = `${API_URL}/courses/${internalCourseId}/`;
                const data = new FormData();
                data.append('is_active', formData.is_active.toString());
                data.append('status', formData.status.toString());

                await axios.patch(url, data, {
                    headers: {
                        ...getAuthHeader(),
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast({ title: t('common.success') || "Muvaffaqiyatli", description: t('admin.courseUpdated') || "Kurs yangilandi" });
                onSuccess();
                onOpenChange(false);
            } catch (error: any) {
                toast({
                    title: "Saqlashda xatolik",
                    description: error.response?.data?.errors?.non_field_errors?.[0] || "Ma'lumotlarni saqlashda xatolik yuz berdi",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
                <SheetHeader className="mb-8">
                    <SheetTitle className="text-2xl font-black">
                        {courseId ? t('admin.editCourse') : t('admin.createCourse')}
                    </SheetTitle>
                    <SheetDescription>
                        {t('admin.createCourseDesc')}
                    </SheetDescription>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 mt-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === s ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' :
                                    step > s ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                </div>
                                {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-green-500' : 'bg-muted'} mx-1 rounded-full`} />}
                            </div>
                        ))}
                    </div>
                </SheetHeader>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
                        {/* Thumbnail Upload */}
                        <section className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Kurs Muqovasi (Cover Image)
                            </h4>
                            <div className="flex flex-col gap-4">
                                <div
                                    className="relative aspect-video rounded-2xl border-2 border-dashed border-muted hover:border-primary/50 transition-colors bg-muted/30 overflow-hidden group flex flex-col items-center justify-center cursor-pointer"
                                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                >
                                    {thumbnailPreview ? (
                                        <>
                                            <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button variant="secondary" size="sm">
                                                    <Upload className="w-4 h-4 mr-2" /> O'zgartirish
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-bold">Rasm yuklash</p>
                                            <p className="text-xs text-muted-foreground mt-1">Tavsiya etiladi: 1200x675 (16:9)</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="thumbnail-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setFormData({ ...formData, thumbnail: file });
                                            setThumbnailPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> {t('admin.basicInfo')}
                            </h4>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('admin.courseName')}</label>
                                <Input
                                    placeholder={t('admin.titlePlaceholder')}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Select value={formData.subject} onValueChange={(val) => setFormData({ ...formData, subject: val })}>
                                            <SelectTrigger className="flex-1"><SelectValue placeholder={t('admin.select')} /></SelectTrigger>
                                            <SelectContent>
                                                {subjects.map(s => (
                                                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setShowNewSubject(!showNewSubject)}
                                            type="button"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {showNewSubject && (
                                        <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
                                            <Input
                                                placeholder={t('admin.newSubjectPlaceholder') || "Yangi fan nomi"}
                                                value={newSubject}
                                                onChange={(e) => setNewSubject(e.target.value)}
                                                className="h-9"
                                            />
                                            <Button size="sm" onClick={handleCreateSubject}>{t('common.add') || "Qo'shish"}</Button>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('admin.level')}</label>
                                    <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BEGINNER">{t('admin.levels.beginner')}</SelectItem>
                                            <SelectItem value="INTERMEDIATE">{t('admin.levels.intermediate')}</SelectItem>
                                            <SelectItem value="ADVANCED">{t('admin.levels.pro')}</SelectItem>
                                            <SelectItem value="OLYMPIAD">{t('admin.levels.olympiad')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">O'qituvchi</label>
                                    <Select value={formData.teacher} onValueChange={(val) => setFormData({ ...formData, teacher: val })}>
                                        <SelectTrigger><SelectValue placeholder="O'qituvchini tanlang" /></SelectTrigger>
                                        <SelectContent>
                                            {teachers.map(t => (
                                                <SelectItem key={t.id} value={t.id.toString()}>{t.full_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sertifikat</label>
                                    <div className="flex items-center gap-2 h-10 px-3 border border-input rounded-md">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_certificate_enabled}
                                            onChange={(e) => setFormData({ ...formData, is_certificate_enabled: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">Yoqish</span>
                                    </div>
                                </div>
                            </div>

                            {formData.is_certificate_enabled && (
                                <div className="space-y-2 animate-in fade-in duration-300">
                                    <label className="text-sm font-medium">Sertifikat Templati</label>
                                    <Input
                                        placeholder="Masalan: modern_gold"
                                        value={formData.certificate_template}
                                        onChange={(e) => setFormData({ ...formData, certificate_template: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('admin.shortDesc')}</label>
                                <Textarea
                                    placeholder={t('admin.courseDescriptionPlaceholder')}
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </section>

                        <section className="space-y-4 pt-4 border-t border-border">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" /> {t('admin.monetizationBonus')}
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('admin.price')}</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.price === 0 ? "" : formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value === "" ? 0 : Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('admin.xpReward')}</label>
                                    <Input
                                        type="number"
                                        value={formData.xp_reward}
                                        onChange={(e) => setFormData({ ...formData, xp_reward: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                            <Layers className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm">{t('admin.curriculum')}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {t('admin.curriculumDesc')}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {modules.length === 0 ? (
                                <div className="p-8 border-2 border-dashed border-muted rounded-2xl text-center space-y-4">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                        <Settings className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{t('admin.lessonsMgmt')}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {t('admin.lessonsMgmtDesc')}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleAddModule}>
                                        <Plus className="w-4 h-4 mr-2" /> {t('admin.addModule')}
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-2">
                                        {modules.map((m) => (
                                            <div key={m.id} className="p-4 bg-muted/50 border border-border rounded-xl flex items-center justify-between group hover:bg-muted transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
                                                        {m.order}
                                                    </div>
                                                    <span className="font-medium">{m.title}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                                                    onClick={() => m.id && handleDeleteModule(m.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full border-dashed" onClick={handleAddModule}>
                                        <Plus className="w-4 h-4 mr-2" /> {t('admin.addModule')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl space-y-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-green-500/20">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-black text-xl">{t('admin.ready')}</h3>
                                <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold mt-1">{t('admin.review')}</p>
                            </div>

                            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">{t('admin.courses')}:</span>
                                    <span className="font-bold">{formData.title}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">{t('admin.price')}:</span>
                                    <span className="font-bold">{formData.price === 0 ? t('courseDetail.free') : `${formData.price.toLocaleString()} ${t('olympiadsSection.currency')}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">{t('admin.status')}:</span>
                                    <Badge variant={formData.is_active ? "default" : "outline"}>
                                        {formData.is_active ? t('admin.active') : t('admin.draft')}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="publish"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <label htmlFor="publish" className="text-sm font-medium">{t('admin.publishImmediately')}</label>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-green-500/10">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">{t('admin.submissionStatus') || "Yuborish holati"}</label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(val) => setFormData({ ...formData, status: val })}
                                    >
                                        <SelectTrigger size="sm" className="bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DRAFT">{t('admin.draft')}</SelectItem>
                                            <SelectItem value="PENDING">{t('admin.submitForApproval') || "Tasdiqlashga yuborish"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">
                                    {t('admin.publishNote')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <SheetFooter className="mt-8 flex flex-row items-center gap-3">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            className="flex-1 h-12 rounded-xl"
                            onClick={() => setStep(step - 1)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> {t('admin.back')}
                        </Button>
                    )}
                    <Button
                        className="flex-[2] h-12 rounded-xl"
                        onClick={handleNext}
                        disabled={loading}
                    >
                        {loading ? t('admin.loading') : step === 3 ? t('admin.finish') : t('admin.next')}
                        {step < 3 && !loading && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default CourseWizard;
