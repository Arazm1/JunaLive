package com.junalive.demo.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

/**
 * List of Closing Trains request
 * ClosingTrainListRequest
 * @param rows
 */
public record ClosingTrainListRequest(
    @NotEmpty List<@Valid ClosingTrainRequest> rows
) {}
