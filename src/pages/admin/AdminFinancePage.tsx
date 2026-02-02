import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TopItemsChart from "@/components/admin/bi/TopItemsChart";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, DollarSign, TrendingUp, TrendingDown, Search, Loader2, MoreVertical, Eye, RefreshCcw, Trash2, BookOpen, Trophy } from "lucide-react";

// Mock Finance Trend Chart component
const FinanceTrendChart = () => (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h3 className="text-lg font-bold mb-4">Mablag'lar oqimi</h3>
        <div className="h-64 bg-muted/30 rounded-xl flex items-end justify-between p-4 gap-2">
            {[40, 60, 45, 90, 65, 80, 70].map((h, i) => (
                <div key={i} className="bg-primary/60 w-full rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
        </div>
    </div>
);

interface Transaction {
    id: number;
    amount: string;
    description: string;
    payment_method: "CLICK" | "PAYME" | "UZUM";
    status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    created_at: string;
    user: number;
    payment_id: string; // Internal or External ID
    user_data?: {
        phone: string;
        username: string;
    };
    // Mock type detection based on description or extended API
    type?: "Course" | "Olympiad";
}

const AdminFinancePage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        today_count: 0,
        refunded: 0
    });

    // UI States
    const [refundId, setRefundId] = useState<number | null>(null);
    const [refundReason, setRefundReason] = useState("");

    const { toast } = useToast();
    const { t } = useTranslation();

    useEffect(() => {
        fetchTransactions();
        fetchFinanceStats();
    }, [fetchTransactions, fetchFinanceStats]);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/payments/`, { headers: getAuthHeader() });
            setTransactions(res.data.results || res.data);
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: t('admin.finance.loadError') || "To'lovlar tarixini yuklashda xatolik", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [t, toast]);

    const fetchFinanceStats = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/stats/`, { headers: getAuthHeader() });
            if (res.data.success) {
                setStats({
                    total: res.data.stats.finance.total_revenue,
                    today_count: res.data.stats.finance.today_count || 0,
                    refunded: res.data.stats.finance.refunded_amount || 0
                });
            }
        } catch (error) {
            console.error("Stats error", error);
        }
    }, []);

    // FILTER LOGIC
    const filteredTransactions = transactions.filter(trx => {
        const matchesSearch = trx.payment_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trx.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // Simple type inference if API doesn't provide
        const type = trx.description?.toLowerCase().includes('olimpiada') ? 'Olympiad' : 'Course';
        const matchesType = typeFilter === "all" || type === typeFilter;

        const matchesStatus = statusFilter === "all" || trx.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    // HANDLERS
    const handleRefund = async () => {
        if (!refundId) return;

        // Backend refund endpoint simulation
        try {
            toast({ title: t('admin.refundSimulated'), description: `ID: ${refundId}. Sabab: ${refundReason}` });
            // In real app: await axios.post(`${API_URL}/payments/${refundId}/refund`, { reason: refundReason }, ...);
            // Update local state
            setTransactions(transactions.map(t => t.id === refundId ? { ...t, status: "CANCELLED" } : t));
        } catch (err) {
            toast({ title: t('common.error'), description: t('admin.refundError'), variant: "destructive" });
        }

        setRefundId(null);
        setRefundReason("");
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/payments/${id}/`, { headers: getAuthHeader() });
            setTransactions(transactions.filter(t => t.id !== id));
            toast({ title: t('admin.transactionDeleted'), description: t('admin.dataArchived') });
        } catch (error) {
            toast({ title: t('common.error'), description: t('admin.deleteError'), variant: "destructive" });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">{t('common.success')}</Badge>;
            case 'FAILED': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">{t('common.failed')}</Badge>;
            case 'CANCELLED': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t('admin.refunded')}</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatMoney = (amount: string | number) => {
        return Number(amount).toLocaleString() + " " + t('olympiadsSection.currency');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground">{t('admin.finance')}</h1>
                    <p className="text-muted-foreground">{t('admin.financeSubtitle')}</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        {t('admin.reportPdf')}
                    </Button>
                    <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                        <Download className="w-4 h-4 mr-2" />
                        {t('admin.exportExcel')}
                    </Button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +12.5%
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-foreground">{stats.total.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground font-medium">{t('admin.totalRevenue')}</div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-bold">
                            Bugun: {stats.today_count}
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-foreground">{transactions.length}</div>
                        <div className="text-sm text-muted-foreground font-medium">{t('admin.allPayments')}</div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-1 rounded font-bold">
                            -0%
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-foreground">{stats.refunded.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground font-medium">{t('admin.refunds')}</div>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid lg:grid-cols-2 gap-6">
                <FinanceTrendChart />
                <TopItemsChart />
            </div>

            {/* FILTERS & SEARCH */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={t('admin.searchFinancePlaceholder')}
                        className="pl-9 bg-muted/30 border-border"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[140px] bg-card">
                            <SelectValue placeholder={t('common.type')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common.all')}</SelectItem>
                            <SelectItem value="Course">{t('admin.courses')}</SelectItem>
                            <SelectItem value="Olympiad">{t('admin.olympiads')}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] bg-card">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barchasi</SelectItem>
                            <SelectItem value="COMPLETED">Success</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                            <SelectItem value="CANCELLED">Refunded</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={() => { fetchTransactions(); fetchFinanceStats(); }} className="rounded-xl">
                        <Loader2 className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px]">{t('admin.id')}</TableHead>
                                <TableHead>{t('admin.user')}</TableHead>
                                <TableHead>{t('admin.description')}</TableHead>
                                <TableHead>{t('admin.sumMethod')}</TableHead>
                                <TableHead>{t('admin.date')}</TableHead>
                                <TableHead>{t('admin.status')}</TableHead>
                                <TableHead className="text-right">{t('admin.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredTransactions.map((trx) => (
                                <TableRow key={trx.id} className="hover:bg-muted/50">
                                    <TableCell className="font-mono text-xs text-muted-foreground">{trx.payment_id || trx.id}</TableCell>
                                    <TableCell>
                                        <div className="font-bold text-foreground">{trx.user}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {trx.description?.toLowerCase().includes('kurs') ? (
                                                <BookOpen className="w-4 h-4 text-blue-500" />
                                            ) : (
                                                <Trophy className="w-4 h-4 text-purple-500" />
                                            )}
                                            <span className="text-sm text-foreground/80">{trx.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-foreground">{formatMoney(trx.amount)}</div>
                                        <div className="text-xs text-muted-foreground">{trx.payment_method}</div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(trx.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(trx.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Eye className="w-4 h-4 mr-2" /> {t('admin.details')}
                                                </DropdownMenuItem>

                                                {trx.status === 'COMPLETED' && (
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-yellow-600 focus:text-yellow-700 focus:bg-yellow-50"
                                                        onClick={() => setRefundId(trx.id)}
                                                    >
                                                        <RefreshCcw className="w-4 h-4 mr-2" /> {t('admin.refund')} (Refund)
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                    onClick={() => handleDelete(trx.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> {t('admin.delete')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {!loading && filteredTransactions.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground">{t('admin.noTransactions')}</h3>
                            <p className="text-muted-foreground mb-6">{t('admin.tryChangingSearch')}</p>
                            <Button variant="outline" onClick={() => { setSearchQuery(""); setTypeFilter("all"); setStatusFilter("all") }}>
                                {t('admin.clearFilters')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Refund Dialog */}
            <Dialog open={!!refundId} onOpenChange={(open) => !open && setRefundId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-yellow-600">
                            <AlertCircle className="w-5 h-5" />
                            {t('admin.refundMoney')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('admin.refundConfirmation', { id: refundId })}
                            {t('admin.refundIrreversible')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">{t('admin.refundReason')}</label>
                        <Textarea
                            placeholder={t('admin.refundReasonPlaceholder')}
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRefundId(null)}>{t('common.cancel')}</Button>
                        <Button variant="default" className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={handleRefund} disabled={!refundReason}>
                            {t('admin.confirmRefund')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default AdminFinancePage;
