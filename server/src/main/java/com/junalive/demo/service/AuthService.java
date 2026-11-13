package com.junalive.demo.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.junalive.demo.dto.authentication.LoginRequest;
import com.junalive.demo.entity.User;
import com.junalive.demo.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String secret;

    public AuthService(UserRepository repository, PasswordEncoder passwordEncoder){
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }


    public String login(LoginRequest loginRequest){
        User user = repository.findByUsername(loginRequest.username())
                                    .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(loginRequest.password(), user.getPassword())){
            throw new RuntimeException("Invalid password");
        }

        return JWT.create()
            .withSubject(user.getUsername())
            .withIssuedAt(new Date())
            .withExpiresAt(new Date(System.currentTimeMillis() + 86400000))
            .sign(Algorithm.HMAC256(secret));
        
    }
    
}
