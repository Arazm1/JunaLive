package com.junalive.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "shifts")
public class Shift {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "station_code")
    private String stationCode;

    @Column(name = "window_start")
    private LocalDateTime windowStart;

    @Column(name = "window_end")
    private LocalDateTime windowEnd;

    @Column(name = "created_by")
    private Integer createdBy;

    public Shift(){}

    public Shift(Integer id, String stationCode, LocalDateTime windowStart, LocalDateTime windowEnd, Integer createdBy){
        this.id = id;
        this.stationCode = stationCode;
        this.windowStart = windowStart;
        this.windowEnd = windowEnd;
        this.createdBy = createdBy;
    }


    public Integer getId(){
        return this.id;
    }

    public String getStationCode(){
        return this.stationCode;
    }

    public LocalDateTime getWindowStart(){
        return this.windowStart;
    }

    public LocalDateTime getWindowEnd(){
        return this.windowEnd;
    }

    public Integer getCreatedBy(){
        return this.createdBy;
    }


    public void setId(Integer id){
        this.id = id;
    }

    public void setStationCode(String stationCode){
        this.stationCode = stationCode;
    }

    public void setWindowStart(LocalDateTime windowStart){
        this.windowStart = windowStart;
    }

    public void setWindowEnd(LocalDateTime windowEnd){
        this.windowEnd = windowEnd;
    }

    public void setCreatedBy(Integer createdBy){
        this.createdBy = createdBy;
    }
    
}
