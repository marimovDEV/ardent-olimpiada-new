import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Trophy,
    ArrowLeft,
    Search,
    Filter,
    Edit,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    ChevronRight,
    MessageSquare,
    Save
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const TeacherOlympiadResultsPage = () => {
    const { id } = useParams();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedResult, setSelectedResult] = useState<any>(null);
    const [gradingScore, setGradingScore] = useState<string>("");
    const [gradingComment, setGradingComment] = useState("");
    const [isGrading, setIsGrading] = useState(false);

    useEffect(() => {
        fetchResults();
    }, [id]);

    const fetchResults = async () => {
        try {
            const res = await axios.get(`${API_URL}/olympiads/${id}/submissions/`, { headers: getAuthHeader() });
            setResults(res.data.results || []);
        } catch (error) {
            console.error(error);
            toast.error("Natijalarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async () => {
        if (!selectedResult || !gradingScore) return;

        setIsGrading(true);
        try {
            await axios.post(
                `${API_URL}/olympiads/${id}/grade_result/`,
                {
                    user_id: selectedResult.user_id,
                    score: parseInt(gradingScore),
                    comment: gradingComment
                },
                { headers: getAuthHeader() }
            );
            toast.success("Natija yangilandi");
            setSelectedResult(null);
            fetchResults();
        } catch (error) {
            console.error(error);
            toast.error("Xatolik yuz berdi");
        } finally {
            setIsGrading(false);
        }
    };

    const filteredResults = results.filter(r =>
        r.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.region && r.region.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/teacher/olympiads">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Natijalarni Tekshirish</h1>
                    <p className="text-muted-foreground">Ishtirokchilar tomonidan topshirilgan ishlar</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Ishtirokchi yoki viloyat bo'yicha qidirish..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        Jami: {filteredResults.length} ta natija
                    </span>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-12">Yuklanmoqda...</div>
                    ) : filteredResults.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground font-medium">
                            Hech qanday natija topilmadi
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ishtirokchi</TableHead>
                                    <TableHead>Viloyat</TableHead>
                                    <TableHead>Ball</TableHead>
                                    <TableHead>Vaqt</TableHead>
                                    <TableHead>Holat</TableHead>
                                    <TableHead className="text-right">Amallar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredResults.map((res) => (
                                    <TableRow key={res.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {res.student.charAt(0)}
                                                </div>
                                                <span className="font-medium">{res.student}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{res.region || "Noma'lum"}</TableCell>
                                        <TableCell>
                                            <span className="font-bold text-lg">{res.score}</span>
                                            <span className="text-xs text-muted-foreground ml-1">({res.percentage}%)</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatTime(res.time_taken)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${res.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    res.status === 'DISQUALIFIED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {res.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => {
                                                        setSelectedResult(res);
                                                        setGradingScore(res.score.toString());
                                                        setGradingComment("");
                                                    }}>
                                                        <Edit className="w-4 h-4" />
                                                        Baholash
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Baholash: {res.student}</DialogTitle>
                                                        <DialogDescription>
                                                            Ushbu ishtirokchi uchun yakuniy ballni belgilang.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="score" className="text-right font-bold">Ball</Label>
                                                            <Input
                                                                id="score"
                                                                type="number"
                                                                className="col-span-3"
                                                                value={gradingScore}
                                                                onChange={(e) => setGradingScore(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="comment" className="text-right font-bold">Izoh</Label>
                                                            <Input
                                                                id="comment"
                                                                placeholder="Ixtiyoriy izoh..."
                                                                className="col-span-3"
                                                                value={gradingComment}
                                                                onChange={(e) => setGradingComment(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setSelectedResult(null)}>Bekor qilish</Button>
                                                        <Button onClick={handleGrade} disabled={isGrading}>
                                                            <Save className="w-4 h-4 mr-2" />
                                                            Saqlash
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherOlympiadResultsPage;
