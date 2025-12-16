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
import { useEffect, useMemo, useState } from "react";
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
  Filler,
);

export default function DemographicsChart({ date }: { date: Date }) {
  const selectedSiteId = sitesStore((s) => s.selectedSiteId);
  const loadSites = sitesStore((s) => s.loadSites);

  const [dataRaw, setDataRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  console.log("date: ", date.getTime());

  useEffect(() => {
    loadSites();
  }, [loadSites]);


  useEffect(() => {
    if (!selectedSiteId) return;

    const to = date.getTime();
    const from = to - 86400000;

    api.getDemographics(selectedSiteId, from, to)
      .then((res) => setDataRaw(res.data))
      .finally(() => setLoading(false));

  }, [selectedSiteId, date]);

  const labels =
    dataRaw?.buckets?.map((b: any) =>
      b.local.split(" ")[1].slice(0, 5)
    ) ?? [];

  const male = dataRaw?.buckets?.map((b: any) => b.male) ?? [];
  const female = dataRaw?.buckets?.map((b: any) => b.female) ?? [];

  const { maleAvg, femaleAvg } = useMemo(() => {
    if (!dataRaw?.buckets?.length) return { maleAvg: 0, femaleAvg: 0 };
    const total = dataRaw.buckets.reduce(
      (a: any, b: any) => {
        a.m += b.male;
        a.f += b.female;
        return a;
      },
      { m: 0, f: 0 }
    );
    const n = dataRaw.buckets.length;
    return {
      maleAvg: +(total.m / n).toFixed(1),
      femaleAvg: +(total.f / n).toFixed(1),
    };
  }, [dataRaw, date]);

  if (loading) return <div>Loading demographics…</div>;

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="relative bg-white p-6 rounded shadow">
        <h2 className="text-lg font-medium text-gray-800">Chart of Demographics</h2>
        <Doughnut
          data={{
            labels: ["Male", "Female"],
            datasets: [
              {
                data: [maleAvg, femaleAvg],
                backgroundColor: ["rgba(42, 127, 125, 0.6)", "rgba(71, 178, 176, 0.4)"],
                cutout: "70%",
              },
            ],
          }}
        />
        <div className="space-y-4">
          <Legend
            color="rgba(42, 127, 125, 0.6)"
            label={`${maleAvg}% Males`}
            icon
          />
          <Legend
            color="rgba(71, 178, 176, 0.4)"
            label={`${femaleAvg}% Females`}
            icon
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Total Crowd</p>
          <p className="text-2xl font-bold text-gray-800">100%</p>
        </div>
      </div>
      <div className="col-span-2 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Demographics Analysis
        </h2>

        <div className="h-[360px]">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Male",
                  data: male,
                  fill: true,
                  borderColor: "rgba(42, 127, 125, 1)",
                  backgroundColor: "rgba(42, 127, 125, 0.18)", // 👈 softer
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                },
                {
                  label: "Female",
                  data: female,
                  fill: true,
                  borderColor: "rgba(71, 178, 176, 1)",
                  backgroundColor: "rgba(71, 178, 176, 0.14)", // 👈 lighter
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  align: "end",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 16,
                  },
                },
              },
              interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
              },
              scales: {
                x: {
                  grid: {
                    color: "rgba(0,0,0,0.05)",
                    borderDash: [4, 4],
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(0,0,0,0.05)",
                    borderDash: [4, 4],
                  },
                },
              },
            }}
          />
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
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );
}