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

// Definition of the CalendarInvites table

// Map to CalendarInvites table in db
@Entity
// Specify table name
@Table(name = "CalendarInvites")
// Autocreate toString, equals, hashCode, getters and setters 
@Data
public class CalendarInvites {
    // Designate primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String status;

    // Foreign key to user table
    // We must pass a User object so that the Object Relational Mapping (ORM) works
    // Define the mapping
    @ManyToOne
    @JoinColumn(name = "fk_user_id",nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "fk_invited_by_user_id",nullable = false)
    private User invitedByUser;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private Instant createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private Instant updatedAt;

    public CalendarInvites() {};

    public CalendarInvites(String status, User user, User invitedByUser) {
        this.status = status;
        this.user = user;
        this.invitedByUser = invitedByUser;
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
