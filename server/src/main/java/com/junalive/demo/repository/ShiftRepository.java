package com.junalive.demo.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.junalive.demo.entity.Shift;

public interface ShiftRepository extends JpaRepository<Shift, Integer>{
    Optional<Shift> findFirstByStationCodeAndWindowEndAfterOrderByWindowStartAsc(
        String stationCode, LocalDateTime now);
    
}
