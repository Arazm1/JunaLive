package com.junalive.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.junalive.demo.dto.ClosingTrainDTO;
import com.junalive.demo.dto.ClosingTrainRequest;
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


    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
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
    @Transactional
    public ClosingTrainDTO createClosingTrain(
            ClosingTrain closingTrain
    ) {

        ClosingTrain savedTrain = repository.save(closingTrain);

        return toClosingTrainDTO(savedTrain);
    }

    /*
    Currently doesnt work.
    @Transactional
    public int replaceList(List<ClosingTrainRequest> rows) {
        // clear only the (date, station) pairs that are in this paste
        rows.stream()
            .map(r -> List.of(r.date(), r.stationCode()))
            .distinct()
            .forEach(p -> repository.deleteByDateAndStationCode((LocalDate) p.get(0), (String) p.get(1)));

        List<ClosingTrain> entities = rows.stream().map(this::toEntity).toList();
        repository.saveAll(entities);
        return entities.size();
    }
     */

    /**
     * Delete a closing train
     * @param id of the train
     */
    @Transactional
    public void deleteClosingTrain(Integer id) {
        repository.deleteById(id);
    }
    
}
