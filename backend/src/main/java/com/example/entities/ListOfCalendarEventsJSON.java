package com.example.entities;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

// DTO of a the JSON we sent to the frontend containing a list of calendar events of a user.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListOfCalendarEventsJSON {
    private List<CalendarEventDTO> calendarEvents;
}
