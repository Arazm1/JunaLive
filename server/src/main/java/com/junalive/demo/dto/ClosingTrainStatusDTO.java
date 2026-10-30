package com.junalive.demo.dto;

import java.time.LocalDate;


public record ClosingTrainStatusDTO(
    Integer id,
    LocalDate date,
    String trainLine,
    Integer trainCode,
    String stationCode,

    // Live Digitraffic data
    String actualArrivalTime,
    String platform,
    Boolean cancelled
) {}