import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const data = [
    { name: 'Jan 15', income: 1200000 },
    { name: 'Jan 16', income: 1850000 },
    { name: 'Jan 17', income: 950000 },
    { name: 'Jan 18', income: 2400000 },
    { name: 'Jan 19', income: 3100000 },
    { name: 'Jan 20', income: 2800000 },
    { name: 'Jan 21', income: 3500000 },
];

const FinanceTrendChart = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg text-foreground">{t('admin.financeTrend')}</h3>
                    <p className="text-xs text-muted-foreground">{t('admin.financeTrendDesc')}</p>
                </div>
                <select className="bg-muted border border-border rounded-lg text-xs px-2 py-1 outline-none text-foreground">
                    <option>{t('admin.last7Days')}</option>
                    <option>{t('admin.last30Days')}</option>
                </select>
            </div>

            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(name) => t(`months.${name.split(' ')[0].toLowerCase()}`)}
                        />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString()}`} />
                        <Tooltip
                            labelFormatter={(label) => {
                                const [month, day] = label.split(' ');
                                return `${t(`months.${month.toLowerCase()}`)} ${day}`;
                            }}
                            formatter={(value: number) => [`${value.toLocaleString()} ${t('olympiadsSection.currency')}`, t('admin.charts.income')]}
                        />
                        <Area type="monotone" dataKey="income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FinanceTrendChart;
