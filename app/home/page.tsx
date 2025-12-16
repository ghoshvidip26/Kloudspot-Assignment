"use client";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { Occupancy } from "../components/Occupancy";
import DemographicsChart from "../components/DemographicsChart";
import OccupancyStats from "../components/OccupancyStats";
import CalendarDropdown from "../components/CalendarDropdown";
import { useState } from "react";

export default function Home() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

                        <CalendarDropdown onChange={setSelectedDate} />
                    </div>

                    {/* Occupancy stats */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Occupancy
                        </h2>
                        <OccupancyStats date={selectedDate} />
                    </section>

                    {/* Occupancy chart */}
                    <section className="space-y-4">
                        <Occupancy date={selectedDate} />
                    </section>

                    {/* Demographics */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Demographics
                        </h2>
                        <DemographicsChart date={selectedDate} />
                    </section>
                </main>
            </div>
        </div>
    );
}
