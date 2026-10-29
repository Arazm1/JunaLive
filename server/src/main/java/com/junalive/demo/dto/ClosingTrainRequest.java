package com.junalive.demo.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * One Request
 * ClosingTrainRequest
 * @param date
 * @param stationCode
 * @param trainCode
 * @param trainLine
 */
public record ClosingTrainRequest(
    @NotNull LocalDate date,
    @NotBlank @Size(max = 10) String stationCode,
    @NotNull Integer trainCode,
    @Size(max = 10) String trainLine
) {}
