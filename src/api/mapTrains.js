export function mapTrain(train, stationCode, type, stationNames) {
    const rowType = type === "departures" ? "DEPARTURE" : "ARRIVAL";
    const rows = train.timeTableRows;

    const row = rows.find(
        (r) => r.stationShortCode === stationCode && r.type === rowType && r.commercialStop
    );
    if (!row) return null;

    const otherEnd = type === "departures" ? rows[rows.length - 1] : rows[0];
    const nameOf = (code) =>
        (stationNames[code] || code).replace(/ asema$/i, "");

    const iso = row.liveEstimateTime || row.scheduledTime;

    return {
        id: `${train.departureDate}-${train.trainNumber}`,
        departureDate: train.departureDate,
        trainNumber: train.trainNumber,
        time: new Date(iso).toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" }),
        scheduledTime: row.scheduledTime,
        delayMinutes: row.differenceInMinutes || 0,
        cancelled: train.cancelled || row.cancelled,
        // commuter trains: "P", "K"; others: "IC 25"
        train: train.commuterLineID || `${train.trainType} ${train.trainNumber}`,
        commuterLine: train.commuterLineID || null,
        destination: nameOf(otherEnd.stationShortCode), // origin for arrivals
        platform: row.commercialTrack || "",
        vaununumerot: [], // filled in after composition fetch
    };
}

// "94106004025-5" -> drop the check digit after the dash -> keep last 2 digits -> "25"
const shortWagonNumber = (n) => String(n).split("-")[0].slice(-2);

export function wagonNumbers(composition) {
    const sections = composition?.journeySections ?? [];
    return sections
        .flatMap((s) =>
            (s.wagons ?? []).map((w) => ({
                n: w.vehicleNumber ?? w.salesNumber,
                loc: w.location,
            }))
        )
        .sort((a, b) => a.loc - b.loc)
        .filter((w) => w.n)
        .map((w) => shortWagonNumber(w.n));
}