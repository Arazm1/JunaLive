package com.junalive.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.junalive.demo.entity.MandatoryTrain;

public interface MandatoryTrainRepository extends JpaRepository<MandatoryTrain, Integer> {
    List<MandatoryTrain> findByShiftId(Integer shiftId);

    boolean existsByShiftIdAndDepartureDateAndTrainCode(Integer shiftId, LocalDate departureDate, Integer trainCode);

    void deleteByShiftIdAndDepartureDateAndTrainCode(Integer shiftId, LocalDate departureDate, Integer trainCode);
}
