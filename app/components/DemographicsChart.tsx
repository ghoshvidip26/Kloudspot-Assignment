"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ArcElement,
} from "chart.js";
import { useEffect, useState, useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { api } from "../utils/api";
import { sitesStore } from "../utils/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler
);

/* ---------------- Line Chart Options ---------------- */
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      align: "end" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

/* ---------------- Donut Options ---------------- */
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.label}: ${ctx.parsed}%`,
      },
    },
  },
};

export default function DemographicsChart() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [demographicsData, setDemographicsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Load Sites ---------------- */
  useEffect(() => {
    api.getSites().then((res) => {
      sitesStore.getState().setSites(res.data);
      setSiteId(res.data?.[0]?.siteId);
    });
  }, []);

  /* ---------------- Fetch Demographics ---------------- */
  useEffect(() => {
    if (!siteId) return;

    const now = Date.now();
    const yesterday = now - 24 * 60 * 60 * 1000;

    api
      .getDemographics(siteId, yesterday, now)
      .then((res) => setDemographicsData(res.data))
      .finally(() => setLoading(false));
  }, [siteId]);

  /* ---------------- Derived Data ---------------- */
  const labels =
    demographicsData?.buckets?.map((b: any) =>
      b.local.split(" ")[1].slice(0, 5)
    ) ?? [];

  const maleData =
    demographicsData?.buckets?.map((b: any) => b.male) ?? [];
  const femaleData =
    demographicsData?.buckets?.map((b: any) => b.female) ?? [];

  const { maleAvg, femaleAvg } = useMemo(() => {
    if (!demographicsData?.buckets?.length)
      return { maleAvg: 0, femaleAvg: 0 };

    const totals = demographicsData.buckets.reduce(
      (acc: any, b: any) => {
        acc.male += b.male;
        acc.female += b.female;
        return acc;
      },
      { male: 0, female: 0 }
    );

    const count = demographicsData.buckets.length;

    return {
      maleAvg: +(totals.male / count).toFixed(1),
      femaleAvg: +(totals.female / count).toFixed(1),
    };
  }, [demographicsData]);

  /* ---------------- Chart Data ---------------- */
  const lineData = {
    labels,
    datasets: [
      {
        label: "Male",
        data: maleData,
        borderColor: "rgba(10, 93, 92, 1)",
        backgroundColor: "rgba(10, 93, 92, 0.25)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Female",
        data: femaleData,
        borderColor: "rgba(163, 213, 212, 1)",
        backgroundColor: "rgba(163, 213, 212, 0.25)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const doughnutData = {
    labels: ["Males", "Females"],
    datasets: [
      {
        data: [maleAvg, femaleAvg],
        backgroundColor: [
          "rgba(10, 93, 92, 0.8)",
          "rgba(163, 213, 212, 0.8)",
        ],
        cutout: "70%",
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        Loading demographics…
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Demographics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* -------- LEFT : DONUT CARD -------- */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h3 className="text-sm font-semibold text-gray-700">
            Chart of Demographics
          </h3>

          <div className="flex flex-col items-center gap-6">
            <div className="relative h-[220px] w-[220px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Total Crowd</p>
                <p className="text-2xl font-bold text-gray-800">100%</p>
              </div>
            </div>

            <div className="space-y-4">
              <Legend
                color="bg-teal-800"
                label={`${maleAvg}% Males`}
                icon
              />
              <Legend
                color="bg-teal-300"
                label={`${femaleAvg}% Females`}
                icon
              />
            </div>
          </div>
        </div>

        {/* -------- RIGHT : LINE CHART -------- */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Demographics Analysis
          </h3>

          <div className="h-[360px]">
            <Line options={lineOptions} data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );

}

function Legend({
  color,
  label,
  icon = false,
}: {
  color: string;
  label: string;
  icon?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {icon ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-gray-500"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
      ) : (
        <span className={`w-3 h-3 rounded-full ${color}`} />
      )}
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );
}
