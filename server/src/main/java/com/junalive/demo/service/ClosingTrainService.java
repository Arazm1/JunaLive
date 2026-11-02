package com.junalive.demo.service;


import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.junalive.demo.client.DigitrafficClient;
import com.junalive.demo.dto.closingtrains.ClosingTrainDTO;
import com.junalive.demo.dto.closingtrains.ClosingTrainRequest;
import com.junalive.demo.dto.closingtrains.ClosingTrainStatusDTO;
import com.junalive.demo.entity.ClosingTrain;
import com.junalive.demo.repository.ClosingTrainRepository;

import tools.jackson.databind.JsonNode;

@Service
public class ClosingTrainService {

    private final ClosingTrainRepository repository;
    private static final ZoneId HELSINKI = ZoneId.of("Europe/Helsinki");
    private final DigitrafficClient digitraffic;

    public ClosingTrainService(ClosingTrainRepository repository, DigitrafficClient digitraffic){
        this.repository = repository;
        this.digitraffic = digitraffic;
    }

    private ClosingTrainDTO toClosingTrainDTO(ClosingTrain closingTrain){
        return new ClosingTrainDTO(
            closingTrain.getId(),
            closingTrain.getDate(),
            closingTrain.getArrivalTime(),
            closingTrain.getTrainLine(),
            closingTrain.getTrainCode(),
            closingTrain.getStationCode()
        );
    }

    private ClosingTrain toEntity(ClosingTrainRequest request){
        ClosingTrain ct = new ClosingTrain();
        ct.setDate(request.date());
        ct.setTrainLine(request.trainLine());
        ct.setTrainCode(request.trainCode());
        ct.setStationCode(request.stationCode());
        return ct;
    }

    private LocalDateTime at(ClosingTrain t) {
        return LocalDateTime.of(t.getDate(), t.getArrivalTime());
    }

    private List<ClosingTrain> findInRange(LocalDateTime from, LocalDateTime to){
        return repository.findByDateBetween(from.toLocalDate(), to.toLocalDate())
                            .stream()
                            .filter(t -> !at(t).isBefore(from) && at(t).isBefore(to))
                            .sorted(Comparator.comparing(this::at))
                            .toList();
    }


    @Transactional(readOnly = true)
    public List<ClosingTrainDTO> getClosingTrains(LocalDateTime from, LocalDateTime to) {

        return repository.findByDateBetween(from.toLocalDate(), to.toLocalDate()).stream()
            .filter(t -> !at(t).isBefore(from) && at(t).isBefore(to))
            .sorted(Comparator.comparing(this::at))
            .map(this::toClosingTrainDTO)
            .toList();
    }


    /**
     * Get closing trains for a specific date and station
     */
    @Transactional(readOnly = true)
    public List<ClosingTrainDTO> getClosingTrains(
        LocalDate date,
        String stationCode
    ){
        return repository
                    .findByDateAndStationCode(date, stationCode)
                    .stream()
                    .map(this::toClosingTrainDTO)
                    .toList();
    }


