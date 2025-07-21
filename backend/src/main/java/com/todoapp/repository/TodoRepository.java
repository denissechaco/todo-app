package com.todoapp.repository;

import com.todoapp.model.Priority;
import com.todoapp.model.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface TodoRepository {
    
    // basic CRUD operations
    Todo save(Todo todo);
    Optional<Todo> findById(String id);
    List<Todo> findAll();
    void deleteById(String id);
    boolean existsById(String id);
    
    // operations with filters and pagination
    Page<Todo> findAllWithFilters(
        String nameFilter,
        Priority priorityFilter,
        Boolean doneFilter,
        Pageable pageable
    );
    
    // for the metrics (i guess)
    List<Todo> findAllDone();
    List<Todo> findAllDoneByPriority(Priority priority);
}