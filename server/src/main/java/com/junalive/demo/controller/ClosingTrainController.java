package com.junalive.demo.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.cglib.core.Local;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.junalive.demo.dto.ClosingTrainDTO;
import com.junalive.demo.dto.ClosingTrainListRequest;
import com.junalive.demo.entity.ClosingTrain;
import com.junalive.demo.service.ClosingTrainService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/closing-trains")
public class ClosingTrainController {

    private final ClosingTrainService service;

    public ClosingTrainController(ClosingTrainService service){
        this.service = service;
    }


    /**
     * GET
     * @param date
     * @return
     */
    @GetMapping
    public List<ClosingTrainDTO> getClosingTrains(@RequestParam LocalDate date){
        return service.getClosingTrains(date);
    }

    @GetMapping("/next")
    public List<ClosingTrainDTO> getUpcoming() {
        return service.getClosingTrainsTodayAndTomorrow();
    }

    /**
     * GET 
     * @param date
     * @param stationCode
     * @return
     */
    @GetMapping("/station")
    public List<ClosingTrainDTO> getClosingTrainsByStation(
        @RequestParam LocalDate date,
        @RequestParam  String stationCode
    ){
        return service.getClosingTrains(date, stationCode);
    }


    /**
     * GET
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ClosingTrainDTO getClosingTrain(@PathVariable Integer id){
        return service.getClosingTrain(id);
    }


    /**
     * POST
     * @param closingTrain
     * @return
     */
    @PostMapping
    public ClosingTrainDTO createClosingTrain(@RequestBody ClosingTrain closingTrain){
        return service.createClosingTrain(closingTrain);
    }


    /*
    @PutMapping
    public Map<String, Integer> replaceList(@Valid @RequestBody ClosingTrainListRequest request){
        return Map.of("saved", service.replaceList(request.rows()));
    }
    */

    @DeleteMapping("/{id}")
    public void deleteClosingTrain(@PathVariable Integer id){
        service.deleteClosingTrain(id);
    }


    
}
