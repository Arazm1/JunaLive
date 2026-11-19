import { useEffect, useState } from "react";
import { useStations, useMandatoryCheckTrains } from "../../hooks/apiHooks";
import { prettyDay } from "../../utils/dates";
import { trainBadgeStyle } from "../../utils/trainColors";

function useNow(ms = 30000) {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), ms);
        return () => clearInterval(id);
    }, [ms]);
    return now;
}

const fmt = (iso) =>
    new Date(iso).toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Helsinki",
    });

// windowStart/windowEnd are local Finnish times without a timezone, so show them as they are
const fmtWindow = (s) => `${prettyDay(s.slice(0, 10))} ${s.slice(11, 16)}`;

const MandatoryCheckTrains = () => {
    //const { data, loading, error, updatedAt } = useMandatoryCheckTrains();

    const { getMandatoryCheckTrains } = useMandatoryCheckTrains();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(null);


    const { namesByCode } = useStations();
    const now = useNow();



    useEffect(() => {
        let cancelled = false;

        const loadMarkedTrains = async () => {
            try{
                const result = await getMandatoryCheckTrains();

                if(!cancelled){
                    setData(result);
                    setError(null);
                    setUpdatedAt(new Date());
                }
            }
            catch(e){
                if(!cancelled){
                    setError(e.message);
                }
            }
            finally{
                if(!cancelled){
                    setLoading(false);
                }
            }
        };
        loadMarkedTrains();

        // Every 30sec --> reloads
        const id = setInterval(loadMarkedTrains, 30000);

        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [getMandatoryCheckTrains]);





    const trains = data?.trains ?? [];
    const stationName = data
        ? (namesByCode[data.stationCode] ?? data.stationCode).replace(/ asema$/i, "")
        : "";

    const arrival = (t) => (t.found ? new Date(t.actualArrival) : null);
    const nextCode = trains.find((t) => t.found && arrival(t) >= now)?.trainCode;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="h-16 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                    <h1 className="text-xl font-semibold">JunaLive</h1>
                </div>
            </header>

            <main className="px-4 py-8 sm:px-6 sm:py-12">
                <div className="mx-auto w-full max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                        {stationName || "Closing trains"}
                    </h2>
                    <p className="mt-2 text-gray-500">Mandatory check trains</p>

                    {data?.windowStart && (
                        <p className="mt-3 text-sm text-gray-500">
                            {fmtWindow(data.windowStart)} → {fmtWindow(data.windowEnd)}
                            {!data.active && " · not started yet"}
                        </p>
                    )}
                    {updatedAt && (
                        <p className="text-xs text-gray-400">
                            Updated {updatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Helsinki" })}
                        </p>
                    )}

                    {loading && <p className="mt-6 text-gray-500">Loading…</p>}
                    {error && <p className="mt-6 text-red-600">{error}</p>}
                    {data && !data.windowStart && (
                        <p className="mt-6 text-gray-500">No closing list for your station.</p>
                    )}
                    {data?.windowStart && trains.length === 0 && (
                        <p className="mt-6 text-gray-500">No mandatory trains have been marked yet.</p>
                    )}

                    {trains.length > 0 && (
                        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
                            {trains.map((t) => {
                                const past = t.found && arrival(t) < now;
                                const wagons = t.wagons ?? [];

                                return (
                                    <div
                                        key={t.trainCode}
                                        className={`flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:flex-nowrap sm:px-5 ${
                                            past ? "opacity-40" : ""
                                        } ${t.trainCode === nextCode ? "bg-amber-50" : ""}`}
                                    >
                                        {/* Time */}
                                        <div className="w-14 shrink-0 sm:w-20">
                                            <div className={`text-lg font-semibold ${t.cancelled ? "text-gray-400 line-through" : ""}`}>
                                                {t.found ? fmt(t.actualArrival) : "—"}
                                            </div>
                                            {t.delayMinutes > 0 && (
                                                <div className="text-xs text-red-600">+{t.delayMinutes} min</div>
                                            )}
                                            {!t.found && <div className="text-xs text-gray-400">not found</div>}
                                            {t.cancelled && <div className="text-xs text-red-600">cancelled</div>}
                                            {t.trainCode === nextCode && <div className="text-xs text-amber-700">next</div>}
                                        </div>

                                        {/* Train */}
                                        <div className="shrink-0">
                                            <div className={`inline-block rounded-full border px-3 py-1 font-medium ${trainBadgeStyle({ commuterLine: t.trainLine })}`}>
                                                {t.trainLine || t.trainCode}
                                            </div>
                                        </div>

                                        {/* Runkolinja */}
                                        <div className="min-w-0 flex-1 text-xs font-medium text-gray-500">
                                            {t.trainCode}
                                        </div>

                                        {/* Wagons */}
                                        <div className="order-last flex w-full flex-wrap justify-end gap-1 sm:order-none sm:w-auto sm:shrink-0">
                                            {wagons.length ? (
                                                wagons.map((number, i) => (
                                                    <div
                                                        key={`${number}-${i}`}
                                                        className="rounded-t-md rounded-b-sm border border-gray-400 px-2 py-1 text-xs font-semibold"
                                                    >
                                                        {number}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="rounded-t-md rounded-b-sm border border-gray-300 px-2 py-1 text-xs text-gray-400">
                                                    —
                                                </div>
                                            )}
                                        </div>

                                        {/* Platform */}
                                        <div className="w-8 shrink-0 text-right text-xl font-bold sm:w-12">
                                            {t.platform || "—"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MandatoryCheckTrains;