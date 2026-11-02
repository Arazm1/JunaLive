package com.junalive.demo.dto.closingtrains;

import java.time.LocalDate;
import java.time.LocalTime;


public record ClosingTrainStatusDTO(
    Integer id,
    LocalDate date,
    LocalTime arrivalTime,
    String trainLine,
    Integer trainCode,
    String stationCode,

    // Live Digitraffic data
    String actualArrivalTime,
    String platform,
    Boolean cancelled
) {}