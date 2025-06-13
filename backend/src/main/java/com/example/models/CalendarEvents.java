package com.example.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import lombok.Data;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import java.time.Instant;

// Definition of the CalendarEvents table

// Map to CalendarEvents table in db
@Entity
// Specify table name
@Table(name = "CalendarEvents")
// Autocreate toString, equals, hashCode, getters and setters 
@Data
public class CalendarEvents {
    // Designate primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Instant dateTime;

    @Column(nullable = false)
    private  Boolean allDay;

    // Foreign key to user table
    // We must pass a User object so that the Object Relational Mapping (ORM) works
    // Define the mapping
    @ManyToOne
    @JoinColumn(name = "fk_user_id",nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private Instant createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private Instant updatedAt;

    public CalendarEvents() {};

    public CalendarEvents(String name, Instant dateTime, Boolean allDay, User user) {
        this.name = name;
        this.dateTime = dateTime;
        this.allDay = allDay;
        this.user = user;
    }
    
    // Update createdAt and updatedAt when creating a new event
    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Update createdAt and updatedAt when creating a new event
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}