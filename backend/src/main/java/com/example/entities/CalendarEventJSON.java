package com.example.entities;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;

// DTO of a the post body JSON we receive to create a new calendar event.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEventJSON {
    private String name;
    private Instant dateTime;
    private Instant endTime;
    private Boolean allDay;
    private String description;
    // private Long editedUserId; Dont need since user
    private Long userId;
    private Long createdByUserId;
}
