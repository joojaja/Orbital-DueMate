package com.example.security.services;
import com.example.repository.*;
import com.example.models.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    public List<Task> getTasksByUser(User user, boolean completed) {
        return taskRepository.findByUserIdAndCompleted(user.getId(), completed);
    }
    
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }
    
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

}