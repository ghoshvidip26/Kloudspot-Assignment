"use client"
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { sitesStore } from "../utils/utils";

interface Entry {
    personId: number;
    personName: string;
    avatar: string;
    gender: "Male" | "Female";
    entryLocal: string;
    exitLocal: string;
    dwellMinutes: string;
}

const CrowdEntriesTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [siteId, setSiteId] = useState<string | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const itemsPerPage = 10;

    useEffect(() => {
        api.getSites().then((res) => {
            sitesStore.getState().setSites(res.data);
            setSiteId(res.data?.[0]?.siteId);
        });
    }, []);

    //   Fetch crowd entries
    useEffect(() => {
        const now = Date.now();
        const yesterday = now - 24 * 60 * 60 * 1000;
        if (siteId) {
            api.getCrowdEntries(siteId, yesterday, now, itemsPerPage, currentPage).then((res) => {
                setEntries(res.data.records);
            });
        }
    }, [siteId]);
    const totalPages = Math.ceil(entries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    console.log("Entries: ", entries);

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Sex</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Entry</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Exit</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Dwell Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">
                                    No entries found
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry, index) => (
                                <tr
                                    key={entry.personId}
                                    className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                        }`}
                                >
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={entry.avatar}
                                                alt={entry.personName}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {entry.personName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-sm text-gray-600">
                                        {entry.gender}
                                    </td>
                                    <td className="py-3 px-6 text-sm text-gray-600">
                                        {entry.entryLocal}
                                    </td>
                                    <td className="py-3 px-6 text-sm text-gray-600">
                                        {entry.exitLocal}
                                    </td>
                                    <td className="py-3 px-6 text-sm text-gray-600">
                                        {entry.dwellMinutes}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${currentPage === i + 1
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CrowdEntriesTable;