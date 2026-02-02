
import { useState, useEffect, useCallback } from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, MoreHorizontal, Plus, Trophy, Calendar, Clock, Edit, Trash2, Users, AlertTriangle, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";

// API Data Types
interface Olympiad {
    id: number;
    title: string;
    description: string;
    subject: "Matematika" | "Fizika" | "Informatika" | "Ingliz tili" | "Mantiq";
    level: "Beginner" | "Olympiad" | "Pro";
    start_date: string;
    end_date: string;
    time_limit: number;
    price: number;
    status: "DRAFT" | "UPCOMING" | "ONGOING" | "CHECKING" | "PUBLISHED" | "COMPLETED" | "CANCELED";
    is_active: boolean;
    questions_count: number;
    participants_count?: number;
    submissions_count?: number;
}

interface Stats {
    total_registrations: number;
    total_submissions: number;
    total_paid: number;
    total_disqualified: number;
    avg_score: number;
    max_score: number;
}

const AdminOlympiadsPage = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subjectFilter, setSubjectFilter] = useState("all");

    // UI States
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [statusDialog, setStatusDialog] = useState<{ id: number; status: string } | null>(null);

    useEffect(() => {
        fetchOlympiads();
    }, [fetchOlympiads]);

    const fetchOlympiads = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/olympiads/`, { headers: getAuthHeader() });
            setOlympiads(res.data.results || res.data);
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: t('admin.olympiads.loadError'), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [t, toast]);

    const handlePublishResults = async (id: number) => {
        try {
            const res = await axios.post(`${API_URL}/olympiads/${id}/publish_results/`, {}, { headers: getAuthHeader() });
            if (res.data.success) {
                toast({ title: t('common.success'), description: res.data.message });
                fetchOlympiads();
            }
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: t('admin.olympiads.publishError'), variant: "destructive" });
        }
    };

    const handleForceStart = async (id: number) => {
        try {
            const res = await axios.post(`${API_URL}/olympiads/${id}/force_start/`, {}, { headers: getAuthHeader() });
            if (res.data.success) {
                toast({ title: t('common.success'), description: "Olimpiada muvaffaqiyatli boshlandi!" });
                fetchOlympiads();
            }
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: "Olimpiadani boshlashda xatolik", variant: "destructive" });
        }
    };

    // FILTER LOGIC
    const filteredOlympiads = olympiads.filter(oly => {
        const matchesSearch = oly.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || oly.status === statusFilter;
        const matchesSubject = subjectFilter === "all" || oly.subject === subjectFilter;
        return matchesSearch && matchesStatus && matchesSubject;
    });

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${API_URL}/olympiads/${deleteId}/`, { headers: getAuthHeader() });
            setOlympiads(olympiads.filter(c => c.id !== deleteId));
            toast({ title: t('common.deleted'), description: t('admin.olympiads.deleteSuccess'), variant: "destructive" });
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: t('admin.olympiads.deleteError'), variant: "destructive" });
        }
    };

    const handleSaveStatus = async () => {
        if (!statusDialog) return;
        try {
            await axios.patch(`${API_URL}/olympiads/${statusDialog.id}/`, { status: statusDialog.status }, { headers: getAuthHeader() });

            // Update local state
            setOlympiads(olympiads.map(o => o.id === statusDialog.id ? { ...o, status: statusDialog.status as "DRAFT" | "UPCOMING" | "ONGOING" | "CHECKING" | "PUBLISHED" | "COMPLETED" | "CANCELED" } : o));

            toast({ title: t('common.success'), description: "Status muvaffaqiyatli o'zgartirildi" });
            setStatusDialog(null);
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: "Statusni o'zgartirishda xatolik", variant: "destructive" });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ONGOING': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 animate-pulse dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">{t('admin.active')} (Live)</Badge>;
            case 'UPCOMING': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">{t('admin.upcoming')}</Badge>;
            case 'PUBLISHED': return <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">{t('admin.published')}</Badge>;
            case 'CHECKING': return <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">{t('admin.checking')}</Badge>;
            case 'COMPLETED': return <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/10 dark:text-gray-400">{t('admin.completed')}</Badge>;
            case 'DRAFT': return <Badge variant="outline" className="border-dashed">{t('admin.draft')}</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatMoney = (amount: number) => {
        if (amount === 0) return t('common.free');
        return `${(amount / 1000).toFixed(0)}k ${t('common.uzs')}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground">{t('admin.olympiadsManagement')}</h1>
                    <p className="text-muted-foreground">{t('admin.olympiadsManagementSubtitle')}</p>
                </div>

                <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    onClick={() => navigate("/admin/olympiads/new")}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('admin.newOlympiad')}
                </Button>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                    <div className="text-muted-foreground text-xs font-bold uppercase mb-1">{t('admin.totalParticipants')}</div>
                    <div className="text-2xl font-black text-foreground">
                        {olympiads.reduce((acc, curr) => acc + (curr.participants_count || 0), 0)}
                    </div>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                    <div className="text-muted-foreground text-xs font-bold uppercase mb-1">{t('admin.subjectsCount')}</div>
                    <div className="text-2xl font-black text-foreground">
                        {new Set(olympiads.map(o => o.subject)).size}
                    </div>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                    <div className="text-muted-foreground text-xs font-bold uppercase mb-1">{t('admin.activeOlympiads')}</div>
                    <div className="text-2xl font-black text-green-500">
                        {olympiads.filter(o => o.status === 'ONGOING').length}
                    </div>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                    <div className="text-muted-foreground text-xs font-bold uppercase mb-1">{t('admin.upcoming')}</div>
                    <div className="text-2xl font-black text-blue-500">
                        {olympiads.filter(o => o.status === 'UPCOMING').length}
                    </div>
                </div>
            </div>

            {/* FILTERS TOOLBAR */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={t('admin.olympiadSearchPlaceholder')}
                        className="pl-9 bg-background border-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-1 md:pb-0">
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger className="w-[140px] bg-background border-input">
                            <SelectValue placeholder={t('admin.subject')} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                            <SelectItem value="all">{t('admin.allSubjects')}</SelectItem>
                            <SelectItem value="Matematika">{t('admin.math')}</SelectItem>
                            <SelectItem value="Fizika">{t('admin.physics')}</SelectItem>
                            <SelectItem value="Informatika">{t('admin.it')}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
                        <TabsList className="bg-muted">
                            <TabsTrigger value="all" className="text-xs">{t('admin.all')}</TabsTrigger>
                            <TabsTrigger value="ONGOING" className="text-xs">{t('admin.active')}</TabsTrigger>
                            <TabsTrigger value="UPCOMING" className="text-xs">{t('admin.upcoming')}</TabsTrigger>
                            <TabsTrigger value="COMPLETED" className="text-xs">{t('admin.past')}</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* OLYMPIADS TABLE */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-border">
                            <TableHead className="w-[80px]">{t('common.id')}</TableHead>
                            <TableHead>{t('admin.olympiad')}</TableHead>
                            <TableHead>{t('admin.time')}</TableHead>
                            <TableHead>{t('admin.levelAndPrice')}</TableHead>
                            <TableHead className="w-[200px]">{t('admin.status')}</TableHead>
                            <TableHead className="text-right">{t('admin.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOlympiads.map((oly) => (
                            <TableRow key={oly.id} className="hover:bg-muted/50 border-b border-border group">
                                <TableCell className="font-mono text-xs text-muted-foreground">{oly.id}</TableCell>
                                <TableCell>
                                    <div className="font-bold text-foreground flex items-center gap-2">
                                        <Trophy className={`w-4 h-4 ${oly.subject === 'Matematika' ? 'text-blue-500' : 'text-purple-500'}`} />
                                        {oly.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {oly.subject} • {oly.questions_count || 0} {t('admin.questions')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="font-medium text-foreground flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            {new Date(oly.start_date).toLocaleDateString()}
                                        </span>
                                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                            {new Date(oly.start_date).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded w-fit ${oly.level === 'Olympiad' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' :
                                            oly.level === 'Pro' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                                                'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {oly.level}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {formatMoney(oly.price)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(oly.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-popover border-border">
                                            <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-border" />
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/admin/olympiads/${oly.id}/edit`)}>
                                                <Edit className="w-4 h-4 mr-2" /> {t('common.edit')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/admin/olympiads/${oly.id}/participants`)}>
                                                <Users className="w-4 h-4 mr-2" /> {t('admin.participants')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/admin/olympiads/${oly.id}/results`)}>
                                                <Trophy className="w-4 h-4 mr-2" /> {t('admin.resultsAndAnalytics')}
                                            </DropdownMenuItem>

                                            {['DRAFT', 'UPCOMING', 'PAUSED'].includes(oly.status) && (
                                                <DropdownMenuItem className="cursor-pointer text-green-600 font-bold" onClick={() => handleForceStart(oly.id)}>
                                                    <span className="w-4 h-4 mr-2 flex items-center justify-center bg-green-600 rounded-full text-white text-[10px]">▶</span> Olimpiadani Boshlash
                                                </DropdownMenuItem>
                                            )}

                                            {oly.status === 'CHECKING' && (
                                                <DropdownMenuItem className="cursor-pointer text-purple-600 font-bold" onClick={() => handlePublishResults(oly.id)}>
                                                    <span className="w-4 h-4 mr-2 flex items-center justify-center bg-purple-600 rounded-full text-white text-[10px]">✓</span> {t('admin.publishResults')}
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuSeparator className="bg-border" />

                                            <DropdownMenuItem className="cursor-pointer" onClick={() => setStatusDialog({ id: oly.id, status: oly.status })}>
                                                <Activity className="w-4 h-4 mr-2" /> Statusni o'zgartirish
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="bg-border" />

                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20"
                                                onClick={() => setDeleteId(oly.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> {t('common.delete')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {!loading && filteredOlympiads.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">{t('admin.noOlympiadsFound')}</h3>
                        <p className="text-muted-foreground mb-6">{t('admin.noOlympiadsFoundSubtitle')}</p>
                        <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setSubjectFilter("all") }}>
                            {t('admin.clearFilters')}
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            {t('admin.deleteOlympiadConfirm')}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {t('admin.deleteConfirmText', { title: olympiads.find(c => c.id === deleteId)?.title })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>{t('common.cancel')}</Button>
                        <Button variant="destructive" onClick={handleDelete}>{t('common.delete')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Status Change Dialog */}
            <Dialog open={!!statusDialog} onOpenChange={(open) => !open && setStatusDialog(null)}>
                <DialogContent className="bg-card border-border sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Statusni o'zgartirish</DialogTitle>
                        <DialogDescription>
                            Olimpiada holatini o'zgartiring. Bu foydalanuvchilar va tizim logikasiga ta'sir qiladi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Select
                                value={statusDialog?.status}
                                onValueChange={(val) => setStatusDialog(prev => prev ? ({ ...prev, status: val }) : null)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Statusni tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">DRAFT (Qoralama)</SelectItem>
                                    <SelectItem value="UPCOMING">UPCOMING (Kutilmoqda - Sana bo'yicha)</SelectItem>
                                    <SelectItem value="ONGOING">ONGOING (Jarayonda - Aktiv)</SelectItem>
                                    <SelectItem value="PAUSED">PAUSED (Vaqtinchalik to'xtatilgan)</SelectItem>
                                    <SelectItem value="CHECKING">CHECKING (Tekshirilmoqda - Natijalar yopiq)</SelectItem>
                                    <SelectItem value="PUBLISHED">PUBLISHED (Natijalar e'lon qilingan)</SelectItem>
                                    <SelectItem value="COMPLETED">COMPLETED (Arxiv)</SelectItem>
                                    <SelectItem value="CANCELED">CANCELED (Bekor qilingan)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusDialog(null)}>Bekor qilish</Button>
                        <Button onClick={handleSaveStatus}>Saqlash</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default AdminOlympiadsPage;
