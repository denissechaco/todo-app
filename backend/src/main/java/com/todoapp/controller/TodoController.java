package com.todoapp.controller;

import com.todoapp.dto.CreateTodoRequest;
import com.todoapp.dto.MetricsDto;
import com.todoapp.dto.UpdateTodoRequest;
import com.todoapp.exception.TodoNotFoundException;
import com.todoapp.model.Priority;
import com.todoapp.model.Todo;
import com.todoapp.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "http://localhost:8080")
public class TodoController {
    
    private final TodoService todoService;
    
    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }
    
    /**
     * GET /todos - Get all todos with filters, sorting, and pagination
     * Query parameters:
     * - page: page number (default: 0)
     * - size: page size (default: 10)
     * - sort: sort by (priority, dueDate, creationDate)
     * - direction: sort direction (asc, desc)
     * - name: filter by name (partial match)
     * - priority: filter by priority (HIGH, MEDIUM, LOW)
     * - done: filter by done status (true, false)
     */
    @GetMapping
    public ResponseEntity<Page<Todo>> getAllTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Boolean done) {
        
        // Create sort object
        Sort sortObj = Sort.unsorted();
        if (sort != null && !sort.isEmpty()) {
            Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;
            sortObj = Sort.by(sortDirection, sort);
        }
        
        // Create pageable object
        Pageable pageable = PageRequest.of(page, size, sortObj);
        
        // Get todos with filters
        Page<Todo> todos = todoService.getTodosWithFilters(name, priority, done, pageable);
        
        return ResponseEntity.ok(todos);
    }
    
    /**
     * GET /todos/{id} - Get a specific todo by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable String id) {
        Optional<Todo> todo = todoService.getTodoById(id);
        
        if (todo.isPresent()) {
            return ResponseEntity.ok(todo.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * POST /todos - Create a new todo
     */
    @PostMapping
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody CreateTodoRequest request) {
        try {
            Todo createdTodo = todoService.createTodo(
                request.getText(), 
                request.getPriority(), 
                request.getDueDate()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * PUT /todos/{id} - Update an existing todo
     */
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable String id, 
                                         @Valid @RequestBody UpdateTodoRequest request) {
        try {
            Todo updatedTodo = todoService.updateTodo(
                id,
                request.getText(),
                request.getPriority(),
                request.getDueDate()
            );
            
            return ResponseEntity.ok(updatedTodo);
        } catch (TodoNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * DELETE /todos/{id} - Delete a todo
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
        try {
            todoService.deleteTodo(id);
            return ResponseEntity.noContent().build();
        } catch (TodoNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * POST /todos/{id}/done - Mark a todo as done
     */
    @PostMapping("/{id}/done")
    public ResponseEntity<Todo> markAsDone(@PathVariable String id) {
        try {
            Todo todo = todoService.markAsDone(id);
            return ResponseEntity.ok(todo);
        } catch (TodoNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * PUT /todos/{id}/undone - Mark a todo as undone
     */
    @PutMapping("/{id}/undone")
    public ResponseEntity<Todo> markAsUndone(@PathVariable String id) {
        try {
            Todo todo = todoService.markAsUndone(id);
            return ResponseEntity.ok(todo);
        } catch (TodoNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * GET /todos/metrics - Get completion metrics
     */
    @GetMapping("/metrics")
    public ResponseEntity<MetricsDto> getMetrics() {
        MetricsDto metrics = todoService.getMetrics();
        return ResponseEntity.ok(metrics);
    }
}