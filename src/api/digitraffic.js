const BASE = import.meta.env.VITE_API_URL;
const HEADERS = { "Digitraffic-User": "JunaLive/0.1" };

async function get(path) {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    if (!res.ok) throw new Error(`Digitraffic ${res.status}`);
    return res.json();
}

let stationsCache = null;

export async function getStations() {
    if (!stationsCache) {
        stationsCache = await get("/metadata/stations");
    }
    return stationsCache;
}

export function findStation(stations, query) {
    const q = query.trim().toLowerCase();

    // exact short code (HKI), then exact name, then "starts with"
    // (names look like "Helsinki asema", "Tampere asema")
    return (
        stations.find((s) => s.stationShortCode.toLowerCase() === q) ||
        stations.find((s) => s.stationName.toLowerCase().replace(/ asema$/, "") === q) ||
        stations.find((s) => s.passengerTraffic && s.stationName.toLowerCase().startsWith(q))
    );
}

export function getLiveTrains(code, type) {
    const params =
        type === "departures"
            ? "arrived_trains=0&arriving_trains=0&departed_trains=0&departing_trains=20"
            : "arrived_trains=0&arriving_trains=20&departed_trains=0&departing_trains=0";

    return get(`/live-trains/station/${code}?${params}&include_nonstopping=false`);
}

export function getComposition(date, trainNumber) {
    return get(`/compositions/${date}/${trainNumber}`);
}