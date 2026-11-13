package com.junalive.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mandatory_trains")
public class MandatoryTrain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "shift_id")
    private Integer shiftId;

    @Column(name = "departure_date")
    private LocalDate departureDate;

    @Column(name = "train_code")
    private Integer trainCode;

    @Column(name = "train_line")
    private String trainLine;


    public MandatoryTrain(){}

    public MandatoryTrain(Integer id, Integer shiftId, LocalDate departureDate, Integer trainCode, String trainLine){
        this.id = id;
        this.shiftId = shiftId;
        this.departureDate = departureDate;
        this.trainCode = trainCode;
        this.trainLine = trainLine;
    }


    public Integer getId(){
        return this.id;
    }

    public Integer getShiftId(){
        return this.shiftId;
    }

    public LocalDate getDepartureDate(){
        return this.departureDate;
    }

    public Integer getTrainCode(){
        return this.trainCode;
    }

    public String getTrainLine(){
        return this.trainLine;
    }


    public void setId(Integer id){
        this.id = id;
    }

    public void setShiftId(Integer shiftId){
        this.shiftId = shiftId;
    }

    public void setDepartureDate(LocalDate departureDate){
        this.departureDate = departureDate;
    }

    public void setTrainCode(Integer trainCode){
        this.trainCode = trainCode;
    }

    public void setTrainLine(String trainLine){
        this.trainLine = trainLine;
    }

}