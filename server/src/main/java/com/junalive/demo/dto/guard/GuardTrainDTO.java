package com.junalive.demo.dto.guard;

import java.util.List;

public record GuardTrainDTO(
    int trainCode,
    String trainLine,
    boolean found,
    String scheduledArrival,
    String actualArrival,
    int delayMinutes,
    String platform,
    boolean cancelled,
    List<String> wagons
) {}
