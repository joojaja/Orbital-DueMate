package com.example.controllers;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.example.repository.*;
import com.example.security.services.*;
import com.example.models.*;
import com.example.entities.*;


@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    private final UserRepository userRepository;
    
    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }
    
    @GetMapping
    public ResponseEntity<?> getTasks(@RequestParam boolean completed) {
        try {
            User user = getCurrentUser();
            return ResponseEntity.ok(taskService.getTasksByUser(user, completed));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong : " + e));
        }
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        User user = getCurrentUser();
        task.setUser(user);
        return ResponseEntity.ok(taskService.saveTask(task));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        task.setId(id);
        return ResponseEntity.ok(taskService.saveTask(task));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
    
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication object: " + auth.getName());
        User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user;
    }
}

