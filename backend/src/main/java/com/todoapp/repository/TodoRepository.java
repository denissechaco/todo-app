package com.todoapp.repository;

import com.todoapp.model.Priority;
import com.todoapp.model.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface TodoRepository {
    
    // Operaciones básicas CRUD
    Todo save(Todo todo);
    Optional<Todo> findById(String id);
    List<Todo> findAll();
    void deleteById(String id);
    boolean existsById(String id);
    
    // Operaciones con filtros y paginación
    Page<Todo> findAllWithFilters(
        String nameFilter,
        Priority priorityFilter,
        Boolean doneFilter,
        Pageable pageable
    );
    
    // Para las métricas
    List<Todo> findAllDone();
    List<Todo> findAllDoneByPriority(Priority priority);
}