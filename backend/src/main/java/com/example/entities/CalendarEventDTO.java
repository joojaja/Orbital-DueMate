package com.example.entities;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// DTO since we do not want to expose the user's details that is returned from the select query
// we just want the user's id.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEventDTO {
    private Long id;
    private String name;
    private Instant dateTime;
    private Instant endTime;
    private Boolean allDay;
    private String description;
    private Long userId; // Only the user ID
    private String editedBy;
    private Instant createdAt;
    private Instant updatedAt;
}
