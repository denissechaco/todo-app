package com.todoapp.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

public class Todo {
    
    private String id;
    
    @NotBlank(message = "Text is required")
    @Size(max = 120, message = "Text must not exceed 120 characters")
    private String text;
    
    private LocalDateTime dueDate;
    
    private boolean done;
    
    private LocalDateTime doneDate;
    
    @NotNull(message = "Priority is required")
    private Priority priority;
    
    private LocalDateTime creationDate;
    
    // Constructor sin parámetros
    public Todo() {
        this.id = UUID.randomUUID().toString();
        this.creationDate = LocalDateTime.now();
        this.done = false;
    }
    
    // Constructor con parámetros
    public Todo(String text, Priority priority, LocalDateTime dueDate) {
        this();
        this.text = text;
        this.priority = priority;
        this.dueDate = dueDate;
    }
    
    // Getters y Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    
    public boolean isDone() {
        return done;
    }
    
    public void setDone(boolean done) {
        this.done = done;
        if (done && this.doneDate == null) {
            this.doneDate = LocalDateTime.now();
        } else if (!done) {
            this.doneDate = null;
        }
    }
    
    public LocalDateTime getDoneDate() {
        return doneDate;
    }
    
    public void setDoneDate(LocalDateTime doneDate) {
        this.doneDate = doneDate;
    }
    
    public Priority getPriority() {
        return priority;
    }
    
    public void setPriority(Priority priority) {
        this.priority = priority;
    }
    
    public LocalDateTime getCreationDate() {
        return creationDate;
    }
    
    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }
}