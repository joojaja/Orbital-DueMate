package com.example.models;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String title;
    private LocalDate due;
    private String notes;
    private boolean completed;
    private String priority; //  "low", "medium", "high"
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters
    public Long getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }
    public LocalDate getDue() {
        return due;
    }
    public String getNotes() {
        return notes;
    }
    public boolean isCompleted() {
        return completed;
    }
    public User getUser() {
        return user;
    }
    public String getPriority() {
        return priority;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setDue(LocalDate due) {
        this.due = due;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public void setPriority(String priority) {
        this.priority = priority;
    }
}
