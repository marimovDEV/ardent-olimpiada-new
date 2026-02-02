import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

const data = [
    { name: 'Matematika Pro', revenue: 12500000, color: '#3b82f6' },
    { name: 'Fizika Olympiad', revenue: 8400000, color: '#8b5cf6' },
    { name: 'Python Start', revenue: 6200000, color: '#10b981' },
    { name: 'Ingliz tili', revenue: 4100000, color: '#f59e0b' },
    { name: 'Mantiq', revenue: 1500000, color: '#64748b' },
];

const TopItemsChart = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full">
            <h3 className="font-bold text-lg mb-2 text-foreground">{t('admin.topItemsTitle')}</h3>
            <p className="text-xs text-muted-foreground mb-6">{t('admin.topItemsDesc')}</p>

            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            formatter={(value: number) => [`${value.toLocaleString()} ${t('olympiadsSection.currency')}`, t('admin.charts.revenue')]}
                        />
                        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopItemsChart;
