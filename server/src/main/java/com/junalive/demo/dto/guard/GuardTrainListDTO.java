package com.junalive.demo.dto.guard;

import java.time.LocalDateTime;
import java.util.List;

public record GuardTrainListDTO(
    String stationCode,
    LocalDateTime windowStart,
    LocalDateTime windowEnd,
    boolean active,
    List<GuardTrainDTO> trains
) {}
