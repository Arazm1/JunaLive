package com.junalive.demo.client;

import java.time.LocalDate;
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
}
