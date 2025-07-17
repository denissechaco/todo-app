package com.todoapp.service;

import com.todoapp.dto.MetricsDto;
import com.todoapp.exception.TodoNotFoundException;
import com.todoapp.model.Priority;
import com.todoapp.model.Todo;
import com.todoapp.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TodoServiceImpl implements TodoService {
    
    private final TodoRepository todoRepository;
    
    @Autowired
    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }
    
    @Override
    public Todo createTodo(String text, Priority priority, LocalDate dueDate) {
        // Validaciones
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("El texto no puede estar vacío");
        }
        
        if (text.length() > 120) {
            throw new IllegalArgumentException("El texto no puede tener más de 120 caracteres");
        }
        
        if (priority == null) {
            throw new IllegalArgumentException("La prioridad es requerida");
        }
        
        // Crear el nuevo TODO
        Todo todo = new Todo();
        todo.setText(text.trim());
        todo.setPriority(priority);
        if (dueDate != null) {
            todo.setDueDate(dueDate.atStartOfDay());
        } else {
            todo.setDueDate(null);
        }
        // Los demás campos se establecen automáticamente en el constructor
        
        return todoRepository.save(todo);
    }
    
    @Override
    public Optional<Todo> getTodoById(String id) {
        if (id == null || id.trim().isEmpty()) {
            return Optional.empty();
        }
        
        return todoRepository.findById(id);
    }
    
    @Override
    public Todo updateTodo(String id, String text, Priority priority, LocalDate dueDate) {
        // Buscar el TODO existente
        Optional<Todo> existingTodo = todoRepository.findById(id);
        
        if (existingTodo.isEmpty()) {
            throw new TodoNotFoundException("TODO no encontrado con ID: " + id);
        }
        
        // Validaciones
        if (text != null && text.trim().isEmpty()) {
            throw new IllegalArgumentException("El texto no puede estar vacío");
        }
        
        if (text != null && text.length() > 120) {
            throw new IllegalArgumentException("El texto no puede tener más de 120 caracteres");
        }
        
        Todo todo = existingTodo.get();
        
        // Actualizar solo los campos que no son null
        if (text != null) {
            todo.setText(text.trim());
        }
        
        if (priority != null) {
            todo.setPriority(priority);
        }
        
        // Para due date, permitimos null para "limpiar" la fecha
        if (dueDate != null) {
            todo.setDueDate(dueDate.atStartOfDay());
        } else {
            todo.setDueDate(null);
}
        
        return todoRepository.save(todo);
    }
    
    @Override
    public void deleteTodo(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID no puede estar vacío");
        }
        
        if (!todoRepository.existsById(id)) {
            throw new IllegalArgumentException("TODO no encontrado con ID: " + id);
        }
        
        todoRepository.deleteById(id);
    }
    
    @Override
    public Page<Todo> getTodosWithFilters(String nameFilter, Priority priorityFilter, 
                                        Boolean doneFilter, Pageable pageable) {
        return todoRepository.findAllWithFilters(nameFilter, priorityFilter, doneFilter, pageable);
    }
    
    @Override
    public Todo markAsDone(String id) {
        Optional<Todo> todoOptional = todoRepository.findById(id);
        
        if (todoOptional.isEmpty()) {
            throw new IllegalArgumentException("TODO no encontrado con ID: " + id);
        }
        
        Todo todo = todoOptional.get();
        
        // Solo marcar como done si no está done ya
        if (!todo.isDone()) {
            todo.setDone(true);
            todo.setDoneDate(LocalDateTime.now());
        }
        
        return todoRepository.save(todo);
    }
    
    @Override
    public Todo markAsUndone(String id) {
        Optional<Todo> todoOptional = todoRepository.findById(id);
        
        if (todoOptional.isEmpty()) {
            throw new IllegalArgumentException("TODO no encontrado con ID: " + id);
        }
        
        Todo todo = todoOptional.get();
        
        // Solo marcar como undone si está done
        if (todo.isDone()) {
            todo.setDone(false);
            todo.setDoneDate(null);
        }
        
        return todoRepository.save(todo);
    }
    
    @Override
    public MetricsDto getMetrics() {
        List<Todo> completedTodos = todoRepository.findAllDone();
        
        if (completedTodos.isEmpty()) {
            return new MetricsDto(0.0, new HashMap<>(), 0);
        }
        
        // Calcular tiempo promedio general
        double totalHours = completedTodos.stream()
                .mapToDouble(this::calculateCompletionTimeInHours)
                .sum();
        
        double averageTimeToComplete = totalHours / completedTodos.size();
        
        // Calcular tiempo promedio por prioridad
        Map<String, Double> averageByPriority = Arrays.stream(Priority.values())
                .collect(Collectors.toMap(
                        Priority::getDisplayName,
                        priority -> calculateAverageByPriority(priority)
                ));
        
        return new MetricsDto(averageTimeToComplete, averageByPriority, completedTodos.size());
    }
    
    @Override
    public boolean existsById(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }
        
        return todoRepository.existsById(id);
    }
    
    // Métodos auxiliares
    
    private double calculateCompletionTimeInHours(Todo todo) {
        if (todo.getDoneDate() == null) {
            return 0.0;
        }
        
        Duration duration = Duration.between(todo.getCreationDate(), todo.getDoneDate());
        return duration.toHours() + (duration.toMinutesPart() / 60.0);
    }
    
    private double calculateAverageByPriority(Priority priority) {
        List<Todo> todosWithPriority = todoRepository.findAllDoneByPriority(priority);
        
        if (todosWithPriority.isEmpty()) {
            return 0.0;
        }
        
        double totalHours = todosWithPriority.stream()
                .mapToDouble(this::calculateCompletionTimeInHours)
                .sum();
        
        return totalHours / todosWithPriority.size();
    }
}