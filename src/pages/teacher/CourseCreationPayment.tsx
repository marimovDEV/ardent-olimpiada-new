import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Sparkles, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";
import { toast } from "sonner";

const CourseCreationPayment = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'fee' | 'premium' | null>(null);

    const handlePayFee = async () => {
        setLoading(true);
        try {
            // Create a payment for course creation fee (50,000 so'm)
            const response = await axios.post(
                `${API_URL}/payments/`,
                {
                    amount: 50000,
                    type: 'COURSE_CREATION_FEE',
                    method: 'CLICK' // or PAYME, based on user choice
                },
                { headers: getAuthHeader() }
            );

            // Redirect to payment page or process payment
            toast.success("To'lov amalga oshirilmoqda...");

            // After payment is successful, redirect to course creation
            setTimeout(() => {
                navigate('/teacher/courses');
            }, 1500);
        } catch (error) {
            console.error(error);
            toast.error("To'lovda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleBuyPremium = async () => {
        setLoading(true);
        try {
            // Redirect to premium subscription page
            toast.info("Premium obuna sahifasiga yo'naltirilmoqda...");
            setTimeout(() => {
                navigate('/teacher/premium');
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Kurs yaratish uchun to'lov
                    </h1>
                    <p className="text-gray-600">
                        Kurs yaratish uchun bir martalik to'lov yoki Premium obunani tanlang
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* One-time Fee Option */}
                    <Card
                        className={`cursor-pointer transition-all hover:shadow-lg border-2 ${selectedOption === 'fee' ? 'border-indigo-600 shadow-lg' : 'border-gray-200'
                            }`}
                        onClick={() => setSelectedOption('fee')}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <CreditCard className="w-8 h-8 text-indigo-600" />
                                {selectedOption === 'fee' && (
                                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <CardTitle>Bir martalik to'lov</CardTitle>
                            <CardDescription>Faqat bitta kurs uchun</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-3xl font-bold text-indigo-600">50,000 so'm</p>
                                    <p className="text-sm text-gray-500">Har bir kurs uchun</p>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-600" />
                                        1 ta kurs yaratish
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-600" />
                                        Cheksiz o'quvchilar
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-600" />
                                        Sotuvdan 70% olish
                                    </li>
                                </ul>
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePayFee();
                                    }}
                                    disabled={loading}
                                >
                                    {loading && selectedOption === 'fee' ? "Yuklanmoqda..." : "To'lash"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Premium Subscription Option */}
                    <Card
                        className={`cursor-pointer transition-all hover:shadow-lg border-2 relative overflow-hidden ${selectedOption === 'premium' ? 'border-purple-600 shadow-lg' : 'border-gray-200'
                            }`}
                        onClick={() => setSelectedOption('premium')}
                    >
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                            TAVSIYA
                        </div>
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                                {selectedOption === 'premium' && (
                                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <CardTitle className="text-purple-600">Premium obuna</CardTitle>
                            <CardDescription>Cheksiz kurslar yarating</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-3xl font-bold text-purple-600">150,000 so'm</p>
                                    <p className="text-sm text-gray-500">Oylik obuna</p>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                                        <Check className="w-4 h-4 text-purple-600" />
                                        Cheksiz kurs yaratish
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-600" />
                                        Premium nishon
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-600" />
                                        Statistika va analitika
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-green-600" />
                                        Sotuvdan 70% olish
                                    </li>
                                </ul>
                                <Button
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBuyPremium();
                                    }}
                                    disabled={loading}
                                >
                                    {loading && selectedOption === 'premium' ? "Yuklanmoqda..." : "Premium sotib olish"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 text-center">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/teacher/dashboard')}
                    >
                        Orqaga qaytish
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CourseCreationPayment;
