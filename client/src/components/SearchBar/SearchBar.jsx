import { useState } from "react"
import { useStations } from "../../hooks/apiHooks"
import { useNavigate } from "react-router";


/**
     * Function to allow lowercases and strips diacritics
     */
const normalize = (s) => {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};


const cleanName = (name) => name.replace(/ asema$/i, "");


const SearchBar = () => {
    const [search, setSearch] = useState("")
    //const [searchData, setSearchData] = useState([])

    const navigate = useNavigate();
    const { stations } = useStations();


    //TODO: Change to global one
    const handleChange = e => {
        setSearch(e.target.value);
    };

    const handleClose = () => {
        setSearch("")
        //setSearchData([])
    };

    const handleSelect = (station) => {
        navigate(`/station/${station.stationShortCode.toLowerCase()}`);
        handleClose();
    };

    const q = normalize(search.trim());

    const suggestions = q
        ? stations
                .filter((s) => s.passengerTraffic)
                .filter(
                    (s) =>
                        normalize(cleanName(s.stationName)).includes(q) ||
                    s.stationShortCode.toLowerCase().startsWith(q)
                )
                .sort((a, b) => {
                    const aStarts = normalize(cleanName(a.stationName)).startsWith(q) ? 0 : 1;
                  const bStarts = normalize(cleanName(b.stationName)).startsWith(q) ? 0 : 1;
                  return aStarts - bStarts || a.stationName.localeCompare(b.stationName, "fi");
                })
                .slice(0, 8)
        : [];

    const handleKeyDown = (e) =>{
        if(e.key === "Enter" && suggestions.length > 0){
            handleSelect(suggestions[0]);
        }
        if(e.key === "Escape"){
            handleClose();
        }
    };


    return(
        <div className="relative">
            <input
                type="text"
                value={search}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for a station..."
                className="h-14 w-full rounded-xl border border-gray-300 bg-white px-5 pr-12 text-base shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />

            {search && (
                <button
                    onClick={handleClose}
                    aria-label="Clear"
                    className="absolute right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:text-gray-700"
                >
                    ✕
                </button>
            )}

            {suggestions.length > 0 && (
                <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-lg">
                    {suggestions.map((s) => (
                        <li
                            key={s.stationShortCode}
                            onClick={() => handleSelect(s)}
                            className="flex cursor-pointer items-center justify-between px-5 py-3 hover:bg-gray-100"
                        >
                            <span className="text-gray-900">{cleanName(s.stationName)}</span>
                            <span className="text-xs font-medium text-gray-400">
                                {s.stationShortCode}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;