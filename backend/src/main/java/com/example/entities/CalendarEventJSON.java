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
    private Boolean allDay;
    private Long userId;
}
