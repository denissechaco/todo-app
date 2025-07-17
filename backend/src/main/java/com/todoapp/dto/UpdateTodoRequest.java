package com.todoapp.dto;

import com.todoapp.model.Priority;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UpdateTodoRequest {
    
    @Size(max = 120, message = "Text cannot exceed 120 characters")
    private String text;
    
    private Priority priority;
    
    private LocalDate dueDate;
    
    // Default constructor
    public UpdateTodoRequest() {}
    
    // Constructor with parameters
    public UpdateTodoRequest(String text, Priority priority, LocalDate dueDate) {
        this.text = text;
        this.priority = priority;
        this.dueDate = dueDate;
    }
    
    // Getters and Setters
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public Priority getPriority() {
        return priority;
    }
    
    public void setPriority(Priority priority) {
        this.priority = priority;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    @Override
    public String toString() {
        return "UpdateTodoRequest{" +
                "text='" + text + '\'' +
                ", priority=" + priority +
                ", dueDate=" + dueDate +
                '}';
    }
}