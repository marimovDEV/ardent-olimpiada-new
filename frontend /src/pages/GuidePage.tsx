
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    Trophy, Smartphone, MessageSquare, User, Lock, LogIn, KeyRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const GuidePage = () => {
    const { t } = useTranslation();

    const steps = [
        {
            icon: Smartphone,
            title: t('auth_guide_page.reg_step1_title', 'Telefon raqam'),
            desc: t('auth_guide_page.reg_step1_desc', 'Telefon raqamingizni kiritib, "Kod olish" tugmasini bosing.'),
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            icon: MessageSquare,
            title: t('auth_guide_page.reg_step2_title', 'SMS Kod'),
            desc: t('auth_guide_page.reg_step2_desc', 'Sizga SMS yoki Telegram orqali kelgan kodni kiriting.'),
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-500/20"
        },
        {
            icon: User,
            title: t('auth_guide_page.reg_step3_title', "Ma'lumotlar"),
            desc: t('auth_guide_page.reg_step3_desc', "Ism, familiya, viloyat va maktabingizni kiriting."),
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            icon: Lock,
            title: t('auth_guide_page.reg_step4_title', 'Parol o\'rnatish'),
            desc: t('auth_guide_page.reg_step4_desc', 'Eslab qolish oson bo\'lgan, lekin ishonchli parol o\'rnating.'),
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20"
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            <Header />

            {/* Hero Section with Logo */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        {/* Logo Animation */}
                        <div className="mb-8 relative mx-auto w-fit group">
                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                                <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                            {t('auth_guide_page.title', "Ro'yxatdan o'tish va Kirish Qo'llanmasi")}
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t('auth_guide_page.subtitle', "Ardent platformasidan foydalanishni boshlash uchun qisqa yo'riqnoma")}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Registration Steps */}
            <section className="py-12 container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        {t('auth_guide_page.reg_title', "Ro'yxatdan o'tish")}
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`p-6 rounded-2xl border ${step.border} ${step.bg} relative group hover:-translate-y-1 transition-transform`}
                            >
                                <step.icon className={`w-10 h-10 ${step.color} mb-4`} />
                                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {step.desc}
                                </p>

                                {/* Connector Arrow (Desktop only, except last item) */}
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/30">
                                        →
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/auth/register">
                            <Button size="lg" className="h-12 px-8 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                                Hoziroq ro'yxatdan o'tish
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Login & Recovery Section */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

                        {/* Login Info */}
                        <div className="bg-background border rounded-2xl p-8 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-6">
                                <LogIn className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">{t('auth_guide_page.login_title', "2. Tizimga kirish")}</h2>
                            <p className="text-muted-foreground mb-6">
                                {t('auth_guide_page.login_desc', "Ro'yxatdan o'tib bo'lgach, telefon raqam va parolingiz orqali tizimga kirasiz.")}
                            </p>
                            <Link to="/auth/login">
                                <Button variant="outline" className="w-full h-12 rounded-xl border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/10 text-purple-600">
                                    Kirish sahifasiga o'tish
                                </Button>
                            </Link>
                        </div>

                        {/* Forgot Password */}
                        <div className="bg-background border rounded-2xl p-8 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
                                <KeyRound className="w-6 h-6 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">{t('auth_guide_page.forgot_pass', "Parolni unutdingizmi?")}</h2>
                            <p className="text-muted-foreground mb-6">
                                {t('auth_guide_page.forgot_desc', "Kirish oynasida 'Parolni unutdim' tugmasini bosib, yangi parol o'rnatishingiz mumkin.")}
                            </p>
                            <Link to="/auth/recover">
                                <Button variant="ghost" className="w-full h-12 rounded-xl text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10">
                                    Parolni tiklash
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default GuidePage;
