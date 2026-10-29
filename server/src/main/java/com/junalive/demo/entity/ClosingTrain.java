package com.junalive.demo.entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "closing_trains")
public class ClosingTrain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "date")
    private Date date;

    @Column(name = "train_line")
    private String trainLine;

    @Column(name = "train_code")
    private Integer trainCode;

    @Column(name = "station_code")
    private String stationCode;

    public ClosingTrain(){}

    public ClosingTrain(Date date, String trainLine, Integer trainCode, String stationCode){
        this.date = date;
        this.trainLine = trainLine;
        this.trainCode = trainCode;
        this.stationCode = stationCode;
    }


    public Integer getId(){
        return this.id;
    }

    public Date getDate(){
        return this.date;
    }

    public String getTrainLine(){
        return this.trainLine;
    }

    public Integer getTrainCode(){
        return this.trainCode;
    }

    public String getStationCode(){
        return this.stationCode;
    }


    public void setId(Integer id){
        this.id = id;
    }

    public void setDate(Date date){
        this.date = date;
    }
    
    public void setTrainLine(String trainLine){
        this.trainLine = trainLine;
    }

    public void setTrainCode(Integer trainCode){
        this.trainCode = trainCode;
    }

    public void setStationCode(String stationCode){
        this.stationCode = stationCode;
    }
}
