package com.junalive.demo.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.junalive.demo.client.DigitrafficClient;
import com.junalive.demo.dto.guard.GuardTrainDTO;
import com.junalive.demo.dto.guard.GuardTrainListDTO;
import com.junalive.demo.entity.MandatoryTrain;
import com.junalive.demo.entity.Shift;
import com.junalive.demo.entity.User;
import com.junalive.demo.repository.MandatoryTrainRepository;
import com.junalive.demo.repository.ShiftRepository;
import com.junalive.demo.repository.UserRepository;

import tools.jackson.databind.JsonNode;

@Service
public class GuardCheckService {
    
    private static final ZoneId HELSINKI = ZoneId.of("Europe/Helsinki");

    private final UserRepository userRepository;
    private final ShiftRepository shiftRepository;
    private final MandatoryTrainRepository mandatoryTrainRepository;
    private final DigitrafficClient digitrafficClient;

    public GuardCheckService(UserRepository userRepository,
                               ShiftRepository shiftRepository,
                               MandatoryTrainRepository mandatoryTrainRepository,
                               DigitrafficClient digitrafficcClient){
        this.userRepository = userRepository;
        this.shiftRepository = shiftRepository;
        this.mandatoryTrainRepository = mandatoryTrainRepository;
        this.digitrafficClient = digitrafficcClient;
    }


    public GuardTrainListDTO getMyList(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        String station = user.getStationCode();
        if (station == null || station.isBlank()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No station assigned to this account");
        }

        LocalDateTime now = LocalDateTime.now(HELSINKI);
        Shift shift = shiftRepository
                .findFirstByStationCodeAndWindowEndAfterOrderByWindowStartAsc(station, now)
                .orElse(null);

        if (shift == null) {
            return new GuardTrainListDTO(station, null, null, false, List.of());
        }

        List<GuardTrainDTO> trains = mandatoryTrainRepository.findByShiftId(shift.getId())
                .parallelStream()
                .map(m -> toDto(m, station))
                .sorted(Comparator
                        .comparing((GuardTrainDTO t) -> !t.found())
                        .thenComparing(t -> t.scheduledArrival() == null ? "" : t.scheduledArrival()))
                .toList();

        return new GuardTrainListDTO(station, shift.getWindowStart(), shift.getWindowEnd(),
                !shift.getWindowStart().isAfter(now), trains);
    }

    private GuardTrainDTO toDto(MandatoryTrain m, String station) {
        JsonNode train = digitrafficClient.getTrain(m.getDepartureDate(), m.getTrainCode());
        JsonNode row = train == null ? null : stopRow(train, station);

        if (row == null) {
            return new GuardTrainDTO(m.getTrainCode(), m.getTrainLine(), false,
                    null, null, 0, null, false, List.of());
        }

        String best = row.hasNonNull("actualTime") ? row.get("actualTime").asText()
                : row.hasNonNull("liveEstimateTime") ? row.get("liveEstimateTime").asText()
                : row.path("scheduledTime").asText();

        return new GuardTrainDTO(
                m.getTrainCode(), m.getTrainLine(), true,
                Instant.parse(row.path("scheduledTime").asText()).toString(),
                Instant.parse(best).toString(),
                row.path("differenceInMinutes").asInt(0),
                row.path("commercialTrack").asText(""),
                train.path("cancelled").asBoolean() || row.path("cancelled").asBoolean(),
                wagons(digitrafficClient.getComposition(m.getDepartureDate(), m.getTrainCode())));
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

    private List<String> wagons(JsonNode comp) {
        if (comp == null) return List.of();
        List<JsonNode> all = new ArrayList<>();
        comp.path("journeySections").forEach(s -> s.path("wagons").forEach(all::add));
        all.sort(Comparator.comparingInt(w -> w.path("location").asInt()));

        return all.stream()
                .map(w -> w.hasNonNull("vehicleNumber")
                        ? w.get("vehicleNumber").asText()
                        : w.path("salesNumber").asText(""))
                .filter(n -> !n.isBlank())
                .map(n -> {
                    String base = n.split("-")[0];
                    return base.length() > 2 ? base.substring(base.length() - 2) : base;
                })
                .toList();
    }
}
