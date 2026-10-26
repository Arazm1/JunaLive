import { useState } from "react";
import { useNavigate } from "react-router";


const mockTrains = [
    {
        time: "16:18",
        train: "IC 25",
        destination: "Tampere",
        platform: "3",
    },
    {
        time: "16:27",
        train: "P 32",
        destination: "Riihimäki",
        platform: "5",
    },
    {
        time: "16:40",
        train: "R 964",
        destination: "Lahti",
        platform: "4",
    },
    {
        time: "16:52",
        train: "IC 47",
        destination: "Oulu",
        platform: "7",
    },
    {
        time: "17:03",
        train: "Z 984",
        destination: "Lahti",
        platform: "5",
    },
];


const Station = () =>{


    const [option, setOption] = useState('departures');
    const [isOpen, setIsOpen] = useState(false);

    const [station, setStation] = useState('');
    const navigate = useNavigate();

    const stationDisplay = 'Helsinki';


    
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



                    {/*Train list */}
                    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">

                        {mockTrains.map((train, index) => (
                            <div
                                key={index}
                                className="flex items-center border-b border-gray-100 px-5 py-4 last:border-b-0 hover:bg-gray-50"
                            >

                                {/* Time */}
                                <div className="w-20 text-lg font-semibold">
                                    {train.time}
                                </div>


                                {/* Train */}
                                <div className="w-24">
                                    <div className="font-medium">
                                        {train.train}
                                    </div>
                                </div>


                                {/* Destination */}
                                <div className="flex-1">
                                    <div className="text-gray-700">
                                        {option == "departures"
                                            ? train.destination
                                            : "Helsinki"}
                                    </div>
                                </div>


                                {/* Platform */}
                                <div className="text-sm text-gray-500">
                                    Platform {train.platform}
                                </div>

                            </div>
                        ))}
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