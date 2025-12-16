"use client";

import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { sitesStore } from "../utils/utils";

interface Entry {
    personId: string;
    personName: string;
    gender: string;
    entryLocal: string | null;
    exitLocal: string | null;
    dwellMinutes: number | null;
}

const ITEMS_PER_PAGE = 10;

const CrowdEntriesTable = () => {
    const selectedSiteId = sitesStore((s) => s.selectedSiteId);

    const [entries, setEntries] = useState<Entry[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const parseDDMMYYYY = (value: string) => {
        const [date, time] = value.split(" ");
        const [dd, mm, yyyy] = date.split("/");
        return new Date(`${yyyy}-${mm}-${dd}T${time}`);
    };

    useEffect(() => {
        if (!selectedSiteId) return;

        const fetchEntries = async () => {
            try {
                setLoading(true);

                const now = Date.now();
                const yesterday = now - 24 * 60 * 60 * 1000;

                const res = await api.getCrowdEntries(
                    selectedSiteId,
                    yesterday,
                    now,
                    ITEMS_PER_PAGE,
                    page
                );

                setEntries(res.data.records); // ✅ FIX
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, [selectedSiteId, page]);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <>
            <div className="bg-white rounded shadow">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-[#E8E8E8] text-gray-800">
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3">Gender</th>
                            <th className="px-4 py-3">Entry</th>
                            <th className="px-4 py-3">Exit</th>
                            <th className="px-4 py-3">Dwell</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((e) => (
                            <tr key={e.personId} className="border-t border-[#1A1A1A1A] text-gray-500">
                                <td className="px-4 py-3">{e.personName}</td>
                                <td className="px-4 py-3 text-center">{e.gender.charAt(0).toUpperCase() + e.gender.slice(1)}</td>
                                <td className="px-4 py-3 text-center">
                                    {e.entryLocal
                                        ? parseDDMMYYYY(e.entryLocal).toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                        })
                                        : "-"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {e.exitLocal
                                        ? parseDDMMYYYY(e.exitLocal).toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                        })
                                        : "-"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {e.dwellMinutes ?? "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center gap-2 py-4 text-gray-500">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    ◀
                </button>
                <span>
                    {page} / {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    ▶
                </button>
            </div>
        </>
    );
};

export default CrowdEntriesTable;
