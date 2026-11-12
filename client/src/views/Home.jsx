//import { useState } from "react";
//import { useNavigate } from "react-router";

import logo from "../assets/logo.png";
import { Link } from "react-router";
import SearchBar from "../components/SearchBar/SearchBar.jsx";


const Home = () => {

    //const [station, setStation] = useState('');
    //const navigate = useNavigate();



    /*
    const handleSearch = () =>{
        if(!station.trim()){
            return;
        }

        navigate(`/station/${station.trim().toLowerCase()}`);
    }
        */


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="h-16 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <img
                            src={logo}
                            alt="JunaLive Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <h1 className="text-xl font-semibold">
                            JunaLive
                        </h1>
                    </Link>
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
                        <SearchBar />
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