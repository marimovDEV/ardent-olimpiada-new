import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    BookOpen, MoreVertical, Plus, Users, Clock, Star, Edit, Trash2, Eye
} from "lucide-react";
import { toast } from "sonner";
import { API_URL, getAuthHeader } from "@/services/api";
import axios from "axios";
import { useTranslation } from "react-i18next";

// Helper for status badge
const StatusBadge = ({ is_active, t }: { is_active: boolean; t: any }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${is_active
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
        }`}>
        {is_active ? t('common.active') : t('common.draft')}
    </span>
);

const TeacherCoursesPage = () => {
    const { t } = useTranslation();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/teacher/courses/`, { headers: getAuthHeader() });
            setCourses(res.data.results || res.data);
        } catch (error) {
            console.error(error);
            toast.error(t('teacher.courses.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('teacher.courses.confirmDelete'))) return;

        try {
            await axios.delete(`${API_URL}/courses/${id}/`, { headers: getAuthHeader() });
            toast.success(t('teacher.courses.deleteSuccess'));
            fetchCourses();
        } catch (error) {
            toast.error(t('teacher.courses.deleteError'));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t('teacher.courses.title')}</h1>
                    <p className="text-muted-foreground">{t('teacher.courses.subtitle')}</p>
                </div>
                <Link to="/teacher/courses/create">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> {t('teacher.courses.newCourse')}
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('teacher.courses.allCourses')}</CardTitle>
                    <CardDescription>
                        {t('teacher.courses.totalCourses')} {courses.length} ta kurs topildi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <h3 className="text-lg font-medium mb-1">{t('teacher.courses.noCourses')}</h3>
                            <p className="text-muted-foreground mb-4">{t('teacher.courses.noCoursesDesc')}</p>
                            <Link to="/teacher/courses/create">
                                <Button variant="outline">{t('teacher.courses.createFirst')}</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('teacher.courses.name')}</TableHead>
                                        <TableHead>{t('teacher.courses.subject')}</TableHead>
                                        <TableHead>{t('teacher.courses.price')}</TableHead>
                                        <TableHead>{t('teacher.courses.status')}</TableHead>
                                        <TableHead className="text-right">{t('teacher.courses.students')}</TableHead>
                                        <TableHead className="text-right">{t('teacher.courses.rating')}</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                        {course.thumbnail ? (
                                                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <BookOpen className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="line-clamp-1">{course.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{course.subject}</TableCell>
                                            <TableCell>
                                                {parseFloat(course.price) === 0
                                                    ? <span className="text-green-600 font-medium">{t('teacher.courses.free')}</span>
                                                    : <span>{parseInt(course.price).toLocaleString()} UZS</span>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge is_active={course.is_active} t={t} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 text-muted-foreground">
                                                    <Users className="w-4 h-4" />
                                                    {course.students_count}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 text-yellow-500 font-medium">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    {course.rating}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/courses/${course.id}`} className="flex items-center">
                                                                <Eye className="w-4 h-4 mr-2" /> {t('common.view')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/teacher/courses/${course.id}/edit`} className="flex items-center">
                                                                <Edit className="w-4 h-4 mr-2" /> {t('common.edit')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={() => handleDelete(course.id)}
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
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherCoursesPage;