    /**
     * Get one closing train
     */
    @Transactional(readOnly = true)
    public ClosingTrainDTO getClosingTrain(Integer id) {

        ClosingTrain train = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Closing train not found: " + id
                        )
                );

        return toClosingTrainDTO(train);
    }


    /**
     * Get Closing trains between today and tomorrow
     */
    @Transactional(readOnly = true)
    public List<ClosingTrainDTO> getClosingTrainsTodayAndTomorrow(){
        LocalDate today = LocalDate.now(HELSINKI);
        return repository
                        .findByDateBetween(today, today.plusDays(1))
                        .stream()
                        .map(this::toClosingTrainDTO)
                        .toList();
    }


    /**
     * Create a closing train
     */
    @Transactional
    public ClosingTrainDTO createClosingTrain(
            ClosingTrain closingTrain
    ) {

        ClosingTrain savedTrain = repository.save(closingTrain);

        return toClosingTrainDTO(savedTrain);
    }

    @Transactional
    public int replaceList(List<ClosingTrainRequest> rows) {
        Function<ClosingTrainRequest, LocalDateTime> when = r -> LocalDateTime.of(r.date(), r.arrivalTime());

        rows.stream().collect(Collectors.groupingBy(ClosingTrainRequest::stationCode)).forEach((station, list) -> {
            LocalDateTime min = list.stream().map(when).min(Comparator.naturalOrder()).get();
            LocalDateTime max = list.stream().map(when).max(Comparator.naturalOrder()).get();
            List<ClosingTrain> old = repository
                    .findByStationCodeAndDateBetween(station, min.toLocalDate(), max.toLocalDate()).stream()
                    .filter(t -> !at(t).isBefore(min) && !at(t).isAfter(max))
                    .toList();
            repository.deleteAll(old);
        });
        repository.flush();

        Set<String> seen = new HashSet<>();
        List<ClosingTrain> entities = rows.stream()
                .filter(r -> seen.add(r.date() + "_" + r.stationCode() + "_" + r.trainCode()))
                .map(this::toEntity)
                .toList();
        repository.saveAll(entities);
        return entities.size();
    }

    /**
     * Delete a closing train
     * @param id of the train
     */
    @Transactional
    public void deleteClosingTrain(Integer id) {
        repository.deleteById(id);
    }





    // no @Transactional here: the repository call finishes before any HTTP request starts
public List<ClosingTrainStatusDTO> getStatusRange(LocalDateTime from, LocalDateTime to) {
    return findInRange(from, to).parallelStream()   // ~40 trains, so don't wait for them one by one
            .map(this::toStatus)
            .toList();                              // keeps the sorted order
}

private ClosingTrainStatusDTO toStatus(ClosingTrain ct) {
    JsonNode train = null;
    JsonNode row = null;

    // The Excel date is the ARRIVAL date. Digitraffic wants the DEPARTURE date,
    // which is the previous day for trains that cross midnight, so try both.
    for (LocalDate departureDate : List.of(ct.getDate(), ct.getDate().minusDays(1))) {
        JsonNode candidate = digitraffic.getTrain(departureDate, ct.getTrainCode());
        if (candidate == null) continue;
        JsonNode r = stopRow(candidate, ct.getStationCode());
        if (r != null && arrivalDate(r).equals(ct.getDate())) {
            train = candidate;
            row = r;
            break;
        }
    }

    if (row == null) {
        return new ClosingTrainStatusDTO(ct.getId(), ct.getDate(), ct.getArrivalTime(),
                ct.getTrainLine(), ct.getTrainCode(), ct.getStationCode(),
                false, null, 0, null, false);
    }

    // best available time: actual (already arrived) > estimate > schedule
    String best = row.hasNonNull("actualTime") ? row.get("actualTime").asText()
            : row.hasNonNull("liveEstimateTime") ? row.get("liveEstimateTime").asText()
            : row.path("scheduledTime").asText();

    return new ClosingTrainStatusDTO(ct.getId(), ct.getDate(), ct.getArrivalTime(),
            ct.getTrainLine(), ct.getTrainCode(), ct.getStationCode(),
            true,
            Instant.parse(best).toString(),
            row.path("differenceInMinutes").asInt(0),
            row.path("commercialTrack").asText(""),
            train.path("cancelled").asBoolean() || row.path("cancelled").asBoolean());
}

private LocalDate arrivalDate(JsonNode row) {
    return Instant.parse(row.path("scheduledTime").asText()).atZone(HELSINKI).toLocalDate();
}

// the arrival row at this station, or the departure row if the train starts there
private JsonNode stopRow(JsonNode train, String station) {
    JsonNode departure = null;
    for (JsonNode r : train.path("timeTableRows")) {
        if (!station.equals(r.path("stationShortCode").asText())) continue;
        if (!r.path("commercialStop").asBoolean()) continue;
        if ("ARRIVAL".equals(r.path("type").asText())) return r;
        departure = r;
    }
    return departure;
}
    
}
