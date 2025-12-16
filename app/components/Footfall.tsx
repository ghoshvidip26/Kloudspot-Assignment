import { api } from "../utils/api";
import { sitesStore } from "../utils/utils";
import { useEffect, useState } from "react";
import AnalyticsExample from "./AnalyticsExample";

const Footfall = () => {
    const [siteId, setSiteId] = useState<string | null>(null);
    const [footfallData, setFootfallData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.getSites().then((res) => {
            sitesStore.getState().setSites(res.data);
            setSiteId(res.data?.[0]?.siteId);
        });
    }, []);


    useEffect(() => {
        if (!siteId) return;

        const now = Date.now();
        const yesterday = now - 24 * 60 * 60 * 1000;

        api
            .getFootfall(siteId, yesterday, now)
            .then((res) => setFootfallData(res.data))
            .finally(() => setLoading(false));
    }, [siteId]);
    console.log("Footfall Data: ", footfallData)
    return (
        <div>
            <h1>Footfall</h1>
            <p>{footfallData?.footfall}</p>
            <AnalyticsExample />
        </div>
    )
}

export default Footfall