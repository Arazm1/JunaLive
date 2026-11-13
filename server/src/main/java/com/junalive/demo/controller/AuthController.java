package com.junalive.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.junalive.demo.dto.authentication.LoginRequest;
import com.junalive.demo.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service){
        this.service = service;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try{
            String token = service.login(request);
            return ResponseEntity.ok(Map.of("token", token));
        }
        catch(RuntimeException e){
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
    
}
