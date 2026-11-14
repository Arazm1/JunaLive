package com.junalive.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.junalive.demo.dto.CandidateDTO;
import com.junalive.demo.service.ShiftService;

@RestController
@RequestMapping("/api/v1/shifts")
public class ShiftController {

    private final ShiftService service;

    public ShiftController(ShiftService service){
        this.service = service;
    }

    @GetMapping("/{id}/candidates")
    //@PreAuthorize("hasRole('ADMIN')")
    public List<CandidateDTO> candidates(@PathVariable Integer id){
        return service.getCandidates(id);
    }
    
}
