import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../api/backend";
import { useStations } from "../../hooks/apiHooks";
import { currentNightStart, nightWindow, prettyDay } from "../../utils/dates";
import { trainBadgeStyle } from "../../utils/trainColors";

const fmt = (iso) =>
    new Date(iso).toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Helsinki",
    });

// windows are local Finnish times without a timezone, so show them as they are
const fmtWindow = (s) => `${prettyDay(s.slice(0, 10))} ${s.slice(11, 16)}`;
const keyOf = (c) => `${c.departureDate}_${c.trainCode}`;

const ShiftHandler = () => {
    const { stations, namesByCode } = useStations();

    // new shift form
    const [stationCode, setStationCode] = useState("HKI");
    const [night, setNight] = useState(currentNightStart());
    const [startTime, setStartTime] = useState("22:00");
    const [endTime, setEndTime] = useState("05:00");

    // data
    const [shifts, setShifts] = useState([]);
    const [shift, setShift] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [onlyMarked, setOnlyMarked] = useState(false);

    const stationName = (c) => (namesByCode[c] ?? c).replace(/ asema$/i, "");

    const loadShifts = useCallback(async () => {
        try {
            setShifts(await api("/shifts"));
        } catch (e) {
            setError(e.message);
        }
    }, []);

    useEffect(() => {
        loadShifts();
    }, [loadShifts]);

    // candidates for the selected shift, refreshed every minute
    useEffect(() => {
        if (!shift) return;
        let cancelled = false;

        async function load() {
            try {
                const data = await api(`/shifts/${shift.id}/candidates`);
                if (!cancelled) {
                    setCandidates(data);
                    setError(null);
                }
            } catch (e) {
                if (!cancelled) setError(e.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        setLoading(true);
        setCandidates([]);
        load();
        const id = setInterval(load, 60000);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [shift]);

    const createShift = async () => {
        const { from, to } = nightWindow(night, startTime, endTime);
        try {
            const created = await api("/shifts", {
                method: "POST",
                body: { stationCode: stationCode.trim().toUpperCase(), windowStart: from, windowEnd: to },
            });
            setShift(created);
            loadShifts();
        } catch (e) {
            setError(e.message);
        }
    };

    const toggle = async (c) => {
        const k = keyOf(c);
        const setMarked = (value) =>
            setCandidates((prev) => prev.map((x) => (keyOf(x) === k ? { ...x, mandatory: value } : x)));

        setMarked(!c.mandatory);   // optimistic
        try {
            if (c.mandatory) {
                await api(`/shifts/${shift.id}/trains/${c.departureDate}/${c.trainCode}`, { method: "DELETE" });
            } else {
                await api(`/shifts/${shift.id}/trains`, {
                    method: "PUT",
                    body: { departureDate: c.departureDate, trainCode: c.trainCode, trainLine: c.trainLine },
                });
            }
        } catch (e) {
            setMarked(c.mandatory);   // revert
            setError(e.message);
        }
    };

    const markedCount = candidates.filter((c) => c.mandatory).length;
    const visible = useMemo(
        () => (onlyMarked ? candidates.filter((c) => c.mandatory) : candidates),
        [candidates, onlyMarked]
    );

    const input = "h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm";
    const chip = (active) =>
        `h-10 rounded-full border px-4 font-medium ${
            active ? "border-gray-700 bg-gray-700 text-white"
                   : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        }`;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="h-16 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                    <h1 className="text-xl font-semibold">JunaLive</h1>
                </div>
            </header>

            <main className="px-4 py-8 sm:px-6 sm:py-12">
                <div className="mx-auto w-full max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Control room</h2>
                    <p className="mt-2 text-gray-500">Plan the closing list</p>

                    {error && <p className="mt-4 text-red-600">{error}</p>}

                    {/* Existing shifts */}
                    {shifts.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-700">Upcoming shifts</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {shifts.map((s) => (
                                    <button key={s.id} onClick={() => setShift(s)} className={chip(shift?.id === s.id)}>
                                        {stationName(s.stationCode)} · {fmtWindow(s.windowStart)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New shift */}
                    <details className="mt-6 rounded-xl border border-gray-200 bg-white p-4" open={shifts.length === 0}>
                        <summary className="cursor-pointer font-medium">New shift</summary>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <input
                                list="station-codes"
                                value={stationCode}
                                onChange={(e) => setStationCode(e.target.value)}
                                placeholder="Station (HKI)"
                                className={`${input} w-32 uppercase`}
                            />
                            <datalist id="station-codes">
                                {stations
                                    .filter((s) => s.passengerTraffic)
                                    .map((s) => (
                                        <option key={s.stationShortCode} value={s.stationShortCode}>
                                            {stationName(s.stationShortCode)}
                                        </option>
                                    ))}
                            </datalist>

                            <input type="date" value={night} onChange={(e) => e.target.value && setNight(e.target.value)} className={input} />
                            <input type="time" value={startTime} onChange={(e) => e.target.value && setStartTime(e.target.value)} className={input} />
                            <span>→</span>
                            <input type="time" value={endTime} onChange={(e) => e.target.value && setEndTime(e.target.value)} className={input} />
                        </div>

                        <button
                            onClick={createShift}
                            className="mt-4 h-10 rounded-lg bg-gray-700 px-4 text-white hover:bg-gray-800"
                        >
                            Create shift
                        </button>
                    </details>

                    {/* Candidates */}
                    {shift && (
                        <>
                            <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-xl font-semibold">{stationName(shift.stationCode)}</h3>
                                    <p className="text-sm text-gray-500">
                                        {fmtWindow(shift.windowStart)} → {fmtWindow(shift.windowEnd)} · {markedCount} marked
                                    </p>
                                </div>
                                <button onClick={() => setOnlyMarked(!onlyMarked)} className={chip(onlyMarked)}>
                                    Marked only
                                </button>
                            </div>

                            {loading && <p className="mt-6 text-gray-500">Loading…</p>}
                            {!loading && !error && candidates.length === 0 && (
                                <p className="mt-6 text-gray-500">No trains found for this window.</p>
                            )}

                            {visible.length > 0 && (
                                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
                                    {visible.map((c) => (
                                        <button
                                            key={keyOf(c)}
                                            onClick={() => toggle(c)}
                                            className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-4 text-left last:border-b-0 sm:px-5 ${
                                                c.mandatory ? "bg-green-50" : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <div
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border text-sm ${
                                                    c.mandatory ? "border-green-600 bg-green-600 text-white" : "border-gray-300 bg-white"
                                                }`}
                                            >
                                                {c.mandatory && "✓"}
                                            </div>

                                            <div className="w-14 shrink-0 text-lg font-semibold sm:w-20">
                                                {fmt(c.scheduledArrival)}
                                            </div>

                                            <div className="shrink-0">
                                                <div className={`inline-block rounded-full border px-3 py-1 font-medium ${trainBadgeStyle({ commuterLine: c.trainLine })}`}>
                                                    {c.trainLine || c.trainCode}
                                                </div>
                                            </div>

                                            <div className="min-w-0 flex-1 text-xs font-medium text-gray-500">{c.trainCode}</div>

                                            <div className="w-8 shrink-0 text-right text-xl font-bold sm:w-12">
                                                {c.platform || "—"}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ShiftHandler;