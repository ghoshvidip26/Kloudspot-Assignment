"use client"

import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"
import { Occupancy } from "../components/Occupancy"
import DemographicsChart from "../components/DemographicsChart"
import Footfall from "../components/Footfall"

export default function Home() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />

                <main className="flex-1 p-6 overflow-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Overview
                        </h1>

                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Today
                        </button>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Footfall
                        </h2>
                        <Footfall />
                    </section>

                    {/* Occupancy */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Occupancy
                        </h2>
                        <Occupancy />
                    </section>

                    {/* Demographics */}
                    <section className="space-y-4">
                        <DemographicsChart />
                    </section>
                </main>
            </div>
        </div>
    )
}