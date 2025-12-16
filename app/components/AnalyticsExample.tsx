"use client"
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { sitesStore } from "../utils/utils";

export default function AnalyticsExample() {
    const [dwellData, setDwellData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [siteId, setSiteId] = useState<string | null>(null);

    // First, load sites
    useEffect(() => {
        const loadSites = async () => {
            try {
                const response = await api.getSites();
                sitesStore.getState().setSites(response.data);
                // Set the first site as the selected one
                if (response.data && response.data.length > 0) {
                    setSiteId(response.data[0].siteId);
                }
            } catch (err) {
                console.error("Error loading sites:", err);
            }
        };
        loadSites();
    }, []);

    // Then, fetch dwell analytics when siteId is available
    useEffect(() => {
        if (!siteId) return; // Don't fetch if siteId is not set yet

        const fetchDwellAnalytics = async () => {
            console.log("Site ID: ", siteId);

            try {
                setLoading(true);
                setError(null);

                const now = Date.now();
                const yesterday = now - 24 * 60 * 60 * 1000;

                const response = await api.getDwellAnalytics(
                    siteId,
                    yesterday,
                    now
                );

                console.log("Dwell analytics:", response.data);
                setDwellData(response.data);
            } catch (err: any) {
                console.error("Error fetching dwell analytics:", err);
                setError(err.response?.data?.message || "Failed to fetch analytics data");
            } finally {
                setLoading(false);
            }
        };

        fetchDwellAnalytics();
    }, [siteId]); // Re-fetch when siteId changes

    if (loading) return <p>Loading analytics data...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(dwellData, null, 2)}
        </pre>
    );
}
