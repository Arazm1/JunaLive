package com.junalive.demo.dto.closingtrains;

import java.time.LocalDate;
import java.time.LocalTime;

public record ClosingTrainDTO(
    Integer id,
    LocalDate date,
    LocalTime arrivalTime,
    String trainLine,
    Integer trainCode,
    String stationCode
) {}
