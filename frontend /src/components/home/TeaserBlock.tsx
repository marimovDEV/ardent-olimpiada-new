import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

const TeaserBlock = () => {
    const { t } = useTranslation();

    return (
        <section className="py-12 bg-primary/5 border-y border-primary/10">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-center md:text-left shadow-xl"
                >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4 backdrop-blur-sm animate-pulse">
                                <Sparkles className="w-3 h-3" />
                                {t('teaser.badge', "Tez kunda")}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                {t('teaser.title', "Sun'iy Intellekt va Data Science")}
                            </h2>
                            <p className="text-indigo-100 text-lg mb-0">
                                {t('teaser.description', "Zamonaviy kasblarni o'rganing. Yangi kurslarimiz ustida qizg'in ish olib boryapmiz.")}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Button size="lg" asChild className="bg-white text-indigo-600 hover:bg-white/90 font-bold border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                <Link to="/auth/register">
                                    {t('teaser.button', "Xabardor bo'lish")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TeaserBlock;
