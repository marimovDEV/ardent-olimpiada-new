import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    GripVertical,
    Video,
    FileText,
    CheckSquare,
    Edit2,
    Trash2,
    ChevronDown,
    ChevronUp,
    Play,
    Puzzle,
    Clock,
    X,
    Save,
    MoreVertical
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";

interface Lesson {
    id: number;
    title: string;
    description: string;
    video_url: string;
    pdf_url: string;
    order: number;
    is_free: boolean;
    video_duration: number;
}

interface Module {
    id: number;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface CourseContentManagerProps {
    courseId: number;
    onClose: () => void;
}

const CourseContentManager = ({ courseId, onClose }: CourseContentManagerProps) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);

    // UI for adding/editing
    const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
    const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
    const [currentModule, setCurrentModule] = useState<Partial<Module> | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Partial<Lesson> | null>(null);
    const [targetModuleId, setTargetModuleId] = useState<number | null>(null);

    useEffect(() => {
        fetchContent();
    }, [courseId]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/courses/${courseId}/learning_state/`, { headers: getAuthHeader() });
            setModules(res.data.modules || res.data);
            // Expand first module by default
            if (res.data.length > 0) {
                setExpandedModules([res.data[0].id]);
            }
        } catch (error) {
            toast({ title: "Xatolik", description: "O'quv rejasini yuklashda xatolik", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (id: number) => {
        setExpandedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleSaveModule = async () => {
        try {
            if (currentModule?.id) {
                await axios.put(`${API_URL}/modules/${currentModule.id}/`, currentModule, { headers: getAuthHeader() });
                toast({ title: "Muvaffaqiyatli", description: "Modul yangilandi" });
            } else {
                await axios.post(`${API_URL}/modules/`, { ...currentModule, course: courseId, order: modules.length + 1 }, { headers: getAuthHeader() });
                toast({ title: "Muvaffaqiyatli", description: "Modul yaratildi" });
            }
            setIsModuleDialogOpen(false);
            fetchContent();
        } catch (error) {
            toast({ title: "Xatolik", description: "Modulni saqlashda xatolik", variant: "destructive" });
        }
    };

    const handleDeleteModule = async (id: number) => {
        if (!confirm("Ushbu modul va uning barcha darslari o'chib ketadi. Ishonchingiz komilmi?")) return;
        try {
            await axios.delete(`${API_URL}/modules/${id}/`, { headers: getAuthHeader() });
            fetchContent();
            toast({ title: "O'chirildi", description: "Modul o'chirildi" });
        } catch (error) {
            toast({ title: "Xatolik", description: "O'chirishda xatolik" });
        }
    };

    const handleSaveLesson = async () => {
        try {
            if (currentLesson?.id) {
                await axios.put(`${API_URL}/lessons/${currentLesson.id}/`, currentLesson, { headers: getAuthHeader() });
                toast({ title: "Muvaffaqiyatli", description: "Dars yangilandi" });
            } else {
                await axios.post(`${API_URL}/lessons/`, {
                    ...currentLesson,
                    course: courseId,
                    module: targetModuleId,
                    order: (modules.find(m => m.id === targetModuleId)?.lessons.length || 0) + 1
                }, { headers: getAuthHeader() });
                toast({ title: "Muvaffaqiyatli", description: "Dars yaratildi" });
            }
            setIsLessonDialogOpen(false);
            fetchContent();
        } catch (error) {
            toast({ title: "Xatolik", description: "Darsni saqlashda xatolik", variant: "destructive" });
        }
    };

    const handleDeleteLesson = async (id: number) => {
        if (!confirm("Darsni o'chirasizmi?")) return;
        try {
            await axios.delete(`${API_URL}/lessons/${id}/`, { headers: getAuthHeader() });
            fetchContent();
            toast({ title: "O'chirildi", description: "Dars o'chirildi" });
        } catch (error) {
            toast({ title: "Xatolik", description: "O'chirishda xatolik" });
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-5xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center bg-card p-6 rounded-[2rem] border border-border shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">O'quv rejasi boshqaruvi</h2>
                        <p className="text-muted-foreground text-sm">Modullar va darslarni boshqarish</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-2xl h-12 px-6" onClick={() => { setCurrentModule({ title: "" }); setIsModuleDialogOpen(true); }}>
                            <Plus className="w-5 h-5 mr-2 text-primary" />
                            Modul qo'shish
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 border border-border" onClick={onClose}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Modules List */}
                <div className="space-y-6">
                    {modules.map((module, idx) => (
                        <div key={module.id} className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden group">
                            {/* Module Header */}
                            <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => toggleModule(module.id)}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black shadow-inner">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">{module.title}</h3>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{module.lessons.length} ta dars</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                                                <MoreVertical className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl border-border p-2">
                                            <DropdownMenuItem className="rounded-xl h-10 gap-3" onClick={() => { setCurrentModule(module); setIsModuleDialogOpen(true); }}>
                                                <Edit2 className="w-4 h-4 text-primary" /> Tahrirlash
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl h-10 gap-3 text-destructive" onClick={() => handleDeleteModule(module.id)}>
                                                <Trash2 className="w-4 h-4" /> O'chirish
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center">
                                        {expandedModules.includes(module.id) ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                    </div>
                                </div>
                            </div>

                            {/* Lessons List (Expanded) */}
                            {expandedModules.includes(module.id) && (
                                <div className="px-6 pb-6 pt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {module.lessons.map((lesson, lIdx) => (
                                        <div key={lesson.id} className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all group/lesson">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                                    {lesson.is_free ? <Play className="w-4 h-4 text-green-500 fill-green-500" /> : <Video className="w-4 h-4 text-primary" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-foreground">{lesson.title}</span>
                                                        {lesson.is_free && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none scale-75">Demo</Badge>}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {(lesson.video_duration / 60).toFixed(0)} MIN</span>
                                                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {lesson.pdf_url ? "Resurs bor" : "Resurs yo'q"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 text-primary" onClick={() => { setCurrentLesson(lesson); setTargetModuleId(module.id); setIsLessonDialogOpen(true); }}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 text-destructive" onClick={() => handleDeleteLesson(lesson.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 hover:bg-primary/5 hover:border-primary/30 transition-all font-bold group" onClick={() => { setCurrentLesson({ title: "", is_free: false, video_duration: 600 }); setTargetModuleId(module.id); setIsLessonDialogOpen(true); }}>
                                        <Plus className="w-5 h-5 mr-3 text-primary group-hover:scale-125 transition-transform" />
                                        Dars qo'shish
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {modules.length === 0 && !loading && (
                        <div className="text-center py-20 bg-card rounded-[3rem] border border-dashed border-border">
                            <Puzzle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-foreground">Hozircha hech narsa yo'q</h3>
                            <p className="text-muted-foreground font-medium mb-8">Modul qo'shishdan boshlang</p>
                            <Button className="h-14 px-8 rounded-2xl font-black shadow-xl shadow-primary/20" onClick={() => { setCurrentModule({ title: "" }); setIsModuleDialogOpen(true); }}>
                                <Plus className="w-5 h-5 mr-3" />
                                Birinchi modulni qo'shing
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Module Dialog */}
            <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] bg-card border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">{currentModule?.id ? "Modulni tahrirlash" : "Yangi modul"}</DialogTitle>
                        <DialogDescription>Modul nomini kiriting. Modul darslarni guruhlash uchun ishlatiladi.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Sarlavha</label>
                            <Input
                                placeholder="Masalan: Kirish"
                                value={currentModule?.title || ""}
                                onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                                className="h-14 rounded-2xl bg-background border-none shadow-inner text-lg font-bold"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-12 rounded-2xl font-bold flex-1" onClick={() => setIsModuleDialogOpen(false)}>Bekor qilish</Button>
                        <Button className="h-12 rounded-2xl font-black flex-1 shadow-lg shadow-primary/20" onClick={handleSaveModule}>
                            <Save className="w-4 h-4 mr-2" /> Saqlash
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Lesson Dialog */}
            <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                <DialogContent className="sm:max-w-[700px] rounded-[3rem] bg-card border-none shadow-2xl overflow-hidden p-0">
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black">{currentLesson?.id ? "Darsni tahrirlash" : "Yangi dars"}</DialogTitle>
                            <DialogDescription className="text-base font-medium">Barcha dars ma'lumotlarini to'ldiring. Video va materiallar juda muhim.</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-8 py-2">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">Sarlavha</label>
                                    <Input
                                        placeholder="Dars nomi"
                                        value={currentLesson?.title || ""}
                                        onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                                        className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-bold text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">Tavsif</label>
                                    <Textarea
                                        placeholder="Dars haqida qisqacha..."
                                        rows={4}
                                        value={currentLesson?.description || ""}
                                        onChange={(e) => setCurrentLesson({ ...currentLesson, description: e.target.value })}
                                        className="rounded-[1.25rem] bg-background border-none shadow-inner font-medium resize-none p-4"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">Video URL (YouTube/Direct)</label>
                                    <Input
                                        placeholder="https://..."
                                        value={currentLesson?.video_url || ""}
                                        onChange={(e) => setCurrentLesson({ ...currentLesson, video_url: e.target.value })}
                                        className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-mono text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">Davomiyligi (sekund)</label>
                                        <Input
                                            type="number"
                                            value={currentLesson?.video_duration || 0}
                                            onChange={(e) => setCurrentLesson({ ...currentLesson, video_duration: parseInt(e.target.value) })}
                                            className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">Bepul dars?</label>
                                        <div className="flex items-center gap-3 h-14 px-4 bg-background rounded-[1.25rem] shadow-inner">
                                            <input
                                                type="checkbox"
                                                checked={currentLesson?.is_free || false}
                                                onChange={(e) => setCurrentLesson({ ...currentLesson, is_free: e.target.checked })}
                                                className="w-5 h-5 rounded-lg border-muted"
                                            />
                                            <span className="font-bold text-foreground">Demo</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">PDF Resurs URL</label>
                                    <Input
                                        placeholder="https://..."
                                        value={currentLesson?.pdf_url || ""}
                                        onChange={(e) => setCurrentLesson({ ...currentLesson, pdf_url: e.target.value })}
                                        className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/50 p-8 flex gap-4">
                        <Button variant="ghost" className="h-14 flex-1 rounded-2xl font-bold" onClick={() => setIsLessonDialogOpen(false)}>Bekor qilish</Button>
                        <Button className="h-14 flex-[2] rounded-2xl font-black shadow-xl shadow-primary/20" onClick={handleSaveLesson}>
                            <Save className="w-5 h-5 mr-3" /> Darsni saqlash
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseContentManager;
