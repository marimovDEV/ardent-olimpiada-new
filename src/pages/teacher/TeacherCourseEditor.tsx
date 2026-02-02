import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    ArrowLeft,
    Save,
    Plus,
    GripVertical,
    Edit,
    Trash2,
    Video,
    FileText,
    Target,
    Award,
    ChevronDown,
    Layout,
    Settings,
    MoreVertical,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import api from "@/services/api";

const TeacherCourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("curriculum");

    // Fetch Course Detailed Data (Modules + Lessons)
    const { data: course, isLoading } = useQuery({
        queryKey: ['teacher-course', id],
        queryFn: async () => {
            const res = await api.get(`/teacher/courses/${id}/`);
            return res.data;
        },
        enabled: !!id
    });

    if (isLoading) return <div className="p-10 text-center">Yuklanmoqda...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/teacher/courses">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{course?.title}</h1>
                        <p className="text-muted-foreground">Kurs tarkibini tahrirlash</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        Ko'rish
                    </Button>
                    <Button className="gap-2">
                        <Save className="w-4 h-4" /> Saqlash
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-card border border-border h-auto p-1 gap-1">
                    <TabsTrigger value="general" className="gap-2 px-6 py-2.5">
                        <Layout className="w-4 h-4" /> Umumiy
                    </TabsTrigger>
                    <TabsTrigger value="curriculum" className="gap-2 px-6 py-2.5">
                        <BookOpen className="w-4 h-4" /> Kurikulum
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2 px-6 py-2.5">
                        <Settings className="w-4 h-4" /> Sozlamalar
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Asosiy ma'lumotlar</CardTitle>
                                <CardDescription>Kurs nomi, tavsifi va darajasi</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Kurs nomi</label>
                                        <Input defaultValue={course?.title} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Fan</label>
                                        <Input defaultValue={course?.subject} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tavsif</label>
                                    <Textarea defaultValue={course?.description} rows={5} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="curriculum">
                        <CurriculumManager courseId={id!} modules={course?.modules || []} />
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kurs sozlamalari</CardTitle>
                                <CardDescription>Narx, status va boshqalar</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">Sozlamalar paneli yaqin orada qo'shiladi...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

// --- Curriculum Manager Component ---
const CurriculumManager = ({ courseId, modules }: { courseId: string, modules: any[] }) => {
    const queryClient = useQueryClient();
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    const [lessonModal, setLessonModal] = useState<{ open: boolean, moduleId: number | null, lesson: any | null }>({
        open: false,
        moduleId: null,
        lesson: null
    });

    const addModuleMutation = useMutation({
        mutationFn: (title: string) => api.post(`/modules/`, { course: courseId, title, order: modules.length + 1 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-course', courseId] });
            setIsAddModuleOpen(false);
            setNewModuleTitle("");
            toast.success("Modul qo'shildi");
        }
    });

    const deleteModuleMutation = useMutation({
        mutationFn: (moduleId: number) => api.delete(`/modules/${moduleId}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-course', courseId] });
            toast.success("Modul o'chirildi");
        }
    });

    const saveLessonMutation = useMutation({
        mutationFn: (data: any) => {
            if (data.id) return api.put(`/lessons/${data.id}/`, data);
            return api.post(`/lessons/`, { ...data, course: courseId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-course', courseId] });
            setLessonModal({ open: false, moduleId: null, lesson: null });
            toast.success("Dars saqlandi");
        }
    });

    const deleteLessonMutation = useMutation({
        mutationFn: (lessonId: number) => api.delete(`/lessons/${lessonId}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-course', courseId] });
            toast.success("Dars o'chirildi");
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
                <h3 className="font-bold flex items-center gap-2">
                    <Layout className="w-5 h-5 text-primary" /> Modullar ({modules.length})
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        Reorder
                    </Button>
                    <Button size="sm" className="gap-2" onClick={() => setIsAddModuleOpen(true)}>
                        <Plus className="w-4 h-4" /> Modul qo'shish
                    </Button>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={modules.map(m => `module-${m.id}`)} className="space-y-4">
                {modules.map((module, idx) => (
                    <AccordionItem key={module.id} value={`module-${module.id}`} className="border border-border rounded-xl bg-card overflow-hidden px-0">
                        <div className="flex items-center justify-between pr-4 bg-muted/10">
                            <AccordionTrigger className="hover:no-underline px-6 py-4 flex-1">
                                <div className="flex items-center gap-3 w-full text-left">
                                    <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 cursor-grab" />
                                    <span className="font-bold text-base">{idx + 1}. {module.title}</span>
                                    <span className="text-xs text-muted-foreground ml-2">({module.lessons?.length || 0} darslar)</span>
                                </div>
                            </AccordionTrigger>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); /* Edit module */ }}>
                                    <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); deleteModuleMutation.mutate(module.id); }}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                        <AccordionContent className="px-6 py-4 space-y-3">
                            <div className="space-y-2">
                                {module.lessons?.map((lesson: any, lIdx: number) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background hover:border-primary/50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                                {lIdx + 1}
                                            </div>
                                            <span className="text-sm font-medium">{lesson.title}</span>
                                            <div className="flex items-center gap-1 ml-4">
                                                {lesson.video_url && <Video className="w-3.5 h-3.5 text-blue-500" />}
                                                {lesson.pdf_url && <FileText className="w-3.5 h-3.5 text-red-500" />}
                                                {lesson.practice && <Target className="w-3.5 h-3.5 text-orange-500" />}
                                                {lesson.test && <Award className="w-3.5 h-3.5 text-green-500" />}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLessonModal({ open: true, moduleId: module.id, lesson })}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteLessonMutation.mutate(lesson.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2 border-dashed gap-2"
                                onClick={() => setLessonModal({ open: true, moduleId: module.id, lesson: null })}
                            >
                                <Plus className="w-4 h-4" /> Dars qo'shish
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* Module Add/Edit Dialog */}
            <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Yangi modul</DialogTitle>
                        <DialogDescription>Masalan: "Algebra asoslari" yoki "1-bo'lim"</DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <Input
                            placeholder="Modul nomi"
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            className="h-12"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModuleOpen(false)}>Bekor qilish</Button>
                        <Button onClick={() => addModuleMutation.mutate(newModuleTitle)} disabled={!newModuleTitle}>Modulni yaratish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Lesson Edit Modal */}
            <LessonModal
                open={lessonModal.open}
                onClose={() => setLessonModal({ open: false, moduleId: null, lesson: null })}
                moduleId={lessonModal.moduleId}
                lesson={lessonModal.lesson}
                onSave={(data) => saveLessonMutation.mutate({ ...data, module: lessonModal.moduleId })}
                isSaving={saveLessonMutation.isPending}
            />
        </div>
    );
};

