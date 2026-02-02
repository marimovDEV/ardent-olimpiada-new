import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Save, Upload, Globe, Mail, Phone, MapPin, Shield, Lock,
    Bell, CreditCard, Users, Settings as SettingsIcon,
    Image as ImageIcon, TestTube, Loader2, CheckCircle, XCircle,
    Instagram, Facebook, Youtube, Send
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";

interface PlatformSettings {
    id?: number;
    platform_name: string;
    support_email: string;
    currency: string;
    default_language: string;
    logo?: string;
    favicon?: string;
    platform_description: string;
    contact_phone: string;
    contact_address: string;
    telegram_url: string;
    instagram_url: string;
    facebook_url: string;
    youtube_url: string;
    timezone: string;
    date_format: string;
    time_format: string;
}

interface SecuritySettings {
    id?: number;
    min_password_length: number;
    require_uppercase: boolean;
    require_numbers: boolean;
    require_special_chars: boolean;
    max_login_attempts: number;
    lockout_duration_minutes: number;
    enable_2fa: boolean;
    two_fa_method: string;
    enable_audit_log: boolean;
    audit_retention_days: number;
}

interface NotificationSettings {
    id?: number;
    notify_on_registration: boolean;
    notify_on_course_enrollment: boolean;
    notify_on_payment_success: boolean;
    notify_on_certificate_ready: boolean;
    notify_before_olympiad_hours: number;
    enable_web_notifications: boolean;
    enable_telegram_notifications: boolean;
    enable_email_notifications: boolean;
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    smtp_use_tls: boolean;
}

interface PaymentProvider {
    id?: number;
    provider: string;
    is_active: boolean;
    merchant_id: string;
    secret_key: string;
    test_mode: boolean;
}

interface Permission {
    id: number;
    code: string;
    name: string;
    description: string;
    category: string;
}

// Permissions will be localized using i18next keys perm_...

const AdminSettingsPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    // Settings State
    const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
        platform_name: "Ardent",
        support_email: "support@ardent.uz",
        currency: "UZS",
        default_language: "uz",
        platform_description: "",
        contact_phone: "",
        contact_address: "",
        telegram_url: "",
        instagram_url: "",
        facebook_url: "",
        youtube_url: "",
        timezone: "Asia/Tashkent",
        date_format: "DD.MM.YYYY",
        time_format: "HH:mm"
    });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        min_password_length: 8,
        require_uppercase: true,
        require_numbers: true,
        require_special_chars: false,
        max_login_attempts: 5,
        lockout_duration_minutes: 30,
        enable_2fa: false,
        two_fa_method: "EMAIL",
        enable_audit_log: true,
        audit_retention_days: 90
    });

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        notify_on_registration: true,
        notify_on_course_enrollment: true,
        notify_on_payment_success: true,
        notify_on_certificate_ready: true,
        notify_before_olympiad_hours: 24,
        enable_web_notifications: true,
        enable_telegram_notifications: true,
        enable_email_notifications: false,
        smtp_host: "",
        smtp_port: 587,
        smtp_username: "",
        smtp_password: "",
        smtp_use_tls: true
    });

    const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [permissionsByCategory, setPermissionsByCategory] = useState<Record<string, Permission[]>>({});
    const [testingEmail, setTestingEmail] = useState(false);
    const [showAddProviderDialog, setShowAddProviderDialog] = useState(false);
    const [newProvider, setNewProvider] = useState<PaymentProvider>({
        provider: 'CLICK',
        is_active: false,
        merchant_id: '',
        secret_key: '',
        test_mode: true
    });

    useEffect(() => {
        fetchAllSettings();
        fetchPermissions();
    }, []);

    const fetchAllSettings = async () => {
        setLoading(true);
        try {
            const headers = getAuthHeader();

            const [platformRes, securityRes, notificationRes, paymentRes] = await Promise.all([
                axios.get(`${API_URL}/settings/platform/`, { headers }),
                axios.get(`${API_URL}/settings/security/`, { headers }),
                axios.get(`${API_URL}/settings/notifications/`, { headers }),
                axios.get(`${API_URL}/settings/payment-providers/`, { headers })
            ]);

            console.log('Payment providers response:', paymentRes.data);

            // DRF returns array directly for list endpoints
            if (platformRes.data && platformRes.data.length > 0) {
                setPlatformSettings(platformRes.data[0]);
            }
            if (securityRes.data && securityRes.data.length > 0) {
                setSecuritySettings(securityRes.data[0]);
            }
            if (notificationRes.data && notificationRes.data.length > 0) {
                setNotificationSettings(notificationRes.data[0]);
            }
            if (paymentRes.data) {
                console.log('Setting payment providers:', paymentRes.data);
                // Handle both paginated and non-paginated responses
                const providers = paymentRes.data.results || paymentRes.data;
                setPaymentProviders(Array.isArray(providers) ? providers : []);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error(t('admin.loadSettingsError'));
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissions = async () => {
        try {
            const headers = getAuthHeader();
            const response = await axios.get(`${API_URL}/settings/permissions/by_category/`, { headers });
            setPermissionsByCategory(response.data);

            // Flatten permissions for easier access
            const allPerms: Permission[] = [];
            Object.values(response.data).forEach((perms: any) => {
                allPerms.push(...perms);
            });
            setPermissions(allPerms);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    const savePlatformSettings = async () => {
        setSaving(true);
        try {
            const headers = getAuthHeader();
            const method = platformSettings.id ? 'put' : 'post';
            const url = platformSettings.id
                ? `${API_URL}/settings/platform/${platformSettings.id}/`
                : `${API_URL}/settings/platform/`;

            const response = await axios[method](url, platformSettings, { headers });
            setPlatformSettings(response.data);
            toast.success(t('admin.platformSettingsSaved'));
            await fetchAllSettings();
        } catch (error: any) {
            console.error("Save error:", error);
            toast.error(error.response?.data?.detail || "Saqlashda xatolik");
        } finally {
            setSaving(false);
        }
    };

    const saveSecuritySettings = async () => {
        setSaving(true);
        try {
            const headers = getAuthHeader();
            const method = securitySettings.id ? 'put' : 'post';
            const url = securitySettings.id
                ? `${API_URL}/settings/security/${securitySettings.id}/`
                : `${API_URL}/settings/security/`;

            const response = await axios[method](url, securitySettings, { headers });
            setSecuritySettings(response.data);
            toast.success(t('admin.securitySettingsSaved'));
            await fetchAllSettings();
        } catch (error: any) {
            console.error("Save error:", error);
            toast.error(error.response?.data?.detail || "Saqlashda xatolik");
        } finally {
            setSaving(false);
        }
    };

    const saveNotificationSettings = async () => {
        setSaving(true);
        try {
            const headers = getAuthHeader();
            const method = notificationSettings.id ? 'put' : 'post';
            const url = notificationSettings.id
                ? `${API_URL}/settings/notifications/${notificationSettings.id}/`
                : `${API_URL}/settings/notifications/`;

            const response = await axios[method](url, notificationSettings, { headers });
            setNotificationSettings(response.data);
            toast.success(t('admin.notificationSettingsSaved'));
            await fetchAllSettings();
        } catch (error: any) {
            console.error("Save error:", error);
            toast.error(error.response?.data?.detail || "Saqlashda xatolik");
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('logo', file);

        try {
            const headers = getAuthHeader();
            const res = await axios.post(`${API_URL}/settings/platform/upload_logo/`, formData, { headers });
            setPlatformSettings(res.data);
            toast.success(t('admin.logoUploaded'));
            await fetchAllSettings();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.error || "Logo yuklashda xatolik");
        }
    };

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('favicon', file);

        try {
            const headers = getAuthHeader();
            const res = await axios.post(`${API_URL}/settings/platform/upload_favicon/`, formData, { headers });
            setPlatformSettings(res.data);
            toast.success(t('admin.faviconUploaded'));
            await fetchAllSettings();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.error || "Favicon yuklashda xatolik");
        }
    };

    const testEmailSettings = async () => {
        setTestingEmail(true);
        try {
            const headers = getAuthHeader();
            await axios.post(`${API_URL}/settings/notifications/test_email/`, {}, { headers });
            toast.success(t('admin.testEmailSent'));
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Email yuborishda xatolik");
        } finally {
            setTestingEmail(false);
        }
    };

    const togglePaymentProvider = async (provider: PaymentProvider) => {
        try {
            const headers = getAuthHeader();
            await axios.post(`${API_URL}/settings/payment-providers/${provider.id}/toggle_active/`, {}, { headers });
            fetchAllSettings();
            toast.success(provider.is_active
                ? t('admin.paymentProviderDisabled', { provider: provider.provider })
                : t('admin.paymentProviderEnabled', { provider: provider.provider }));
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    const createPaymentProvider = async () => {
        setSaving(true);
        try {
            const headers = getAuthHeader();
            await axios.post(`${API_URL}/settings/payment-providers/`, newProvider, { headers });
            toast.success(t('admin.paymentProviderAdded'));
            setShowAddProviderDialog(false);
            setNewProvider({
                provider: 'CLICK',
                is_active: false,
                merchant_id: '',
                secret_key: '',
                test_mode: true
            });
            await fetchAllSettings();
        } catch (error: any) {
            console.error("Create error:", error);
            toast.error(error.response?.data?.detail || "Qo'shishda xatolik");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
                        <SettingsIcon className="w-6 h-6" />
                        {t('admin.platformSettings')}
                    </h1>
                    <p className="text-muted-foreground">{t('admin.systemConfig')}</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-muted/50 p-1">
                    <TabsTrigger value="general" className="gap-2">
                        <Globe className="w-4 h-4" />
                        {i18n.language === 'ru' ? 'Общие' : 'Umumiy'}
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="w-4 h-4" />
                        {i18n.language === 'ru' ? 'Безопасность' : 'Xavfsizlik'}
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="w-4 h-4" />
                        {i18n.language === 'ru' ? 'Уведомления' : 'Bildirishnomalar'}
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        {i18n.language === 'ru' ? 'Платежи' : "To'lovlar"}
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="gap-2">
                        <Users className="w-4 h-4" />
                        {i18n.language === 'ru' ? 'Роли' : 'Rollar'}
                    </TabsTrigger>
                    <TabsTrigger value="system" className="gap-2">
                        <SettingsIcon className="w-4 h-4" />
                        {i18n.language === 'ru' ? 'Система' : 'Tizim'}
                    </TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.branding')}</CardTitle>
                            <CardDescription>{t('admin.platformLogoFavicon')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>Logo</Label>
                                    <div className="flex items-center gap-4">
                                        {platformSettings.logo && (
                                            <img src={platformSettings.logo} alt="Logo" className="w-20 h-20 object-contain border rounded-lg p-2" />
                                        )}
                                        <div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                                id="logo-upload"
                                            />
                                            <Label htmlFor="logo-upload" className="cursor-pointer">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    {t('admin.logoUpload')}
                                                </div>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label>Favicon</Label>
                                    <div className="flex items-center gap-4">
                                        {platformSettings.favicon && (
                                            <img src={platformSettings.favicon} alt="Favicon" className="w-12 h-12 object-contain border rounded-lg p-1" />
                                        )}
                                        <div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFaviconUpload}
                                                className="hidden"
                                                id="favicon-upload"
                                            />
                                            <Label htmlFor="favicon-upload" className="cursor-pointer">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    {t('admin.faviconUpload')}
                                                </div>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.basicInfo')}</CardTitle>
                            <CardDescription>{t('admin.platformNameInfo')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t('admin.platformName')}</Label>
                                    <Input
                                        value={platformSettings.platform_name}
                                        onChange={(e) => setPlatformSettings({ ...platformSettings, platform_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('admin.supportEmail')}</Label>
                                    <Input
                                        type="email"
                                        value={platformSettings.support_email}
                                        onChange={(e) => setPlatformSettings({ ...platformSettings, support_email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('admin.phone')}</Label>
                                    <Input
                                        value={platformSettings.contact_phone}
                                        onChange={(e) => setPlatformSettings({ ...platformSettings, contact_phone: e.target.value })}
                                        placeholder="+998 90 123 45 67"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('admin.currency')}</Label>
                                    <Select value={platformSettings.currency} onValueChange={(v) => setPlatformSettings({ ...platformSettings, currency: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UZS">UZS (so'm)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('admin.address')}</Label>
                                <Textarea
                                    value={platformSettings.contact_address}
                                    onChange={(e) => setPlatformSettings({ ...platformSettings, contact_address: e.target.value })}
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('admin.platformDescription')}</Label>
                                <Textarea
                                    value={platformSettings.platform_description}
                                    onChange={(e) => setPlatformSettings({ ...platformSettings, platform_description: e.target.value })}
                                    rows={3}
                                    placeholder={t('admin.platformDescriptionPlaceholder')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.socialNetworks')}</CardTitle>
                            <CardDescription>{t('admin.socialNetworksSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Send className="w-4 h-4 text-blue-500" />
                                        Telegram
                                    </Label>
                                    <Input
                                        value={platformSettings.telegram_url}
                                        onChange={(e) => setPlatformSettings({ ...platformSettings, telegram_url: e.target.value })}
                                        placeholder="https://t.me/ardent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Instagram className="w-4 h-4 text-pink-500" />
                                        Instagram
                                    </Label>
                                    <Input
                                        value={platformSettings.instagram_url}
                                        onChange={(e) => setPlatformSettings({ ...platformSettings, instagram_url: e.target.value })}
                                        placeholder="https://instagram.com/ardent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Facebook className="w-4 h-4 text-blue-600" />
                                        Facebook
                                    </Label>
                                    <Input
                                        value={platformSettings.facebook_url}
                                        onChange={(e) => setPlatformSettings({ ...platformSettings, facebook_url: e.target.value })}
                                        placeholder="https://facebook.com/ardent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Youtube className="w-4 h-4 text-red-500" />
                                        YouTube
                                    </Label>
                                    <Input
                                        value={platformSettings.youtube_url}
                                        onChange={(e) => setPlatformSettings({ ...platformSettings, youtube_url: e.target.value })}
                                        placeholder="https://youtube.com/@ardent"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={savePlatformSettings} disabled={saving} className="min-w-[140px]">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Saqlash
                        </Button>
                    </div>
                </TabsContent>

                {/* SECURITY TAB */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.passwordRequirements')}</CardTitle>
                            <CardDescription>{t('admin.passwordRequirementsSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t('admin.minPasswordLength')}</Label>
                                <Input
                                    type="number"
                                    value={securitySettings.min_password_length}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, min_password_length: parseInt(e.target.value) })}
                                    min={6}
                                    max={32}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>{t('admin.requireUppercase')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('admin.requireUppercaseSubtitle')}</p>
                                </div>
                                <Switch
                                    checked={securitySettings.require_uppercase}
                                    onCheckedChange={(c) => setSecuritySettings({ ...securitySettings, require_uppercase: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>{t('admin.requireNumbers')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('admin.requireNumbersSubtitle')}</p>
                                </div>
                                <Switch
                                    checked={securitySettings.require_numbers}
                                    onCheckedChange={(c) => setSecuritySettings({ ...securitySettings, require_numbers: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>{t('admin.requireSpecialChars')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('admin.requireSpecialCharsSubtitle')}</p>
                                </div>
                                <Switch
                                    checked={securitySettings.require_special_chars}
                                    onCheckedChange={(c) => setSecuritySettings({ ...securitySettings, require_special_chars: c })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.loginSecurity')}</CardTitle>
                            <CardDescription>{t('admin.loginSecuritySubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t('admin.maxLoginAttempts')}</Label>
                                    <Input
                                        type="number"
                                        value={securitySettings.max_login_attempts}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, max_login_attempts: parseInt(e.target.value) })}
                                        min={3}
                                        max={10}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('admin.lockoutDuration')}</Label>
                                    <Input
                                        type="number"
                                        value={securitySettings.lockout_duration_minutes}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, lockout_duration_minutes: parseInt(e.target.value) })}
                                        min={5}
                                        max={120}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.twoFa')}</CardTitle>
                            <CardDescription>{t('admin.twoFaSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>{t('admin.enableTwoFa')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('admin.twoFaRequiredAdmin')}</p>
                                </div>
                                <Switch
                                    checked={securitySettings.enable_2fa}
                                    onCheckedChange={(c) => setSecuritySettings({ ...securitySettings, enable_2fa: c })}
                                />
                            </div>
                            {securitySettings.enable_2fa && (
                                <div className="space-y-2">
                                    <Label>{t('admin.twoFaMethod')}</Label>
                                    <Select value={securitySettings.two_fa_method} onValueChange={(v) => setSecuritySettings({ ...securitySettings, two_fa_method: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EMAIL">Email</SelectItem>
                                            <SelectItem value="SMS">SMS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.auditLog')}</CardTitle>
                            <CardDescription>{t('admin.auditLogSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>{t('admin.enableAuditLog')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('admin.enableAuditLogTracking')}</p>
                                </div>
                                <Switch
                                    checked={securitySettings.enable_audit_log}
                                    onCheckedChange={(c) => setSecuritySettings({ ...securitySettings, enable_audit_log: c })}
                                />
                            </div>
                            {securitySettings.enable_audit_log && (
                                <div className="space-y-2">
                                    <Label>{t('admin.auditRetention')}</Label>
                                    <Input
                                        type="number"
                                        value={securitySettings.audit_retention_days}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, audit_retention_days: parseInt(e.target.value) })}
                                        min={30}
                                        max={365}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={saveSecuritySettings} disabled={saving} className="min-w-[140px]">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {t('admin.save')}
                        </Button>
                    </div>
                </TabsContent>

                {/* NOTIFICATIONS TAB */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.autoNotifications')}</CardTitle>
                            <CardDescription>{t('admin.autoNotificationsSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>{t('admin.notifyOnRegistration')}</Label>
                                <Switch
                                    checked={notificationSettings.notify_on_registration}
                                    onCheckedChange={(c) => setNotificationSettings({ ...notificationSettings, notify_on_registration: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>{t('admin.notifyOnCourseEnrollment')}</Label>
                                <Switch
                                    checked={notificationSettings.notify_on_course_enrollment}
                                    onCheckedChange={(c) => setNotificationSettings({ ...notificationSettings, notify_on_course_enrollment: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>{t('admin.notifyOnPaymentSuccess')}</Label>
                                <Switch
                                    checked={notificationSettings.notify_on_payment_success}
                                    onCheckedChange={(c) => setNotificationSettings({ ...notificationSettings, notify_on_payment_success: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>{t('admin.notifyOnCertificateReady')}</Label>
                                <Switch
                                    checked={notificationSettings.notify_on_certificate_ready}
                                    onCheckedChange={(c) => setNotificationSettings({ ...notificationSettings, notify_on_certificate_ready: c })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('admin.notifyBeforeOlympiad')}</Label>
                                <Input
                                    type="number"
                                    value={notificationSettings.notify_before_olympiad_hours}
                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, notify_before_olympiad_hours: parseInt(e.target.value) })}
                                    min={1}
                                    max={72}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.channels')}</CardTitle>
                            <CardDescription>{t('admin.channelsSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>{t('admin.webNotifications')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('admin.webNotificationsPlatform')}</p>
                                </div>
                                <Switch
                                    checked={notificationSettings.enable_web_notifications}
                                    onCheckedChange={(c) => setNotificationSettings({ ...notificationSettings, enable_web_notifications: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>{t('admin.telegramNotifications')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('admin.telegramNotificationsBot')}</p>
                                </div>
                                <Switch
                                    checked={notificationSettings.enable_telegram_notifications}
                                    onCheckedChange={(c) => setNotificationSettings({ ...notificationSettings, enable_telegram_notifications: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>{t('admin.emailNotifications')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('admin.emailNotificationsSmtp')}</p>
                                </div>
                                <Switch
                                    checked={notificationSettings.enable_email_notifications}
                                    onCheckedChange={(c) => setNotificationSettings({ ...notificationSettings, enable_email_notifications: c })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {notificationSettings.enable_email_notifications && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('admin.smtpSettings')}</CardTitle>
                                <CardDescription>{t('admin.smtpSettingsSubtitle')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{t('admin.smtpHost')}</Label>
                                        <Input
                                            value={notificationSettings.smtp_host}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, smtp_host: e.target.value })}
                                            placeholder="smtp.gmail.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('admin.smtpPort')}</Label>
                                        <Input
                                            type="number"
                                            value={notificationSettings.smtp_port}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, smtp_port: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Username</Label>
                                        <Input
                                            value={notificationSettings.smtp_username}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, smtp_username: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            value={notificationSettings.smtp_password}
                                            onChange={(e) => setNotificationSettings({ ...notificationSettings, smtp_password: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>{t('admin.useTls')}</Label>
                                    <Switch
                                        checked={notificationSettings.smtp_use_tls}
                                        onCheckedChange={(c) => setNotificationSettings({ ...notificationSettings, smtp_use_tls: c })}
                                    />
                                </div>
                                <Button onClick={testEmailSettings} disabled={testingEmail} variant="outline" className="w-full">
                                    {testingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TestTube className="w-4 h-4 mr-2" />}
                                    {t('admin.testEmailSend')}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end">
                        <Button onClick={saveNotificationSettings} disabled={saving} className="min-w-[140px]">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {t('admin.save')}
                        </Button>
                    </div>
                </TabsContent>

                {/* PAYMENTS TAB */}
                <TabsContent value="payments" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{t('admin.paymentProviders')}</CardTitle>
                                    <CardDescription>{t('admin.paymentProvidersSubtitle')}</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setShowAddProviderDialog(true)}>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    {t('admin.addNew')}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {paymentProviders.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>{t('admin.paymentsNotFound')}</p>
                                    <p className="text-xs mt-2">{t('admin.paymentsNotCreated')}</p>
                                </div>
                            ) : (
                                paymentProviders.map((provider) => (
                                    <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${provider.provider === 'CLICK' ? 'bg-blue-500' :
                                                provider.provider === 'PAYME' ? 'bg-purple-500' :
                                                    'bg-green-500'
                                                }`}>
                                                {provider.provider.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{provider.provider}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {provider.test_mode ? t('admin.testMode') : t('admin.productionMode')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {provider.is_active ? (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{t('admin.active')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <XCircle className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{t('admin.inactive')}</span>
                                                </div>
                                            )}
                                            <Button
                                                variant={provider.is_active ? "destructive" : "default"}
                                                size="sm"
                                                onClick={() => togglePaymentProvider(provider)}
                                            >
                                                {provider.is_active ? (i18n.language === 'ru' ? 'Деактивировать' : "O'chirish") : (i18n.language === 'ru' ? 'Активировать' : 'Yoqish')}
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ROLES TAB */}
                <TabsContent value="roles" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.permissions')}</CardTitle>
                            <CardDescription>{t('admin.permissionsSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(permissionsByCategory).length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>{t('admin.permissionsLoading')}</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(permissionsByCategory).map(([category, perms]) => (
                                        <div key={category} className="space-y-3">
                                            <h3 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-2">
                                                {category === 'courses' && `📚 ${t('admin.courses')}`}
                                                {category === 'olympiads' && `🏆 ${t('admin.olympiads')}`}
                                                {category === 'users' && `👥 ${t('admin.users')}`}
                                                {category === 'finance' && `💰 ${t('admin.finance')}`}
                                                {category === 'settings' && `⚙️ ${t('admin.settings')}`}
                                                {!['courses', 'olympiads', 'users', 'finance', 'settings'].includes(category) && `📁 ${category}`}
                                                <span className="text-xs font-normal text-muted-foreground">({perms.length})</span>
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {perms.map((perm: Permission) => {
                                                    // const translation = permissionTranslations[perm.code];
                                                    return (
                                                        <div key={perm.id} className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <Shield className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-semibold text-sm">
                                                                    {t(`admin.perm_${perm.code}`) !== `admin.perm_${perm.code}` ? t(`admin.perm_${perm.code}`) : perm.name}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                                    {t(`admin.perm_desc_${perm.code}`) !== `admin.perm_desc_${perm.code}` ? t(`admin.perm_desc_${perm.code}`) : perm.description}
                                                                </div>
                                                                <div className="text-xs font-mono text-muted-foreground/60 mt-1">{perm.code}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.roleManagement')}</CardTitle>
                            <CardDescription>{t('admin.rolePermissionsNextVersion')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">{t('admin.roleManagementNextVersion')}</p>
                                <p className="text-xs mt-2">{t('admin.viewPermissionsOnly')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SYSTEM TAB */}
                <TabsContent value="system" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.systemSettings')}</CardTitle>
                            <CardDescription>{t('admin.systemSettingsSubtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>{t('admin.timezone')}</Label>
                                    <Select value={platformSettings.timezone} onValueChange={(v) => setPlatformSettings({ ...platformSettings, timezone: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Tashkent">Asia/Tashkent (UTC+5)</SelectItem>
                                            <SelectItem value="Asia/Almaty">Asia/Almaty (UTC+6)</SelectItem>
                                            <SelectItem value="Europe/Moscow">Europe/Moscow (UTC+3)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('admin.dateFormat')}</Label>
                                    <Select value={platformSettings.date_format} onValueChange={(v) => setPlatformSettings({ ...platformSettings, date_format: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('admin.timeFormat')}</Label>
                                    <Select value={platformSettings.time_format} onValueChange={(v) => setPlatformSettings({ ...platformSettings, time_format: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HH:mm">24-soatlik (HH:mm)</SelectItem>
                                            <SelectItem value="hh:mm A">12-soatlik (hh:mm AM/PM)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('admin.defaultLanguage')}</Label>
                                <Select value={platformSettings.default_language} onValueChange={(v) => setPlatformSettings({ ...platformSettings, default_language: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="uz">{t('admin.uzbek')}</SelectItem>
                                        <SelectItem value="ru">{t('admin.russian')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={savePlatformSettings} disabled={saving} className="min-w-[140px]">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {t('admin.save')}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Add Payment Provider Dialog */}
            <Dialog open={showAddProviderDialog} onOpenChange={setShowAddProviderDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('admin.addPaymentProviderTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.addPaymentProviderDesc')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t('admin.provider')}</Label>
                            <Select
                                value={newProvider.provider}
                                onValueChange={(value) => setNewProvider({ ...newProvider, provider: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLICK">Click</SelectItem>
                                    <SelectItem value="PAYME">Payme</SelectItem>
                                    <SelectItem value="UZUM">Uzum</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('admin.merchantId')}</Label>
                            <Input
                                value={newProvider.merchant_id}
                                onChange={(e) => setNewProvider({ ...newProvider, merchant_id: e.target.value })}
                                placeholder="merchant_id_123"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('admin.secretKey')}</Label>
                            <Input
                                type="password"
                                value={newProvider.secret_key}
                                onChange={(e) => setNewProvider({ ...newProvider, secret_key: e.target.value })}
                                placeholder="secret_key_***"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>{t('admin.testMode')}</Label>
                            <Switch
                                checked={newProvider.test_mode}
                                onCheckedChange={(checked) => setNewProvider({ ...newProvider, test_mode: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>{t('admin.active')}</Label>
                            <Switch
                                checked={newProvider.is_active}
                                onCheckedChange={(checked) => setNewProvider({ ...newProvider, is_active: checked })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddProviderDialog(false)}>
                            {t('admin.cancel')}
                        </Button>
                        <Button onClick={createPaymentProvider} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {t('admin.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminSettingsPage;
