package com.junalive.demo.dto.closingtrains;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * One Request
 * ClosingTrainRequest
 * @param date
 * @param arrivalTime
 * @param stationCode
 * @param trainCode
 * @param trainLine
 */
public record ClosingTrainRequest(
    @NotNull LocalDate date,
    @NotNull LocalTime arrivalTime,
    @NotBlank @Size(max = 10) String stationCode,
    @NotNull Integer trainCode,
    @Size(max = 10) String trainLine
) {}
