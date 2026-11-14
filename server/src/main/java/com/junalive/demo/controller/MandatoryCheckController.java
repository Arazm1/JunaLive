package com.junalive.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.junalive.demo.dto.guard.GuardTrainListDTO;
import com.junalive.demo.service.GuardCheckService;

@RestController
@RequestMapping("/api/v1/my/check")
public class MandatoryCheckController {

    private final GuardCheckService service;

    public MandatoryCheckController(GuardCheckService service){
        this.service = service;
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('GUARD', 'ADMIN')")
    public GuardTrainListDTO getList(Authentication authentication){
        return service.getMyList(authentication.getName());
    }
    
}
