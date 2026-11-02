package com.junalive.demo.dto.closingtrains;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


public record ClosingTrainStatusDTO(
    Integer id,
    LocalDate date,
    LocalTime arrivalTime,
    String trainLine,
    Integer trainCode,
    String stationCode,

    // Live Digitraffic data
    boolean found,
    String actualArrivalTime,
    int delayMinutes,
    String platform,
    Boolean cancelled,
    List<String> wagons
) {}