import fetchData from "../utils/fetchData";

const BASE = import.meta.env.VITE_API_URL;
const HEADERS = { "Digitraffic-User": "JunaLive/0.1" };


// Wrapper function to inject Digitraffic specific URL and headers
const get = async(path) =>{
    return await fetchData(`${BASE}${path}`, { headers: HEADERS });
}

let stationsCache = null;


const getStations = async () =>{
    if(!stationsCache){
        stationsCache = await get("/metadata/stations");
    }
    return stationsCache;

}

const findStation = (stations, query) =>{
    const q = query.trim().toLowerCase();

    // exact short code (HKI), then exact name, then "starts with"
    // (names look like "Helsinki asema", "Tampere asema")
    return(
        stations.find((s) => s.stationShortCode.toLowerCase() == q) ||
        stations.find((s) => s.stationName.toLowerCase().replace(/ asema$/, "") == q) ||
        stations.find((s) => s.passengerTraffic && s.stationName.toLowerCase().startsWith(q))
    );
}

const getLiveTrains = (code, type) =>{
    const params = 
        type == 'departures' 
                        ? "arrived_trains=0&arriving_trains=0&departed_trains=0&departing_trains=20"
                        : "arrived_trains=0&arriving_trains=20&departed_trains=0&departing_trains=0";

    return get(`/live-trains/station/${code}?${params}&include_nonstopping=false`);
}


const getComposition = (date, trainNumber) =>{
    return get(`/compositions/${date}/${trainNumber}`);
}

export {
    getStations,
    findStation,
    getLiveTrains,
    getComposition
};