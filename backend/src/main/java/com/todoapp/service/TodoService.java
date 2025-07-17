package com.todoapp.service;

import com.todoapp.dto.MetricsDto;
import com.todoapp.model.Priority;
import com.todoapp.model.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Optional;

public interface TodoService {
    
    // Operaciones CRUD básicas
    Todo createTodo(String text, Priority priority, LocalDate dueDate);
    Optional<Todo> getTodoById(String id);
    Todo updateTodo(String id, String text, Priority priority, LocalDate dueDate);
    void deleteTodo(String id);
    
    // Operaciones con filtros y paginación
    Page<Todo> getTodosWithFilters(String nameFilter, Priority priorityFilter, 
                                  Boolean doneFilter, Pageable pageable);
    
    // Operaciones de estado
    Todo markAsDone(String id);
    Todo markAsUndone(String id);
    
    // Métricas
    MetricsDto getMetrics();
    
    // Validaciones
    boolean existsById(String id);
}