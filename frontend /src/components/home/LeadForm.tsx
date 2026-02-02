import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import api from "@/services/api";

interface LeadFormData {
    name: string;
    phone: string;
    telegram_username?: string;
    note?: string;
}

const LeadForm = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormData>();

    const onSubmit = async (data: LeadFormData) => {
        setIsLoading(true);
        try {
            // Using api.post directly to our 'leads' endpoint
            await api.post('/leads/', data);
            toast.success(t('leadForm.form.success'), {
                description: t('leadForm.form.success_desc')
            });
            reset();
        } catch (error) {
            console.error(error);
            toast.error(t('leadForm.form.error'), {
                description: t('leadForm.form.error_desc')
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-20 bg-primary/5">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-2">
                            {t('leadForm.badge')}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            {t('leadForm.title')} <br />
                            <span className="text-primary">{t('leadForm.titleAccent')}</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t('leadForm.description')}
                        </p>

                        <div className="flex flex-col gap-4 text-sm text-muted-foreground bg-background/50 p-6 rounded-xl border border-dashed">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">1</div>
                                <span>{t('leadForm.steps.1')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
                                <span>{t('leadForm.steps.2')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">3</div>
                                <span>{t('leadForm.steps.3')}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-background rounded-3xl p-8 shadow-xl border relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10"></div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                            <h3 className="text-xl font-bold mb-4">{t('leadForm.form.title')}</h3>

                            <div className="space-y-2">
                                <Label htmlFor="name">{t('leadForm.form.name')}</Label>
                                <Input
                                    id="name"
                                    placeholder={t('leadForm.form.name_ph')}
                                    className="bg-muted/30"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <span className="text-xs text-red-500">{t('leadForm.form.error_name')}</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">{t('leadForm.form.phone')}</Label>
                                <Input
                                    id="phone"
                                    placeholder={t('leadForm.form.phone_ph')}
                                    className="bg-muted/30"
                                    {...register("phone", { required: true })}
                                />
                                {errors.phone && <span className="text-xs text-red-500">{t('leadForm.form.error_phone')}</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telegram">{t('leadForm.form.telegram')}</Label>
                                <Input
                                    id="telegram"
                                    placeholder={t('leadForm.form.telegram_ph', { defaultValue: '@username' })}
                                    className="bg-muted/30"
                                    {...register("telegram_username")}
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full mt-2" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('leadForm.form.submitting')}
                                    </>
                                ) : (
                                    <>
                                        {t('leadForm.form.submit')} <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                {t('leadForm.form.privacy')}
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LeadForm;
