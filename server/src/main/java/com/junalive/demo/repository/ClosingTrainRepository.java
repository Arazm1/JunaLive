package com.junalive.demo.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.junalive.demo.entity.ClosingTrain;

public interface ClosingTrainRepository extends JpaRepository<ClosingTrain, Integer>{

    List<ClosingTrain> findByDate(Date date);

    List<ClosingTrain> findByDateAndStationCode(
        Date date,
        String stationCode
    );
    
}
