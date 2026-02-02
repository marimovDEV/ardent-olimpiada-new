import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, CheckCircle, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import api, { API_URL } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    onSuccess?: (newBalance?: number) => void;
    requiredAmount?: number;
}

const PaymentModal = ({ isOpen, onOpenChange, onClose, onSuccess, requiredAmount }: PaymentModalProps) => {
    const [amount, setAmount] = useState(requiredAmount ? requiredAmount.toString() : "50000");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'SELECT' | 'SUCCESS'>('SELECT');

    // Update amount if requiredAmount changes
    useEffect(() => {
        if (requiredAmount) {
            setAmount(requiredAmount.toString());
        }
    }, [requiredAmount]);

    const handleOpenChange = (open: boolean) => {
        if (onOpenChange) onOpenChange(open);
        if (!open && onClose) onClose();
    };

    const handleInitiate = async (method: 'PAYME' | 'CLICK') => {
        const val = parseInt(amount);
        if (!val || val < 1000) {
            toast.error("Minimal summa: 1,000 UZS");
            return;
        }

        setLoading(true);
        try {
            // Check if it's a top-up or a direct purchase if needed, 
            // but usually we top up the wallet first. 
            // Looking at the previous implementation, it was calling /wallet/top-up/ (Simulation)
            // or /payments/initiate/. Let's follow the standard pattern.

            const res = await api.post(`/wallet/top-up/`, {
                amount: val,
                method: method
            });

            if (res.data.success) {
                toast.success("Hisob muvaffaqiyatli to'ldirildi!");
                if (onSuccess) onSuccess(res.data.balance);
                setStep('SUCCESS');

                // Update local user balance
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    user.balance = res.data.balance;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
        } catch (error: any) {
            console.error("Payment Error:", error);
            toast.error(error.response?.data?.error || "To'lovda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep('SELECT');
        handleOpenChange(false);
    };

    const quickAmounts = ["10000", "50000", "150000", "500000"];

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-slate-950 border-none rounded-[32px] shadow-[0_0_50px_rgba(59,130,246,0.15)] ring-1 ring-white/10">
                <div className="relative p-8">
                    {/* Background Neon Glows */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-[80px] -mr-20 -mt-20 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/20 blur-[80px] -ml-20 -mb-20 rounded-full" />

                    <DialogHeader className="relative z-10 space-y-2 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-2xl font-black text-white tracking-tight">Balansni to'ldirish</DialogTitle>
                                <DialogDescription className="text-slate-400 font-medium font-bold">1 ArdCoin = 1 so'm</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        {step === 'SELECT' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8 relative z-10"
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">To'ldirish summasi (UZS)</Label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                                                UZS
                                            </div>
                                            <Input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                min="1000"
                                                className="h-16 pl-16 pr-4 bg-slate-900/50 border-slate-800 text-2xl font-black text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {quickAmounts.map((amt) => (
                                            <button
                                                key={amt}
                                                onClick={() => setAmount(amt)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${amount === amt
                                                    ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                                    }`}
                                            >
                                                {parseInt(amt).toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleInitiate('PAYME')}
                                        disabled={loading}
                                        className="relative group h-32 rounded-3xl bg-slate-900/40 border border-slate-800/50 overflow-hidden transition-all hover:border-blue-500/50 hover:bg-slate-900/60"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 group-hover:to-blue-600/10 transition-colors" />
                                        <div className="relative flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <CreditCard className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <span className="font-bold text-slate-200 tracking-wide text-sm">PAYME</span>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center blur-[2px]" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleInitiate('CLICK')}
                                        disabled={loading}
                                        className="relative group h-32 rounded-3xl bg-slate-900/40 border border-slate-800/50 overflow-hidden transition-all hover:border-blue-400/50 hover:bg-slate-900/60"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-400/5 group-hover:to-blue-400/10 transition-colors" />
                                        <div className="relative flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Wallet className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <span className="font-bold text-slate-200 tracking-wide text-sm">CLICK</span>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-center blur-[2px]" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center py-10 text-center space-y-6"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse" />
                                    <div className="relative w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center ring-4 ring-green-500/10">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white tracking-tight">Muvaffaqiyatli!</h3>
                                    <p className="text-slate-400 font-medium">To'lov qabul qilindi va hisobingiz yangilandi.</p>
                                </div>
                                <Button onClick={reset} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold border border-slate-800 transition-all">
                                    Yopish
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 rounded-[32px]"
                        >
                            <div className="text-center space-y-4">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-500 opacity-20" />
                                    <Zap className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-white text-lg tracking-tight">Bajarilmoqda...</p>
                                    <p className="text-slate-500 text-sm">Bog'lanish o'rnatilmoqda</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
