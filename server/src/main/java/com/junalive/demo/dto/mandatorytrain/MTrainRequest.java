package com.junalive.demo.dto.mandatorytrain;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MTrainRequest(
    @NotNull LocalDate departureDate,
    @NotNull Integer trainCode,
    @NotNull @Size(max = 10) String trainLine
) {}
