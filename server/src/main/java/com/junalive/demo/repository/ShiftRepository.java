package com.junalive.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.junalive.demo.entity.Shift;

public interface ShiftRepository extends JpaRepository<Shift, Integer>{
    
}
