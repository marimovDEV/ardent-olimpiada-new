import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User, MapPin, Phone, Briefcase, BookOpen, Clock, Globe,
    Linkedin, Youtube, Send, Camera, Save, Lock, Loader2,
    CheckCircle, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_URL, getAuthHeader } from "@/services/api";
import axios from "axios";

// Types
interface TeacherProfile {
    bio: string;
    experience_years: number;
    specialization: string;
    telegram_username: string;
    instagram_username: string;
    youtube_channel: string;
    linkedin_profile: string;
}

interface Subject {
    id: number;
    name: string;
    color: string;
}

interface UserData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar: string | null;
    avatar_url: string | null;
    role: string;
    teacher_profile?: TeacherProfile;
    subjects?: Subject[];
}

const TeacherProfilePage = () => {
    const { toast } = useToast();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        bio: '',
        specialization: '',
        experience_years: 0,
        telegram_username: '',
        instagram_username: '',
        youtube_channel: '',
        linkedin_profile: ''
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/me/`, { headers: getAuthHeader() });
            if (res.data.success) {
                const userData = res.data.user;
                setUser(userData);

                // Initialize form
                setFormData({
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    phone: userData.phone || '',
                    bio: userData.teacher_profile?.bio || '',
                    specialization: userData.teacher_profile?.specialization || '',
                    experience_years: userData.teacher_profile?.experience_years || 0,
                    telegram_username: userData.teacher_profile?.telegram_username || '',
                    instagram_username: userData.teacher_profile?.instagram_username || '',
                    youtube_channel: userData.teacher_profile?.youtube_channel || '',
                    linkedin_profile: userData.teacher_profile?.linkedin_profile || ''
                });

                // Update local storage just to be safe (sync basics)
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Xatolik", description: "Profil ma'lumotlarini yuklashda xatolik", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Upload Avatar if changed
            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);
                await axios.post(`${API_URL}/auth/upload-avatar/`, formData, {
                    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
                });
            }

            // 2. Update Profile Data
            const payload = {
                ...formData,
                // Ensure experience is number
                experience_years: Number(formData.experience_years)
            };

            const res = await axios.put(`${API_URL}/auth/profile/`, payload, { headers: getAuthHeader() });

            if (res.data.success) {
                toast({ title: "Muvaffaqiyatli", description: "Profil saqlandi" });
                fetchProfile(); // Refresh
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Xatolik", description: "Saqlashda xatolik yuz berdi", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    if (!user) return <div>User not found</div>;

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8 animate-fade-in">
            {/* Header Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur">
                            ID: {user.username}
                        </Badge>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-lg transition-colors">
                                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 relative transition-colors">
                                        {(avatarPreview || user.avatar_url) ? (
                                            <img
                                                src={avatarPreview || user.avatar_url || ''}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 font-bold text-3xl">
                                                {user.first_name?.[0]}
                                            </div>
                                        )}
                                        {/* Overlay for upload */}
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="text-white w-8 h-8" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{user.first_name} {user.last_name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800 transition-colors">
                                        O'qituvchi
                                    </Badge>
                                    {formData.specialization && (
                                        <Badge variant="outline" className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 flex items-center gap-1 transition-colors">
                                            <Briefcase className="w-3 h-3" />
                                            {formData.specialization}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Saqlash
                        </Button>
                    </div>

                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full md:w-[600px] grid-cols-3 mb-8">
                            <TabsTrigger value="personal">Shaxsiy ma'lumotlar</TabsTrigger>
                            <TabsTrigger value="professional">Kasbiy ma'lumotlar</TabsTrigger>
                            <TabsTrigger value="security">Xavfsizlik</TabsTrigger>
                        </TabsList>

                        {/* Personal Info Tab */}
                        <TabsContent value="personal" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Asosiy ma'lumotlar</CardTitle>
                                    <CardDescription>Ism, familiya va bog'lanish ma'lumotlari</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Ism</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={formData.first_name}
                                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Familiya</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={formData.last_name}
                                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Telefon raqam</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Professional Info Tab */}
                        <TabsContent value="professional" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kasbiy ma'lumotlar</CardTitle>
                                    <CardDescription>Tajriba, mutaxassislik va fanlar</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Mutaxassislik</Label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Matematika o'qituvchisi"
                                                    value={formData.specialization}
                                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tajriba (yil)</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="number"
                                                    value={formData.experience_years}
                                                    onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Men haqimda (Bio)</Label>
                                        <Textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="O'quvchilaringizga o'zingiz haqingizda so'zlab bering..."
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Telegram Username</Label>
                                            <div className="relative">
                                                <Send className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="@username"
                                                    value={formData.telegram_username}
                                                    onChange={(e) => setFormData({ ...formData, telegram_username: e.target.value })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Instagram Username</Label>
                                            <div className="relative">
                                                <Camera className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="@username"
                                                    value={formData.instagram_username}
                                                    onChange={(e) => setFormData({ ...formData, instagram_username: e.target.value })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>YouTube Kanal</Label>
                                            <div className="relative">
                                                <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="https://youtube.com/..."
                                                    value={formData.youtube_channel}
                                                    onChange={(e) => setFormData({ ...formData, youtube_channel: e.target.value })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>LinkedIn Profil</Label>
                                            <div className="relative">
                                                <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="https://linkedin.com/in/..."
                                                    value={formData.linkedin_profile}
                                                    onChange={(e) => setFormData({ ...formData, linkedin_profile: e.target.value })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subjects Display (Read Only) */}
                                    <div className="space-y-3 pt-4 border-t">
                                        <Label className="text-base">Mening Fanlarim</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {user.subjects && user.subjects.length > 0 ? (
                                                user.subjects.map(sub => (
                                                    <Badge key={sub.id} className={`${sub.color} text-white px-3 py-1`}>
                                                        {sub.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <div className="text-sm text-gray-500 italic">
                                                    Hozircha fanlar biriktirilmagan. Administrator bilan bog'laning.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Xavfsizlik</CardTitle>
                                    <CardDescription>Parolni o'zgartirish</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-500 mb-4">
                                        Parolni o'zgartirish funksiyasi tez orada qo'shiladi. Hozircha administratorga murojaat qiling.
                                    </div>
                                    {/* Placeholder for change password form */}
                                    <div className="space-y-4 opacity-50 pointer-events-none">
                                        <div className="space-y-2">
                                            <Label>Eski Parol</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input type="password" className="pl-9" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Yangi Parol</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input type="password" className="pl-9" />
                                            </div>
                                        </div>
                                        <Button>Parolni yangilash</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfilePage;
