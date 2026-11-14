//import fetchData from "../utils/fetchData";
//import { useUserContext } from "./contextHooks";
import { useEffect, useState, useMemo } from "react";
import { getLiveTrains, getStations } from "../api/digitraffic";
import { mapTrain } from "../api/mapTrains";
import { getComposition } from "../api/digitraffic";
import { wagonNumbers } from "../api/mapTrains";
import fetchData from "../utils/fetchData";


let BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const POLL_MS = 30000;
const cache = new Map(); // train id -> number[]

const useLiveTrains = (stationCode, type, namesByCode) =>{
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!stationCode) return;
        let cancelled = false;

        setLoading(true);
        setTrains([]);

        async function load() {
            try {
                const raw = await getLiveTrains(stationCode, type);
                if (cancelled) return;
                const mapped = raw
                    .map((t) => mapTrain(t, stationCode, type, namesByCode))
                    .filter(Boolean)
                    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
                setTrains(mapped);
                setError(null);
            } catch (e) {
                if (!cancelled) setError(e.message);
            } finally {
                if (!cancelled) setLoading(false); // only matters on first load
            }
        }

        load();
        const id = setInterval(load, POLL_MS);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [stationCode, type, namesByCode]);

    return { trains, loading, error };
}



const useStations = () =>{
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        getStations()
            .then((data) => !cancelled && setStations(data))
            .catch((e) => !cancelled && setError(e.message))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, []);

    // stable object so downstream effects don't re-run
    const namesByCode = useMemo(
        () => Object.fromEntries(stations.map((s) => [s.stationShortCode, s.stationName])),
        [stations]
    );

    return { stations, namesByCode, loading, error };
}



const useWagons = (trains, limit = 18) =>{
    const [, setTick] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const missing = trains.slice(0, limit).filter((t) => !cache.has(t.id));
        if (missing.length === 0) return;

        Promise.allSettled(
            missing.map(async (t) => {
                const comp = await getComposition(t.departureDate, t.trainNumber);
                cache.set(t.id, wagonNumbers(comp));
            })
        ).then(() => {
            if (!cancelled) setTick((n) => n + 1); // re-render to pick up cache
        });

        return () => {
            cancelled = true;
        };
    }, [trains, limit]);

    // failed fetches aren't cached, so they get retried on the next poll
    return (id) => cache.get(id) ?? [];
}


const useMandatoryCheckTrains = () =>{
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/my/check`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
        if(response.status === 401){
          throw new Error('Please log in again');
        }

        if(!response.ok){
          throw new Error(`Server error ${response.status}`)
        }

        const json = await response.json();
        if(!cancelled){
          setData(json);
          setError(null);
          setUpdatedAt(new Date());
        }
      }
      catch(e){
        if(!cancelled){
          setError(e.message);
        }
      }
      finally{
        if(!cancelled){
          setLoading(false);
        }
      }
    }

    load();
      const id = setInterval(load, 30000);
      return () =>{
        cancelled = true;
        clearInterval(id);
      };
  }, []);

  return { data, loading, error, updatedAt };
}



const useClosingList = (date) =>{
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
        let cancelled = false;
        setLoading(true);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/closing-trains?date=${date}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Server error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (cancelled) return;
                setTrains(data);
                setError(null);
            })
            .catch((e) => !cancelled && setError(e.message))
            .finally(() => !cancelled && setLoading(false));

        return () => {
            cancelled = true;
        };
    }, [date]);

    return { trains, loading, error };

}


function useClosingRange(from, to) {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        async function load() {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/closing-trains/range/status?from=${from}&to=${to}`
                );
                if (!res.ok) throw new Error(`Server error ${res.status}`);
                const data = await res.json();
                if (!cancelled) { setTrains(data); setError(null); }
            } catch (e) {
                if (!cancelled) setError(e.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        const id = setInterval(load, 60000);
        return () => { cancelled = true; clearInterval(id); };
    }, [from, to]);

    return { trains, loading, error };
}



/**
 * Custom hook for authentication-related API requests.
 * @returns {Object} Functions for interacting with the authentication related requests.
 *  - postLogin - Post login with inputs and returns token.
 */
const useAuthentication = () => {
  //Login
  const postLogin = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };

    const result = await fetchData(
      BACKEND_URL + '/api/v1/auth/login',
      fetchOptions,
    );
    return result;
  }

  return {postLogin}
}


const useUser = () => {
  const getUserByToken = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };

    const result = await fetchData(BACKEND_URL + '/api/v1/users/me', fetchOptions);
    return { user: result };
  };
  return { getUserByToken }
};


export {
  useLiveTrains,
  useStations,
  useWagons,
  useMandatoryCheckTrains,
  useClosingList,
  useClosingRange,
  useAuthentication,
  useUser
};