package com.junalive.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.junalive.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Integer>{
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
