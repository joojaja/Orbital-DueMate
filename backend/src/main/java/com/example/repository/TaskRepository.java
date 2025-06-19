package com.example.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.models.Task;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserIdAndCompleted(Long userId, boolean completed);
}
