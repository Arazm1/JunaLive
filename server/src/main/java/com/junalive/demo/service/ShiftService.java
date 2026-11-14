package com.junalive.demo.service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.junalive.demo.client.DigitrafficClient;
import com.junalive.demo.dto.CandidateDTO;
import com.junalive.demo.entity.Shift;
import com.junalive.demo.repository.MandatoryTrainRepository;
import com.junalive.demo.repository.ShiftRepository;

import tools.jackson.databind.JsonNode;

@Service
public class ShiftService {

    private static final ZoneId HELSINKI = ZoneId.of("Europe/Helsinki");

    private final ShiftRepository shiftRepository;
    private final MandatoryTrainRepository mandatoryTrainRepository;
    private final DigitrafficClient digitraffic;

    public ShiftService(ShiftRepository shiftRepository,
                        MandatoryTrainRepository mandatoryTrainRepository,
                        DigitrafficClient digitraffic) {
        this.shiftRepository = shiftRepository;
        this.mandatoryTrainRepository = mandatoryTrainRepository;
        this.digitraffic = digitraffic;
    }

    
    @Transactional(readOnly = true)
    public List<CandidateDTO> getCandidates(Integer shiftId) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        LocalDateTime now = LocalDateTime.now(HELSINKI);
        LocalDateTime start = shift.getWindowStart();
        LocalDateTime end = shift.getWindowEnd();

        long before = Math.max(0, Duration.between(now, end).toMinutes());   // until the window ends
        long after  = Math.max(0, Duration.between(start, now).toMinutes()); // if it has already started

        Set<String> marked = mandatoryTrainRepository.findByShiftId(shiftId).stream()
                .map(m -> m.getDepartureDate() + "_" + m.getTrainCode())
                .collect(Collectors.toSet());

        String station = shift.getStationCode();
        List<CandidateDTO> result = new ArrayList<>();

        for (JsonNode train : digitraffic.getArrivals(station, before, after)) {
            if (!"Commuter".equals(train.path("trainCategory").asText())) continue;

            JsonNode row = null;
            for (JsonNode r : train.path("timeTableRows")) {
                if (station.equals(r.path("stationShortCode").asText())
                        && "ARRIVAL".equals(r.path("type").asText())
                        && r.path("commercialStop").asBoolean()) {
                    row = r;
                    break;
                }
            }
            if (row == null) continue;

            Instant scheduled = Instant.parse(row.path("scheduledTime").asText());
            LocalDateTime local = scheduled.atZone(HELSINKI).toLocalDateTime();
            if (local.isBefore(start) || !local.isBefore(end)) continue;   // outside the window

            LocalDate depDate = LocalDate.parse(train.path("departureDate").asText());
            int number = train.path("trainNumber").asInt();

            result.add(new CandidateDTO(
                    depDate, number,
                    train.path("commuterLineID").asText(""),
                    scheduled.toString(),
                    row.path("commercialTrack").asText(""),
                    marked.contains(depDate + "_" + number)));
        }

        result.sort(Comparator.comparing(CandidateDTO::scheduledArrival));
        return result;
    }
    
}
