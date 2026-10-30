package com.junalive.demo.dto;

import java.time.LocalDate;

public record ClosingTrainDTO(
    Integer id,
    LocalDate date,
    String trainLine,
    Integer trainCode,
    String stationCode
) {}
