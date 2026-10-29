package com.junalive.demo.dto;

import java.sql.Date;

public record ClosingTrainDTO(
    Integer id,
    Date date,
    String trainLine,
    Integer trainCode,
    String stationCode
) {}
