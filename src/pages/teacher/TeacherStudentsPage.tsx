import { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Search, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";

const TeacherStudentsPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/teacher/students/`, { headers: getAuthHeader() });
            setStudents(res.data.results || []);
        } catch (error) {
            console.error(error);
            toast.error("O'quvchilarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Mening O'quvchilarim</h1>
                    <p className="text-muted-foreground">Kurslaringizdagi barcha o'quvchilar ro'yxati</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>O'quvchilar ({filteredStudents.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                placeholder="Qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Yuklanmoqda...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <h3 className="text-lg font-medium mb-1">O'quvchilar topilmadi</h3>
                            <p className="text-muted-foreground">Hozircha hech kim kurslaringizga yozilmagan yoki qidiruv natijasiz.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ism Familiya</TableHead>
                                        <TableHead>Aloqa</TableHead>
                                        <TableHead>Kurs</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead className="text-right">A'zo bo'lgan sana</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((std) => (
                                        <TableRow key={std.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                                        {std.student_name[0]}
                                                    </div>
                                                    {std.student_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {std.student_phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{std.course_title}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full"
                                                            style={{ width: `${std.progress || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{std.progress || 0}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {new Date(std.enrolled_at).toLocaleDateString()}
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

export default TeacherStudentsPage;
