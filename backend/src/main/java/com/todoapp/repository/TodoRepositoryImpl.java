package com.todoapp.repository;

import com.todoapp.model.Priority;
import com.todoapp.model.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class TodoRepositoryImpl implements TodoRepository {
    
    // storage in memory for simplicity
    private final Map<String, Todo> todos = new ConcurrentHashMap<>();
    
    @Override
    public Todo save(Todo todo) {
        todos.put(todo.getId(), todo);
        return todo;
    }
    
    @Override
    public Optional<Todo> findById(String id) {
        return Optional.ofNullable(todos.get(id));
    }
    
    @Override
    public List<Todo> findAll() {
        return new ArrayList<>(todos.values());
    }
    
    @Override
    public void deleteById(String id) {
        todos.remove(id);
    }
    
    @Override
    public boolean existsById(String id) {
        return todos.containsKey(id);
    }
    
    @Override
    public Page<Todo> findAllWithFilters(String nameFilter, Priority priorityFilter, 
                                       Boolean doneFilter, Pageable pageable) {
        
        // all the to do items
        List<Todo> filteredTodos = new ArrayList<>(todos.values());
        
        // filter by name (if exists)
        if (nameFilter != null && !nameFilter.trim().isEmpty()) {
            filteredTodos = filteredTodos.stream()
                .filter(todo -> todo.getText().toLowerCase()
                    .contains(nameFilter.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        // filter by priority (if exists)
        if (priorityFilter != null) {
            filteredTodos = filteredTodos.stream()
                .filter(todo -> todo.getPriority() == priorityFilter)
                .collect(Collectors.toList());
        }
        
        // filter by done status (if exists)
        if (doneFilter != null) {
            filteredTodos = filteredTodos.stream()
                .filter(todo -> todo.isDone() == doneFilter)
                .collect(Collectors.toList());
        }
        
        // sorting
        if (pageable.getSort().isSorted()) {
            filteredTodos.sort((t1, t2) -> {
                // sort by the properties defined in pageable (priority, dueDate, creationDate)
                return compareTodos(t1, t2, pageable);
            });
        }
        
        // pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filteredTodos.size());
        
        List<Todo> pagedTodos = filteredTodos.subList(start, end);
        
        return new PageImpl<>(pagedTodos, pageable, filteredTodos.size());
    }
    
    @Override
    public List<Todo> findAllDone() {
        return todos.values().stream()
            .filter(Todo::isDone)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Todo> findAllDoneByPriority(Priority priority) {
        return todos.values().stream()
            .filter(todo -> todo.isDone() && todo.getPriority() == priority)
            .collect(Collectors.toList());
    }
    
    // auxiliary method to compare todos based on pageable sort
    private int compareTodos(Todo t1, Todo t2, Pageable pageable) {
        // basic implementation for sorting
        // if i have enouhg time, i would implement a more complex logic
        pageable.getSort().forEach(order -> {
            String property = order.getProperty();
            boolean ascending = order.isAscending();
            
            int result = 0;
            switch (property) {
                case "priority":
                    result = comparePriority(t1.getPriority(), t2.getPriority());
                    break;
                case "dueDate":
                    result = compareDueDate(t1, t2);
                    break;
                case "creationDate":
                    result = t1.getCreationDate().compareTo(t2.getCreationDate());
                    break;
            }
            
            if (!ascending) {
                result = -result;
            }
        });
        
        return 0; 
    }
    
    private int comparePriority(Priority p1, Priority p2) {
        // HIGH > MEDIUM > LOW
        Map<Priority, Integer> priorityOrder = Map.of(
            Priority.HIGH, 3,
            Priority.MEDIUM, 2,
            Priority.LOW, 1
        );
        
        return Integer.compare(priorityOrder.get(p1), priorityOrder.get(p2));
    }
    
    private int compareDueDate(Todo t1, Todo t2) {
        if (t1.getDueDate() == null && t2.getDueDate() == null) return 0;
        if (t1.getDueDate() == null) return 1;  // without due date goes to the end
        if (t2.getDueDate() == null) return -1; // without due date goes to the end
        
        return t1.getDueDate().compareTo(t2.getDueDate());
    }
}