import { useMemo, useState } from "react";
import { addDays, helsinkiToday } from "../../utils/dates";
import { useClosingList, useStations } from "../../hooks/apiHooks";
import { trainBadgeStyle } from "../../utils/trainColors";


const SearchClosingTrains = () =>{

    
    const today = helsinkiToday();
    const tomorrow = addDays(today, 1);

    const [date, setDate] = useState(today);
    const [selected, setSelected] = useState(null);

    const { namesByCode } = useStations();
    const { trains, loading, error } = useClosingList(date);


    const stationCodes = useMemo(
        () => [...new Set(trains.map((t) => t.stationCode))].sort(),
        [trains]
    );
    const stationCode = stationCodes.includes(selected) ? selected : stationCodes[0];

    const visible = useMemo(
        () =>
            trains
                .filter((t) => t.stationCode === stationCode)
                .sort((a, b) => a.trainCode - b.trainCode),
        [trains, stationCode]
    );


    const stationName = (code) => (namesByCode[code] ?? code).replace(/ asema$/i, "");
    
    


    const chip = (active) =>
        `h-10 rounded-full border px-4 font-medium ${
            active
                ? "border-gray-700 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        }`;

    return(
        <div>
            {/* Header */}
            <header className="h-16 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                    <h1 className="text-xl font-semibold">
                        JunaLive
                    </h1>
                </div>
            </header>


            {/* Main section */}
            <main>
                <div>
                    <h2>
                        Find the closing trains by date
                    </h2>

                    <p>
                        Enter the date
                    </p>

                    {/* Date (from/to) */}
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        {/*From button*/}
                        <button
                            onClick={() => setDate(today)}
                            className={chip(date === today)}
                        >Today
                        </button>

                        {/*To button*/}
                        <button
                            onClick={() => setDate(tomorrow)}
                            className={chip(date === tomorrow)}
                        >Tomorrow
                        </button>

                        <input 
                            type="date"
                            value={date}
                            onChange={(e) => e.target.value && setDate(e.target.value)}
                            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                        />
                    </div>


                    {/*Stations */}
                    {stationCodes.length > 1 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {stationCodes.map((code) => (
                                <button
                                    key={code}
                                    onClick={() => setSelected(code)}
                                    className={chip(code === stationCode)}
                                >
                                    {stationName(code)}
                                </button>
                            ))}
                        </div>
                    )}

                    {stationCode && (
                        <p
                            className="mt-6 text-gray-500"   
                        >
                        {stationName(stationCode)} · {visible.length} trains
                        </p>
                    )}

                    {loading && <p className="mt-6 text-gray-500">Loading…</p>}
                    {error && <p className="mt-6 text-red-600">{error}</p>}
                    {!loading && !error && trains.length === 0 && (
                        <p className="mt-6 text-gray-500">No closing trains for this day.</p>
                    )}


                    {/* List */}
                    {visible.length > 0 && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
                            {visible.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:px-5"
                                >
                                    <div className="w-14 shrink-0 text-lg font-semibold text-gray-400 sm:w-20">
                                        —
                                    </div>

                                    <div className="shrink-0">
                                        <div
                                            className={`inline-block rounded-full border px-3 py-1 font-medium ${trainBadgeStyle({
                                                commuterLine: t.trainLine,
                                            })}`}
                                        >
                                            {t.trainLine || "—"}
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-medium text-gray-500">{t.trainCode}</div>
                                    </div>

                                    <div className="w-8 shrink-0 text-right text-xl font-bold text-gray-400 sm:w-12">
                                        —
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>


            {/*Footer*/}
            <footer className="h-16 border-t border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                    <p>Built for learning purposes. Data provided by <a href="https://www.digitraffic.fi/" target="_blank" rel="noopener noreferrer">Digitraffic</a></p>
                </div>
            </footer>
        </div>
    )



}

export default SearchClosingTrains;