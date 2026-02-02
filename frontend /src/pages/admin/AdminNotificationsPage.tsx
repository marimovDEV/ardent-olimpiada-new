
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, getAuthHeader } from '@/services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Send, UploadCloud, Users, CheckCircle, Bell, History, Layout, Plus, Trash2, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const AdminNotificationsPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('send');
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [olympiads, setOlympiads] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        audience_type: 'ALL',
        course: '',
        olympiad: '',
        title: '',
        message: '',
        notification_type: 'SYSTEM',
        channel: 'WEB',
        link: '',
        scheduled_at: ''
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const [bRes, tRes, cRes, oRes] = await Promise.all([
                axios.get(`${API_URL}/notification-broadcasts/`, { headers: getAuthHeader() }),
                axios.get(`${API_URL}/notification-templates/`, { headers: getAuthHeader() }),
                axios.get(`${API_URL}/courses/`, { headers: getAuthHeader() }),
                axios.get(`${API_URL}/olympiads/`, { headers: getAuthHeader() })
            ]);
            setBroadcasts(bRes.data.results || bRes.data);
            setTemplates(tRes.data.results || tRes.data);
            setCourses(cRes.data.results || cRes.data);
            setOlympiads(oRes.data.results || oRes.data);
        } catch (error) {
            console.error("Resources fetch error:", error);
        }
    };

    const handleChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (payload.course === '') delete payload.course;
            if (payload.olympiad === '') delete payload.olympiad;
            if (payload.scheduled_at === '') delete payload.scheduled_at;

            const res = await axios.post(`${API_URL}/notification-broadcasts/`, payload, { headers: getAuthHeader() });
            toast.success(res.data.status === 'PENDING' ? "Xabar rejalashtirildi!" : "Xabar yuborildi!");
            setFormData({
                audience_type: 'ALL',
                course: '',
                olympiad: '',
                title: '',
                message: '',
                notification_type: 'SYSTEM',
                channel: 'WEB',
                link: '',
                scheduled_at: ''
            });
            fetchResources();
        } catch (error) {
            console.error(error);
            toast.error(t('admin.notifications.error'));
        } finally {
            setLoading(false);
        }
    };

    const applyTemplate = (template: any) => {
        setFormData({
            ...formData,
            title: template.title,
            message: template.message,
            notification_type: template.notification_type,
            channel: template.channel,
            link: template.link || ''
        });
        setActiveTab('send');
        toast.info("Andoza qo'llanildi");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                    <Bell className="w-8 h-8 text-primary" />
                    Bildirishnomalar PRO
                </h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                    <TabsTrigger value="send" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Yuborish
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="w-4 h-4" /> Tarix
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Andozalar
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="send" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('admin.notifications.new')}</CardTitle>
                                <CardDescription>Auditoriyani tanlang va xabar yuboring</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSend} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Kimga?</Label>
                                            <Select value={formData.audience_type} onValueChange={(v) => handleChange('audience_type', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tanlang" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ALL">Hamma</SelectItem>
                                                    <SelectItem value="STUDENTS">Talabalar</SelectItem>
                                                    <SelectItem value="TEACHERS">O'qituvchilar</SelectItem>
                                                    <SelectItem value="COURSE_STUDENTS">Kurs o'quvchilari</SelectItem>
                                                    <SelectItem value="OLYMPIAD_PARTICIPANTS">Olimpiada qatnashchilari</SelectItem>
                                                    <SelectItem value="INACTIVE">Nofaollar (7+ kun)</SelectItem>
                                                    <SelectItem value="NEW">{t('admin.notifications.newUsers')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {formData.audience_type === 'COURSE_STUDENTS' && (
                                            <div className="space-y-2">
                                                <Label>Qaysi Kurs?</Label>
                                                <Select value={formData.course} onValueChange={(v) => handleChange('course', v)}>
                                                    <SelectTrigger><SelectValue placeholder="Kursni tanlang" /></SelectTrigger>
                                                    <SelectContent>
                                                        {courses.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {formData.audience_type === 'OLYMPIAD_PARTICIPANTS' && (
                                            <div className="space-y-2">
                                                <Label>Qaysi Olimpiada?</Label>
                                                <Select value={formData.olympiad} onValueChange={(v) => handleChange('olympiad', v)}>
                                                    <SelectTrigger><SelectValue placeholder="Olimpiadani tanlang" /></SelectTrigger>
                                                    <SelectContent>
                                                        {olympiads.map(o => <SelectItem key={o.id} value={o.id.toString()}>{o.title}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Kanal</Label>
                                            <Select value={formData.channel} onValueChange={(v) => handleChange('channel', v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="WEB">Sayt</SelectItem>
                                                    <SelectItem value="TELEGRAM">Telegram</SelectItem>
                                                    <SelectItem value="ALL">Hammasi</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Turi</Label>
                                            <Select value={formData.notification_type} onValueChange={(v) => handleChange('notification_type', v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SYSTEM">Tizim</SelectItem>
                                                    <SelectItem value="COURSE">Kurs</SelectItem>
                                                    <SelectItem value="OLYMPIAD">Olimpiada</SelectItem>
                                                    <SelectItem value="ACHIEVEMENT">Yutuq</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Sarlavha</Label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Matn</Label>
                                        <Textarea
                                            value={formData.message}
                                            onChange={(e) => handleChange('message', e.target.value)}
                                            required
                                            className="min-h-[120px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Link (Ixtiyoriy)</Label>
                                            <Input
                                                placeholder="/courses/1"
                                                value={formData.link}
                                                onChange={(e) => handleChange('link', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rejalashtirish (Ixtiyoriy)</Label>
                                            <DateTimePicker
                                                date={formData.scheduled_at ? new Date(formData.scheduled_at) : undefined}
                                                setDate={(d) => handleChange('scheduled_at', d ? format(d, "yyyy-MM-dd'T'HH:mm") : '')}
                                                placeholder="Vaqtni tanlang"
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? <UploadCloud className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                        Yuborish
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Telegram Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-background rounded-lg p-4 border border-border shadow-sm">
                                        <p className="font-bold text-sm mb-1">{formData.title || "Sarlavha..."}</p>
                                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{formData.message || "Xabar matni..."}</p>
                                        {formData.link && <p className="text-blue-500 text-xs mt-2 underline cursor-pointer">Batafsil</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tezkor Andozalar</CardTitle>
                                    <CardDescription>Andozadan foyalanib vaqtni tejang</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {templates.slice(0, 3).map(t => (
                                        <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => applyTemplate(t)}>
                                            <div className="flex items-center gap-3">
                                                <Layout className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{t.name}</span>
                                            </div>
                                            <Plus className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full text-xs" onClick={() => setActiveTab('templates')}>Barchasini ko'rish</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Yuborilgan xabarlar tarixi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 border-b">
                                            <th className="p-3 text-left">Sana</th>
                                            <th className="p-3 text-left">Sarlavha</th>
                                            <th className="p-3 text-left">Auditoriya</th>
                                            <th className="p-3 text-left">Status</th>
                                            <th className="p-3 text-right">Qabul qiluvchilar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {broadcasts.map(b => (
                                            <tr key={b.id} className="hover:bg-muted/30">
                                                <td className="p-3">{format(new Date(b.created_at), 'dd.MM.yyyy HH:mm')}</td>
                                                <td className="p-3 font-medium">{b.title}</td>
                                                <td className="p-3 text-xs flex flex-col">
                                                    <span>{b.audience_type_display}</span>
                                                    {b.course_name && <span className="text-muted-foreground">({b.course_name})</span>}
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${b.status === 'SENT' ? 'bg-green-100 text-green-700' :
                                                        b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {b.status_display}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">{b.total_recipients}</td>
                                            </tr>
                                        ))}
                                        {broadcasts.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-muted-foreground">Tarix bo'sh</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="templates">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Bildirishnoma Andozalari</CardTitle>
                                <CardDescription>Andozalarni boshqarish</CardDescription>
                            </div>
                            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Yangi andoza</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templates.map(t => (
                                    <Card key={t.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between mb-2">
                                                <h4 className="font-bold">{t.name}</h4>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold mb-1">{t.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{t.message}</p>
                                            <Button variant="outline" className="w-full text-xs" onClick={() => applyTemplate(t)}>Qo'llash</Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminNotificationsPage;
