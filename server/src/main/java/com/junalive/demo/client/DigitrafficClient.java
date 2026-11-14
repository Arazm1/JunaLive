package com.junalive.demo.client;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import tools.jackson.databind.JsonNode;

@Component 
public class DigitrafficClient {

    private static final long TTL_MS = 30_000;
    private record Cached(JsonNode value, long at){}
    private final Map<String, Cached> compositionCache = new HashMap<>();


    private final Map<String, Cached> cache = new ConcurrentHashMap<>();
    private final RestClient client = RestClient.builder()
                                                .baseUrl("https://rata.digitraffic.fi/api/v1")
                                                .defaultHeader("Digitraffic-User", "JunaLive/0.1")
                                                .build();
    
    public JsonNode getTrain(LocalDate departureDate, int trainNumber){
        String key = departureDate + "_" + trainNumber;
        Cached c = cache.get(key);
        if(c != null && System.currentTimeMillis() - c.at() < TTL_MS){
            return c.value();
        }

        JsonNode train = null;
        try{
            JsonNode body = client.get()
                                    .uri("/trains/{d}/{n}", departureDate, trainNumber)
                                    .retrieve()
                                    .body(JsonNode.class);

            if(body != null && body.isArray() && body.size() > 0){
                train = body.get(0);
            }
        }
        catch(RestClientException e){
            e.printStackTrace();
        }
        cache.put(key, new Cached(train, System.currentTimeMillis()));
        return train;
    }


    /** The composition for a departure date and number, or null if none is published. */
    public JsonNode getComposition(LocalDate departureDate, int trainNumber){
        String key = departureDate + "_" + trainNumber;
        Cached c = compositionCache.get(key);
        if(c != null && System.currentTimeMillis() - c.at() < TTL_MS){
            return c.value();
        }

        JsonNode comp = null;

        try{
            comp = client.get()
                            .uri("/compositions/{d}/{n}", departureDate, trainNumber)
                            .retrieve()
                            .body(JsonNode.class);
        }
        catch(RestClientException e){
            e.printStackTrace();
        }
        compositionCache.put(key, new Cached(comp, System.currentTimeMillis()));
        return comp;
    }



    public List<JsonNode> getArrivals(String station, long minutesBefore, long minutesAfter){
        try{
            JsonNode body = client.get()
                                .uri(u -> u.path("/live-trains/station/{s}")
                                .queryParam("minutes_before_arrival", minutesBefore)
                                .queryParam("minutes_after_arrival", minutesAfter)
                                .queryParam("minutes_before_departure", 0)
                                .queryParam("minutes_after_departure", 0)
                                .queryParam("include_nonstopping", false)
                                .queryParam("train_categories", "Commuter")
                                .build(station)
                            )
                        .retrieve()
                        .body(JsonNode.class);

            List<JsonNode> trains = new ArrayList<>();
            if(body != null && body.isArray()){
                for(JsonNode train : body){
                    trains.add(train);
                }
            }
            return trains;

        }
        catch(RestClientException e){
            return List.of();
        }
    }
}
