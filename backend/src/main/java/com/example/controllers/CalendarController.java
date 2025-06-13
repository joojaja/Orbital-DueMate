package com.example.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.repository.*;
import com.example.models.*;
import com.example.entities.*;
import java.util.List;

@RestController
// Set mapping
// @RequestMapping("/api/auth")
public class CalendarController {
    private final CalendarEventsRepository calendarEventsRepository;
    private final UserRepository userRepository;
    public CalendarController(CalendarEventsRepository calendarEventsRepository, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.calendarEventsRepository = calendarEventsRepository;
    }

    @GetMapping("/calendar/read/{id}") // the endpoint for user register; /api/auth/signin
    public ResponseEntity<?> getCalendarEvents(@PathVariable Long id) {
        try {
            // Create new calendar event
            User user = userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));
            List<CalendarEvents> events =  this.calendarEventsRepository.findByUser(user);
            List<CalendarEventDTO> eventsMapped = events.stream().map(event -> new CalendarEventDTO(
                event.getId(),
                event.getName(),
                event.getDateTime(),
                event.getAllDay(),
                event.getUser().getId(), // Get only the user ID
                event.getCreatedAt(),
                event.getUpdatedAt()
            )).toList();
            // Return a success message
            return ResponseEntity.status(200).body(eventsMapped);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the user's calendar events: " + e));
        }
    }

    @PostMapping("/calendar/create") // the endpoint for user register; /api/auth/signin
    public ResponseEntity<?> createNewCalendarEvent(@RequestBody CalendarEventJSON calendarEventJSON) {
        try {
            // Create new calendar event
            User user = userRepository.findById(calendarEventJSON.getUserId()).orElseThrow(() -> new Exception("User not found"));
            CalendarEvents calendarEvents = new CalendarEvents(calendarEventJSON.getName(), calendarEventJSON.getDateTime(), 
            calendarEventJSON.getAllDay(), user);
            this.calendarEventsRepository.save(calendarEvents);

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar event created successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar event creation: " + e));
        }
    }

    @PutMapping("/calendar/update/{id}")
    public ResponseEntity<?> updateCalendarEvent(@PathVariable Long id, @RequestBody CalendarEventJSON calendarEventJSON) {
        try {
            // Update calendar event
            this.calendarEventsRepository.updateEventbyId(id, calendarEventJSON.getName(), calendarEventJSON.getDateTime(), calendarEventJSON.getAllDay());

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar event updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar event update: " + e));
        }
    }

    @DeleteMapping("/calendar/delete/{id}")
    public ResponseEntity<?> deleteCalendarEvent(@PathVariable Long id) {
        try {
            // Delete calendar event
            this.calendarEventsRepository.deleteEventById(id);

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar event deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar event deletion: " + e));
        }
    }
}

