package com.junalive.demo.dto.shift;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ShiftRequest(
    @NotBlank @Size(max = 10) String stationCode,
    @NotNull LocalDateTime windowStart,
    @NotNull LocalDateTime windowEnd
) {}
