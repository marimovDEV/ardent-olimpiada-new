import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

// Mock Data
const categoryData = [
    { name: 'Payment', value: 35, color: '#f87171' }, // Red
    { name: 'Technical', value: 25, color: '#60a5fa' }, // Blue
    { name: 'Course', value: 20, color: '#fbbf24' }, // Yellow
    { name: 'Olympiad', value: 15, color: '#a78bfa' }, // Purple
    { name: 'Other', value: 5, color: '#9ca3af' }, // Gray
];

const performanceData = [
    { name: 'Mon', resolved: 12, open: 5 },
    { name: 'Tue', resolved: 19, open: 8 },
    { name: 'Wed', resolved: 15, open: 3 },
    { name: 'Thu', resolved: 22, open: 10 },
    { name: 'Fri', resolved: 28, open: 6 },
    { name: 'Sat', resolved: 10, open: 2 },
    { name: 'Sun', resolved: 8, open: 1 },
];

const responseTimeData = [
    { name: 'Mon', time: 45 },
    { name: 'Tue', time: 30 },
    { name: 'Wed', time: 25 },
    { name: 'Thu', time: 40 },
    { name: 'Fri', time: 20 },
    { name: 'Sat', time: 60 },
    { name: 'Sun', time: 55 },
];

const SupportAnalytics = () => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Category Distribution */}
            <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold">{t('admin.ticketCategories')}</CardTitle>
                    <CardDescription>{t('admin.mostCommonIssues')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value}%`, t('admin.share')]} />
                                <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold">{t('admin.agentEfficiency')}</CardTitle>
                    <CardDescription>{t('admin.weeklyTicketStats')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="resolved" name={t('admin.statusResolved')} stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} barSize={20} />
                                <Bar dataKey="open" name={t('admin.statusOpen')} stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Response Time Trend */}
            <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold">{t('admin.responseTime')}</CardTitle>
                    <CardDescription>{t('admin.avgInMinutes')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: number) => [`${value} ${t('common.min')}`, t('common.time')]} />
                                <Line type="monotone" dataKey="time" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SupportAnalytics;
