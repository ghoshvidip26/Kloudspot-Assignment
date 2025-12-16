"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";
import { sitesStore } from "../utils/utils";

/* ---------------- LIVE LINE PLUGIN ---------------- */
const liveLinePlugin = {
    id: "liveLine",
    afterDraw(chart: any) {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea) return;

        const x = scales.x?.getPixelForValue(
            chart.data.labels.length - 1
        );

        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = "#B91C1C";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.fillStyle = "#B91C1C";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("LIVE", x, chartArea.top - 8);
        ctx.restore();
    },
};

/* ---------------- REGISTER ---------------- */
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    liveLinePlugin
);

/* ---------------- OPTIONS ---------------- */
const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "top" as const,
            align: "end" as const,
            labels: {
                usePointStyle: true,
                color: "#6B7280",
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
                color: "rgba(0,0,0,0.06)",
                borderDash: [4, 4],
            },
            ticks: { color: "#6B7280" },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: "rgba(0,0,0,0.06)",
                borderDash: [4, 4],
            },
            ticks: { color: "#6B7280" },
        },
    },
};

/* ---------------- COMPONENT ---------------- */
export function Occupancy({ date }: { date: Date }) {
    const selectedSiteId = sitesStore((s) => s.selectedSiteId);
    const loadSites = sitesStore((s) => s.loadSites);

    const [rawData, setRawData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    /* Load sites once */
    useEffect(() => {
        loadSites();
    }, [loadSites]);

    /* Fetch occupancy */
    useEffect(() => {
        if (!selectedSiteId || !date) return;

        const fetchData = async () => {
            setLoading(true);
            const to = date.getTime();
            const from = to - 86400000;

            const res = await api.getOccupancyAnalytics(selectedSiteId, from, to);

            setRawData(res.data);
            setLoading(false);
        };

        fetchData();
    }, [selectedSiteId, date]); // ✅ FIXED

    /* Map API → Chart */
    const chartData = useMemo(() => {
        if (!rawData?.buckets) return null;

        const labels = rawData.buckets.map((b: any) =>
            b.local.split(" ")[1].slice(0, 5)
        );

        const values = rawData.buckets.map((b: any) => b.avg);

        return {
            labels,
            datasets: [
                {
                    label: "Occupancy",
                    data: values,
                    fill: true,
                    borderColor: "#6AA6A5",
                    backgroundColor: (context: any) => {
                        const { ctx, chartArea } = context.chart;
                        if (!chartArea) return "rgba(180,205,204,0.6)";

                        const gradient = ctx.createLinearGradient(
                            0,
                            chartArea.top,
                            0,
                            chartArea.bottom
                        );

                        gradient.addColorStop(0, "rgba(180,205,204,0.65)");
                        gradient.addColorStop(0.6, "rgba(180,205,204,0.25)");
                        gradient.addColorStop(1, "rgba(180,205,204,0.05)");

                        return gradient;
                    },
                    tension: 0.25,
                    pointRadius: 0,
                    borderWidth: 2,
                },
            ],
        };
    }, [rawData]); // ✅ prevents blank chart

    if (loading || !chartData)
        return <p className="p-4">Loading occupancy…</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
                Overall Occupancy
            </h3>
            <div className="h-[350px]">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}
