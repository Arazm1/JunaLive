package com.junalive.demo.dto;

import java.sql.Date;

public record ClosingTrainStatusDTO(
    Integer id,
    Date date,
    String trainLine,
    Integer trainCode,
    String stationCode,

    // Live Digitraffic data
    String actualArrivalTime,
    String platform,
    Boolean cancelled
) {}