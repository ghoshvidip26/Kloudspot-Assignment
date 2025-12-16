import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { sitesStore } from "../utils/utils";

const Footfall = () => {
    const selectedSiteId = sitesStore((s) => s.selectedSiteId);
    const loadSites = sitesStore((s) => s.loadSites);

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        loadSites();
    }, []);

    useEffect(() => {
        if (!selectedSiteId) return;

        const now = Date.now();
        const yesterday = now - 86400000;

        api.getFootfall(selectedSiteId, yesterday, now).then((res) => {
            setData(res.data);
        });
    }, [selectedSiteId]);

    return (
        <div>
            <h1>Footfall</h1>
            <p>{data?.footfall ?? "-"}</p>
        </div>
    );
};

export default Footfall;
