"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    changeText: string;
    trend: "up" | "down";
    showDivider?: boolean;
}

function StatCard({
    title,
    value,
    changeText,
    trend,
    showDivider = false,
}: StatCardProps) {
    return (
        <div className="relative flex-1 px-8 py-6">
            {/* Divider */}
            {showDivider && (
                <div className="absolute right-0 top-6 bottom-6 w-px bg-gray-200" />
            )}

            <p className="text-sm font-medium text-gray-600">{title}</p>

            <p className="mt-3 text-4xl font-semibold text-gray-900">
                {value}
            </p>

            <div className="mt-6 flex items-center gap-2">
                {trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                )}

                <p className="text-sm text-gray-600">{changeText}</p>
            </div>
        </div>
    );
}

export default function OccupancyStats({ date }: { date: Date }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex divide-x divide-transparent">
                <StatCard
                    title="Live Occupancy"
                    value={734}
                    trend="up"
                    changeText="10% More than yesterday"
                    showDivider
                />

                <StatCard
                    title="Today’s Footfall"
                    value="2,436"
                    trend="down"
                    changeText="10% Less than yesterday"
                    showDivider
                />

                <StatCard
                    title="Avg Dwell Time"
                    value="08min 30sec"
                    trend="up"
                    changeText="6% More than yesterday"
                />
            </div>
        </div>
    );
}
