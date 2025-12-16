"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { api } from "../utils/api";
import { sitesStore } from "../utils/utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// ---------------- CHART OPTIONS ----------------
const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "top" as const,
            align: "end" as const,
            labels: {
                usePointStyle: true,
                pointStyle: "circle",
                padding: 15,
                font: { size: 12 },
            },
        },
        tooltip: {
            mode: "index" as const,
            intersect: false,
            callbacks: {
                label: (ctx: any) => `Avg: ${ctx.parsed.y.toFixed(1)}`,
            },
        },
    },
    interaction: {
        mode: "nearest" as const,
        axis: "x" as const,
        intersect: false,
    },
    scales: {
        x: {
            grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
                font: { size: 11 },
            },
        },
        y: {
            beginAtZero: true,
            suggestedMax: 150,
            ticks: {
                stepSize: 20,
                font: { size: 11 },
            },
            title: {
                display: true,
                text: "Occupancy",
                font: { size: 12 },
            },
            grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.05)",
            },
        },
    },
};

// ---------------- COMPONENT ----------------
export function Occupancy() {
    const [dwellData, setDwellData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [siteId, setSiteId] = useState<string | null>(null);

    // 1️⃣ Load sites
    useEffect(() => {
        const loadSites = async () => {
            try {
                const response = await api.getSites();
                sitesStore.getState().setSites(response.data);

                if (response.data?.length > 0) {
                    setSiteId(response.data[0].siteId);
                }
            } catch (err) {
                console.error("Error loading sites:", err);
                setError("Failed to load sites");
            }
        };

        loadSites();
    }, []);

    // 2️⃣ Fetch analytics when siteId is ready
    useEffect(() => {
        if (!siteId) return;

        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);

                const now = Date.now();
                const yesterday = now - 24 * 60 * 60 * 1000;

                const response = await api.getOccupancyAnalytics(
                    siteId,
                    yesterday,
                    now
                );

                setDwellData(response.data);
            } catch (err: any) {
                console.error("Analytics error:", err);
                setError(err.response?.data?.message || "Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [siteId]);

    // 3️⃣ Map API → chart
    const labels =
        dwellData?.buckets?.map((b: any) =>
            b.local.split(" ")[1].slice(0, 5)
        ) ?? [];

    const avgValues =
        dwellData?.buckets?.map((b: any) => b.avg) ?? [];

    const data = {
        labels,
        datasets: [
            {
                label: "Avg Occupancy",
                data: avgValues,
                borderColor: "rgba(96, 165, 164, 1)",
                backgroundColor: "rgba(96, 165, 164, 0.35)",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                borderWidth: 2,
            },
        ],
    };

    // ---------------- UI ----------------
    if (loading) {
        return <p className="p-4">Loading occupancy analytics...</p>;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Overall Occupancy
                </h3>

                <div className="h-[350px]">
                    {dwellData && <Line options={options} data={data} />}
                </div>

                <p className="text-center text-sm text-gray-600 mt-2">
                    Time (Local)
                </p>
            </div>
        </div>
    );
}
