// package com.example.Orbital;

// import com.example.models.Task;
// import com.example.models.User;
// import com.example.repository.ModulesRepository;
// import com.example.repository.TaskRepository;
// import com.example.repository.UserRepository;
// import com.example.security.services.TaskService;

// import jakarta.transaction.Transactional;

// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import java.time.LocalDate;

// import static org.junit.jupiter.api.Assertions.*;

// @SpringBootTest
// @Transactional
// public class GamificationTests {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private TaskService taskService;

//     @Autowired
//     private TaskRepository taskRepository;
    
//     @Autowired
//     private ModulesRepository modulesRepository;

//     private User user;

//     User testUser = new User();

//     @BeforeEach
//     public void setUp() {
//         modulesRepository.deleteAll();
//         taskRepository.deleteAll();

//         user = new User("Test User", "test@example.com", "password123");
//         user = userRepository.save(user);
//     }

//     @AfterEach
//     @Transactional
//     public void tearDown() {
//         taskRepository.deleteAll();
//         modulesRepository.deleteAll();
//     }


//     @Test
//     public void testExpGainAndTaskCompletion() {
//         // Create task and assign to user
//         Task task = new Task();
//         task.setTitle("Complete assignment");
//         task.setUser(user);
//         task.setCompleted(false);
//         task = taskService.createTaskWithExp(task);  // +20 exp for creating task

//         User updatedUser = userRepository.findById(user.getId()).orElseThrow();
//         assertEquals(20, updatedUser.getExp());

//         // Mark task as completed
//         task.setCompleted(true);
//         taskService.completeTaskWithExp(task);  // Assume +50 EXP, +1 streak logic

//         updatedUser = userRepository.findById(user.getId()).orElseThrow();
//         assertEquals(70, updatedUser.getExp());
//         assertEquals(1, updatedUser.getTasksCompleted());
//         assertEquals(1, updatedUser.getDailyStreak());
//         assertEquals(LocalDate.now(), updatedUser.getLastTaskCompletionDate());
//     }

//     @Test
//     public void testStreakResetAfterSkipDay() {
//         // Simulate yesterday's completion
//         user.setLastTaskCompletionDate(LocalDate.now().minusDays(2));
//         user.setDailyStreak(3);
//         userRepository.save(user);

//         Task task = new Task();
//         task.setTitle("Today’s task");
//         task.setUser(user);
//         task.setCompleted(false);
//         task = taskService.createTaskWithExp(task);  // +20 exp

//         task.setCompleted(true);
//         task = taskService.completeTaskWithExp(task);  // +50 exp

//         User updatedUser = userRepository.findById(user.getId()).orElseThrow();
//         assertEquals(70, updatedUser.getExp());  // 20 + 50
//         assertEquals(1, updatedUser.getDailyStreak());  // Reset due to gap
//         assertEquals(LocalDate.now(), updatedUser.getLastTaskCompletionDate());
//     }
// }
