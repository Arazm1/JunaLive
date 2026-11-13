package com.junalive.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.junalive.demo.entity.MandatoryTrain;

public interface MandatoryTrainRepository extends JpaRepository<MandatoryTrain, Integer> {
    
}
