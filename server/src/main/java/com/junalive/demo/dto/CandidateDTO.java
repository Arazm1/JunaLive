package com.junalive.demo.dto;

import java.time.LocalDate;

public record CandidateDTO(
    LocalDate departureDate,
    int trainCode,
    String trainLine,
    String scheduledArrival,
    String platform,
    boolean mandatory
) {}
