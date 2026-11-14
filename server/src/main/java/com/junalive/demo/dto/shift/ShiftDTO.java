package com.junalive.demo.dto.shift;

import java.time.LocalDateTime;

public record ShiftDTO(
    Integer id,
    String stationCode,
    LocalDateTime windowStart,
    LocalDateTime windowEnd
) {}
