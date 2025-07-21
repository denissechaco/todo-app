package com.todoapp.dto;

import java.util.Map;

public class MetricsDto {
    private double averageTimeToComplete; // En horas
    private Map<String, Double> averageByPriority; // Por prioridad
    private int totalCompletedTodos;
    
    // empty constructor
    public MetricsDto() {}
    
    // constructor with parameters
    public MetricsDto(double averageTimeToComplete, Map<String, Double> averageByPriority, 
                     int totalCompletedTodos) {
        this.averageTimeToComplete = averageTimeToComplete;
        this.averageByPriority = averageByPriority;
        this.totalCompletedTodos = totalCompletedTodos;
    }
    
    // getters and setters
    public double getAverageTimeToComplete() {
        return averageTimeToComplete;
    }
    
    public void setAverageTimeToComplete(double averageTimeToComplete) {
        this.averageTimeToComplete = averageTimeToComplete;
    }
    
    public Map<String, Double> getAverageByPriority() {
        return averageByPriority;
    }
    
    public void setAverageByPriority(Map<String, Double> averageByPriority) {
        this.averageByPriority = averageByPriority;
    }
    
    public int getTotalCompletedTodos() {
        return totalCompletedTodos;
    }
    
    public void setTotalCompletedTodos(int totalCompletedTodos) {
        this.totalCompletedTodos = totalCompletedTodos;
    }
    
    @Override
    public String toString() {
        return "MetricsDto{" +
                "averageTimeToComplete=" + averageTimeToComplete +
                ", averageByPriority=" + averageByPriority +
                ", totalCompletedTodos=" + totalCompletedTodos +
                '}';
    }
}