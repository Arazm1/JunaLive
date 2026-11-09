// src/views/Closing.jsx
import { useEffect, useMemo, useState } from "react";
import { useStations, useClosingRange } from "../../hooks/apiHooks";
import { currentNightStart, nightWindow, prettyDay } from "../../utils/dates";
import { trainBadgeStyle } from "../../utils/trainColors";

function useNow(ms = 30000) {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), ms);
        return () => clearInterval(id);
    }, [ms]);
    return now;
}

const Closing = () => {
    const tonight = currentNightStart();
    const [night, setNight] = useState(tonight);
    const [startTime, setStartTime] = useState("20:00");
    const [endTime, setEndTime] = useState("10:00");

    const [selected, setSelected] = useState(null);
    const now = useNow();

    const { from, to, endDate } = nightWindow(night, startTime, endTime);
    const { trains, loading, error } = useClosingRange(from, to);
    const { namesByCode } = useStations();

    const stationCodes = useMemo(
        () => [...new Set(trains.map((t) => t.stationCode))].sort(),
        [trains]
    );
    const stationCode = stationCodes.includes(selected) ? selected : stationCodes[0];
    const visible = useMemo(() => trains.filter((t) => t.stationCode === stationCode), [trains, stationCode]);

    const fmt = (iso) =>
        new Date(iso).toLocaleTimeString("en-GB", {
            hour: "2-digit", minute: "2-digit", timeZone: "Europe/Helsinki",
        });

    const scheduled = (t) => (t.arrivalTime ? new Date(`${t.date}T${t.arrivalTime}`) : new Date(0));
    const effective = (t) => (t.actualArrival ? new Date(t.actualArrival) : scheduled(t));

    //const arrival = (t) => new Date(`${t.date}T${t.arrivalTime}`);
    const nextId = visible.find((t) => effective(t) >= now)?.id;

    const stationName = (c) => (namesByCode[c] ?? c).replace(/ asema$/i, "");
    const chip = (active) =>
        `h-10 rounded-full border px-4 font-medium ${
            active ? "border-gray-700 bg-gray-700 text-white"
                   : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        }`;



    

    return (
        <div className="min-h-screen bg-white">
            <header className="h-16 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                    <h1 className="text-xl font-semibold">JunaLive</h1>
                </div>
            </header>

            <main className="px-4 py-8 sm:px-6 sm:py-12">
                <div className="mx-auto w-full max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Closing trains</h2>

                    {/* Night picker */}
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <button onClick={() => setNight(tonight)} className={chip(night === tonight)}>
                            Tonight
                        </button>
                        {/*}
                        <button onClick={() => setNight(addDays(tonight, 1))} className={chip(night === addDays(tonight, 1))}>
                            Tomorrow night
                        </button>
                        */}
                        <input
                            type="date"
                            value={night}
                            onChange={(e) => e.target.value && setNight(e.target.value)}
                            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                        />
                        
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                        {prettyDay(night)} {startTime} → {prettyDay(endDate)} {endTime}
                    </p>

                    <details className="mt-2 text-sm text-gray-600">
                        <summary className="cursor-pointer">Adjust hours</summary>
                        <div className="mt-2 flex items-center gap-2">
                            <input type="time" value={startTime} onChange={(e) => e.target.value && setStartTime(e.target.value)}
                                   className="h-10 rounded-lg border border-gray-300 bg-white px-3" />
                            <span>→</span>
                            <input type="time" value={endTime} onChange={(e) => e.target.value && setEndTime(e.target.value)}
                                   className="h-10 rounded-lg border border-gray-300 bg-white px-3" />
                        </div>
                    </details>

                    {/* Stations */}
                    {stationCodes.length > 1 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {stationCodes.map((c) => (
                                <button key={c} onClick={() => setSelected(c)} className={chip(c === stationCode)}>
                                    {stationName(c)}
                                </button>
                            ))}
                        </div>
                    )}

                    {stationCode && (
                        <p className="mt-6 text-gray-500">
                            {stationName(stationCode)} · {visible.length} trains
                        </p>
                    )}

                    {loading && <p className="mt-6 text-gray-500">Loading…</p>}
                    {error && <p className="mt-6 text-red-600">{error}</p>}
                    {!loading && !error && trains.length === 0 && (
                        <p className="mt-6 text-gray-500">No closing trains for this night.</p>
                    )}

                    {/* List */}
                    {visible.length > 0 && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
                            {visible.map((t) => {
                                const past = effective(t) < now;
                                const wagons = t.wagons ?? [];

                                return (
                                    <div
                                        key={t.id}
                                        className={`flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:flex-nowrap sm:px-5 ${
                                            past ? "opacity-40" : ""
                                        } ${t.id === nextId ? "bg-amber-50" : ""}`}
                                    >
                                        {/* Time */}
                                        <div className="w-14 shrink-0 sm:w-20">
                                            <div className={`text-lg font-semibold ${t.cancelled ? "text-gray-400 line-through" : ""}`}>
                                                {t.found && t.actualArrival ? fmt(t.actualArrival) : t.arrivalTime?.slice(0, 5)}
                                            </div>
                                            {t.delayMinutes > 0 && (
                                                <div className="text-xs text-red-600">+{t.delayMinutes} min</div>
                                            )}
                                            {!t.found && <div className="text-xs text-gray-400">not found</div>}
                                            {t.id === nextId && <div className="text-xs text-amber-700">next</div>}
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

export default Closing;