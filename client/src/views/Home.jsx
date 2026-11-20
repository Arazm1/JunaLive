//import { useState } from "react";
//import { useNavigate } from "react-router";

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
            
        </div>
        
    );
    };

export default Home;