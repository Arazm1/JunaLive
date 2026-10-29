package com.junalive.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.junalive.demo.dto.ClosingTrainDTO;
import com.junalive.demo.entity.ClosingTrain;
import com.junalive.demo.repository.ClosingTrainRepository;

@Service
public class ClosingTrainService {

    private final ClosingTrainRepository repository;

    public ClosingTrainService(ClosingTrainRepository repository){
        this.repository = repository;
    }

    private ClosingTrainDTO toClosingTrainDTO(ClosingTrain closingTrain){
        return new ClosingTrainDTO(
            closingTrain.getId(),
            closingTrain.getDate(),
            closingTrain.getTrainLine(),
            closingTrain.getTrainCode(),
            closingTrain.getStationCode()
        );
    }


    public List<ClosingTrainDTO> getClosingTrains(LocalDate date) {

        return repository
                .findByDate(date)
                .stream()
                .map(this::toClosingTrainDTO)
                .toList();
    }


    /**
     * Get closing trains for a specific date and station
     */
    public List<ClosingTrainDTO> getClosingTrains(
        LocalDate date,
        String stationCode
    ){
        return repository
                    .findByDateAndStationCode(date, stationCode)
                    .stream()
                    .map(this::toClosingTrainDTO)
                    .toList();
    }


    /**
     * Get one closing train
     */
    public ClosingTrainDTO getClosingTrain(Integer id) {

        ClosingTrain train = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Closing train not found: " + id
                        )
                );

        return toClosingTrainDTO(train);
    }


    /**
     * Create a closing train
     */
    public ClosingTrainDTO createClosingTrain(
            ClosingTrain closingTrain
    ) {

        ClosingTrain savedTrain = repository.save(closingTrain);

        return toClosingTrainDTO(savedTrain);
    }

    /**
     * Delete a closing train
     * @param id of the train
     */
    public void deleteClosingTrain(Integer id) {
        repository.deleteById(id);
    }
    
}
