import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { findStation } from "../api/digitraffic";
import { useStations, useLiveTrains, useWagons } from "../hooks/apiHooks";
import { trainBadgeStyle } from "../utils/trainColors";


const Station = () =>{

    const { stationName } = useParams();
    const navigate = useNavigate();

    const [option, setOption] = useState('departures');
    const [isOpen, setIsOpen] = useState(false);

    const [station, setStation] = useState('');
    

    //const stationDisplay = 'Helsinki';

    const { stations, namesByCode, error: stationsError } = useStations();

    const stationInfo = useMemo(() => (stations.length ? findStation(stations, stationName) : null),
                                        [stations, stationName]);
    
    const notFound = stations.length > 0 && !stationInfo;

    const { trains, loading, error } = useLiveTrains(
        stationInfo?.stationShortCode,
        option,
        namesByCode
    );

    const getWagons = useWagons(trains);

    const stationDisplay = stationInfo
        ? stationInfo.stationName.replace(/ asema$/i, "")
        : stationName;

    const errorMessage = stationsError || error || (notFound && `Station "${stationName}" not found`);


    
    const handleSearch = () =>{
        if(!station.trim()){
            return;
        }
        navigate(`/station/${station.trim().toLowerCase()}`);
    }


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


        {/*Main section*/}
        <main className="flex-1 px-6 py-12">

            <div className="mx-auto w-full max-w-2xl">

                {/* Selected Station name */}
                <h2 className="text-lg font-bold tracking-tight sm:text-5xl">
                    {stationDisplay}
                </h2>


                <p className="mt-2 text-gray-500">
                    Train departures and arrivals
                </p>

                <div className="mt-8">
                        <div className="relative">
                            <input 
                            type="text"
                            value={station}
                            onChange={(e) => setStation(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key == 'Enter'){
                                    handleSearch();
                                }
                            }}

                            placeholder="Search for a station..."
                            className="h-14 w-full rounded-xl border border-gray-300 bg-white px-5 pr-12 text-base shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                            />

                            <button
                                onClick={handleSearch}
                                className="absolute right-2 top-2 flex h-10 w-20 items-center justify-center rounded-lg bg-gray-700 text-white transition hover:bg-gray-800"
                                aria-label="Search"
                            >
                                Search
                            </button>
                        </div>

                    </div>


                    {/* Selector (Departures/Arrivals) */}
                    <div className="relative mt-4">

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex h-14 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-5 text-left shadow-sm transition hover:border-gray-400"
                        >
                            <span className="font-medium">
                                {option == "departures"
                                    ? "Departures"
                                    : "Arrivals"}
                            </span>

                             <span className="text-gray-500">
                                {isOpen ? "▲" : "▼"}
                            </span>

                        </button>

                        {/*Dropdown (Departures/Arrivals */}
                        {isOpen && (
                            <div
                            className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                            >

                                <button
                                onClick={() => {
                                    setOption('departures');
                                    setIsOpen(false);
                                }}
                                className="w-full px-5 py-3 text-left hover:bg-gray-50"
                                >
                                    Departures
                                </button>

                                <button
                                    onClick={() => {
                                        setOption("arrivals");
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-5 py-3 text-left hover:bg-gray-50"
                                >
                                    Arrivals
                                </button>

                            </div>
                        )}
                    </div>



                    {loading && <p className="mt-6 text-gray-500">Loading…</p>}
                    {errorMessage && <p className="mt-6 text-red-600">{errorMessage}</p>}
                    {!loading && !errorMessage && trains.length === 0 && (
                        <p className="mt-6 text-gray-500">No trains found.</p>
                    )}
                    {/*Train list */}
                    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">

                        {trains.map((train) =>{
                            const wagons = getWagons(train.id);

                            return(
                                <div
                                    key={train.id}
                                    className="flex items-center border-b border-gray-100 px-5 py-4 last:border-b-0 hover:bg-gray-50"
                                >

                                    {/* Time */}
                                    <div className="w-20">
                                        <div className={`text-lg font-semibold ${train.cancelled ? "text-gray-400 line-through" : ""}`}>
                                            {train.time}
                                        </div>
                                        {train.delayMinutes > 0 && (
                                            <div className="text-xs text-red-600">
                                                +{train.delayMinutes} min
                                            </div>
                                        )}
                                    </div>

                                    


                                    {/* Train */}
                                    <div className="p-2">
                                        <div className={`font-medium border rounded-full px-3 py-1 inline-block ${trainBadgeStyle(train)}`}>
                                            {train.train}
                                        </div>
                                    </div>


                                    {/* Destination (origin for arrivals) */}
                                    <div className="flex-1">
                                        <div className="text-gray-700">{train.destination}</div>
                                    </div>

                                    {/* Runkolinja + Wagons */}
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        <div className="text-xs font-medium text-gray-500">
                                            {train.trainNumber}
                                        </div>

                                        <div className="flex flex-wrap justify-end gap-1">
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
                                    </div>


                                    {/* Platform */}
                                    <div className="ml-auto w-12 shrink-0 text-right">
                                        <div className="text-xs text-gray-500"></div>
                                        <div className="text-xl font-bold">
                                            {train.platform || "—"}
                                        </div>
                                    </div>

                                </div>

                            );
                        })}
                    </div>
            </div>
        </main>





        {/*Footer*/}
        <footer className="h-16 border-t border-gray-200 bg-white">
            <div className="mx-auto flex h-full max-w-7xl items-center px-6">

            </div>

        </footer>
    </div>
    );

};

export default Station;