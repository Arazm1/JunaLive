package com.junalive.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.junalive.demo.entity.ClosingTrain;

public interface ClosingTrainRepository extends JpaRepository<ClosingTrain, Integer>{

    List<ClosingTrain> findByDate(LocalDate date);

    List<ClosingTrain> findByDateAndStationCode(
        LocalDate date,
        String stationCode
    );
    
}
