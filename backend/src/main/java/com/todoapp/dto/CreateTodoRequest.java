package com.todoapp.dto;

import com.todoapp.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CreateTodoRequest {
    
    @NotBlank(message = "Text is required")
    @Size(max = 120, message = "Text cannot exceed 120 characters")
    private String text;
    
    @NotNull(message = "Priority is required")
    private Priority priority;
    
    private LocalDate dueDate;
    
    // Default constructor
    public CreateTodoRequest() {}
    
    // Constructor with parameters
    public CreateTodoRequest(String text, Priority priority, LocalDate dueDate) {
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
        return "CreateTodoRequest{" +
                "text='" + text + '\'' +
                ", priority=" + priority +
                ", dueDate=" + dueDate +
                '}';
    }
}