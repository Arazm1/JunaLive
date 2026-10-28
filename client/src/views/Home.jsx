import { useState } from "react";
import { useNavigate } from "react-router";


const Home = () => {

    const [station, setStation] = useState('');
    const navigate = useNavigate();



    const handleSearch = () =>{
        if(!station.trim()){
            return;
        }

        navigate(`/station/${station.trim().toLowerCase()}`);
    }


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="h-16 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                    <h1 className="text-xl font-semibold">
                        JunaLive
                    </h1>
                </div>

            </header>


            {/*Main section*/}
            <main className="flex flex-1 items-center justify-center px-6">
                <div className="w-full max-w-2xl text-center">
                    <h2 className="text-lg font-bold tracking-tight sm:text-5xl">
                        Find your station
                    </h2>

                    <p className="mt-4 text-base text-gray-700">
                        Search for a station to see live train departures and arrivals.
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

                </div>

            </main>

            {/*Footer*/}
            <footer className="h-16 border-t border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                    <p>Built for learning purposes. Data provided by <a href="https://www.digitraffic.fi/" target="_blank" rel="noopener noreferrer">Digitraffic</a></p>
                </div>

            </footer>
            
        </div>
        
    );
    };

export default Home;