// --- Lesson Modal Component ---
const LessonModal = ({ open, onClose, moduleId, lesson, onSave, isSaving }: any) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        video_url: "",
        video_type: "YOUTUBE",
        video_duration: 0,
        pdf_url: "",
        is_free: false,
        order: 0
    });

    const [practiceEditor, setPracticeEditor] = useState<{ open: boolean, data: any }>({ open: false, data: null });
    const [testEditor, setTestEditor] = useState<{ open: boolean, data: any }>({ open: false, data: null });

    const savePracticeMutation = useMutation({
        mutationFn: (data: any) => {
            if (data.id) return api.put(`/lesson-practices/${data.id}/`, data);
            return api.post(`/lesson-practices/`, { ...data, lesson: lesson.id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-course'] }); // Broad invalidate for now
            setPracticeEditor({ open: false, data: null });
            toast.success("Amaliyat saqlandi");
        }
    });

    const saveTestMutation = useMutation({
        mutationFn: (data: any) => {
            if (data.id) return api.put(`/lesson-tests/${data.id}/`, data);
            return api.post(`/lesson-tests/`, { ...data, lesson: lesson.id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher-course'] });
            setTestEditor({ open: false, data: null });
            toast.success("Test saqlandi");
        }
    });

    useEffect(() => {
        if (lesson) setFormData(lesson);
        else setFormData({ title: "", description: "", video_url: "", video_type: "YOUTUBE", video_duration: 0, pdf_url: "", is_free: false, order: 0 });
    }, [lesson, open]);

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>{lesson ? "Darsni tahrirlash" : "Yangi dars"}</SheetTitle>
                    <SheetDescription>Dars ma'lumotlarini to'ldiring</SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    <Tabs defaultValue="basics">
                        <TabsList className="bg-muted w-full justify-start p-1 h-auto mb-6">
                            <TabsTrigger value="basics" className="px-6 py-2">Asosiy</TabsTrigger>
                            <TabsTrigger value="content" className="px-6 py-2">Video & PDF</TabsTrigger>
                            <TabsTrigger value="extra" className="px-6 py-2">Amaliyot & Test</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basics" className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Dars nomi</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Masalan: Ratsional sonlar"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Tavsif</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Dars haqida qisqacha..."
                                    rows={4}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_free"
                                    checked={formData.is_free}
                                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <label htmlFor="is_free" className="text-sm font-medium">Be'pul dars (hamma uchun ochiq)</label>
                            </div>
                        </TabsContent>

                        <TabsContent value="content" className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Video URL (YouTube)</label>
                                <Input
                                    value={formData.video_url}
                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Davomiyligi (soniya)</label>
                                    <Input
                                        type="number"
                                        value={formData.video_duration}
                                        onChange={(e) => setFormData({ ...formData, video_duration: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">PDF material URL</label>
                                    <Input
                                        value={formData.pdf_url}
                                        onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="extra" className="space-y-6 pt-2">
                            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-orange-600">
                                    <Target className="w-4 h-4" /> Amaliy topshiriq
                                </h4>
                                <p className="text-xs text-muted-foreground">O'quvchi dars oxirida bajarishi kerak bo'lgan matnli topshiriq.</p>
                                {lesson?.practice ? (
                                    <div className="bg-white/50 p-3 rounded-lg border border-orange-200 text-sm">
                                        <div className="font-bold">{lesson.practice.type}: {lesson.practice.points} XP</div>
                                        <div className="truncate text-muted-foreground">{lesson.practice.problem_text}</div>
                                    </div>
                                ) : null}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full bg-white"
                                    onClick={() => setPracticeEditor({ open: true, data: lesson?.practice || { lesson: lesson?.id, type: 'TEXT', problem_text: '', correct_answer: '', points: 50 } })}
                                >
                                    {lesson?.practice ? "Tapsiriqni tahrirlash" : "Tapsiriq qo'shish"}
                                </Button>
                            </div>

                            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-green-600">
                                    <Award className="w-4 h-4" /> Yakuniy test
                                </h4>
                                <p className="text-xs text-muted-foreground">Bir nechta variantli savollardan iborat mini-test.</p>
                                {lesson?.test ? (
                                    <div className="bg-white/50 p-3 rounded-lg border border-green-200 text-sm">
                                        <div className="font-bold">{lesson.test.questions?.length || 0} savollar</div>
                                        <div className="text-muted-foreground">O'tish balli: {lesson.test.min_pass_score}%</div>
                                    </div>
                                ) : null}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full bg-white"
                                    onClick={() => setTestEditor({ open: true, data: lesson?.test || { lesson: lesson?.id, min_pass_score: 70, max_attempts: 3, questions: [] } })}
                                >
                                    {lesson?.test ? "Testni tahrirlash" : "Test qo'shish"}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex gap-3">
                    <Button className="flex-1 h-12 rounded-xl" onClick={() => onSave(formData)} disabled={isSaving}>
                        {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                    </Button>
                    <Button variant="outline" className="h-12 rounded-xl" onClick={onClose}>Bekor qilish</Button>
                </div>

                <PracticeEditor
                    open={practiceEditor.open}
                    onClose={() => setPracticeEditor({ ...practiceEditor, open: false })}
                    data={practiceEditor.data}
                    onSave={(data: any) => savePracticeMutation.mutate(data)}
                    isSaving={savePracticeMutation.isPending}
                />

                <TestEditor
                    open={testEditor.open}
                    onClose={() => setTestEditor({ ...testEditor, open: false })}
                    data={testEditor.data}
                    onSave={(data: any) => saveTestMutation.mutate(data)}
                    isSaving={saveTestMutation.isPending}
                />
            </SheetContent>
        </Sheet>
    );
};

// --- Practice Editor component ---
const PracticeEditor = ({ open, onClose, data, onSave, isSaving }: any) => {
    const [formData, setFormData] = useState<any>(data);
    useEffect(() => { setFormData(data); }, [data, open]);

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Amaliyatni sozlash</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Turi</label>
                            <Input value={formData?.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="TEXT, CODE, etc" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">XP (Ball)</label>
                            <Input type="number" value={formData?.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Topshiriq matni</label>
                        <Textarea
                            rows={5}
                            value={formData?.problem_text}
                            onChange={(e) => setFormData({ ...formData, problem_text: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">To'g'ri javob</label>
                        <Input value={formData?.correct_answer} onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
                    <Button onClick={() => onSave(formData)} disabled={isSaving}>Saqlash</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- Test Editor component ---
const TestEditor = ({ open, onClose, data, onSave, isSaving }: any) => {
    const [formData, setFormData] = useState<any>(data);
    useEffect(() => { setFormData(data); }, [data, open]);

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Dars testi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">O'tish balli (%)</label>
                            <Input type="number" value={formData?.min_pass_score} onChange={(e) => setFormData({ ...formData, min_pass_score: parseInt(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Urinishlar soni</label>
                            <Input type="number" value={formData?.max_attempts} onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) })} />
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <h4 className="font-bold mb-2">Savollar ({formData?.questions?.length || 0})</h4>
                        {/* Question list simplified for now */}
                        <p className="text-xs text-muted-foreground italic mb-4">Savollarni boshqarish interfeysi tez orada qo'shiladi...</p>
                        <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => toast.info("Savol qo'shish funksiyasi ustida ishlanmoqda")}>
                            <Plus className="w-3 h-3 mr-1" /> Savol qo'shish
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
                    <Button onClick={() => onSave(formData)} disabled={isSaving}>Testni saqlash</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default TeacherCourseEditor;
