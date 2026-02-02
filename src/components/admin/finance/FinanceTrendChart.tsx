
import React from "react";

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

export default FinanceTrendChart;
