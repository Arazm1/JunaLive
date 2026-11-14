package com.junalive.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.junalive.demo.dto.CandidateDTO;
import com.junalive.demo.dto.mandatorytrain.MTrainRequest;
import com.junalive.demo.dto.shift.ShiftDTO;
import com.junalive.demo.dto.shift.ShiftRequest;
import com.junalive.demo.service.ShiftService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/shifts")
public class ShiftController {

    private final ShiftService service;

    public ShiftController(ShiftService service){
        this.service = service;
    }

    @GetMapping("/{id}/candidates")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CandidateDTO> candidates(@PathVariable Integer id){
        return service.getCandidates(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ShiftDTO create(@Valid @RequestBody ShiftRequest request) {
        return service.createShift(request);
    }

    @PutMapping("/{id}/trains")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void mark(@PathVariable Integer id, @Valid @RequestBody MTrainRequest request) {
        service.markTrain(id, request);
    }

    @DeleteMapping("/{id}/trains/{departureDate}/{trainCode}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unmark(@PathVariable Integer id,
                    @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
                    @PathVariable Integer trainCode) {
        service.unmarkTrain(id, departureDate, trainCode);
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ShiftDTO> upcoming(){
        return service.listUpcoming();
    }
    
}
