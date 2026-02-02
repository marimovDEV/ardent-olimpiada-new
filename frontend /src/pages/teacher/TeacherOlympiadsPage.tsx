import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Plus, Calendar, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";

const TeacherOlympiadsPage = () => {
    const [olympiads, setOlympiads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOlympiads();
    }, []);

    const fetchOlympiads = async () => {
        try {
            const res = await axios.get(`${API_URL}/teacher/olympiads/`, { headers: getAuthHeader() });
            setOlympiads(res.data.results || []);
        } catch (error) {
            console.error(error);
            toast.error("Olimpiadalarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Mening Olimpiadalarim</h1>
                    <p className="text-muted-foreground">Siz tashkillashtirgan olimpiadalar</p>
                </div>
                {/* Note: Create Logic for Olympiads is complex, for now link to a create page or admin like page */}
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Yangi Olimpiada
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Barcha Olimpiadalar</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Yuklanmoqda...</div>
                    ) : olympiads.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <h3 className="text-lg font-medium mb-1">Olimpiadalar yo'q</h3>
                            <p className="text-muted-foreground mb-4">Hozircha olimpiada yaratmagansiz</p>
                            <Button>Birinchi olimpiadani yaratish</Button>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nomi</TableHead>
                                        <TableHead>Fan</TableHead>
                                        <TableHead>Boshlanish Vaqti</TableHead>
                                        <TableHead>Holati</TableHead>
                                        <TableHead className="text-right">Amallar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {olympiads.map((oly) => (
                                        <TableRow key={oly.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                                        <Trophy className="w-5 h-5" />
                                                    </div>
                                                    {oly.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>{oly.subject}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(oly.start_time).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${oly.status === 'ONGOING' ? 'bg-green-100 text-green-700' :
                                                        oly.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                                                            oly.status === 'CHECKING' ? 'bg-yellow-100 text-yellow-700' :
                                                                oly.status === 'PUBLISHED' ? 'bg-primary/10 text-primary' :
                                                                    'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {oly.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="gap-2" asChild>
                                                        <Link to={`/teacher/olympiads/${oly.id}/results`}>
                                                            <Eye className="w-4 h-4 text-primary" />
                                                            Natijalar
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="w-4 h-4 text-blue-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherOlympiadsPage;
