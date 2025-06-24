package com.example.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.repository.*;

import jakarta.persistence.EntityNotFoundException;

import com.example.models.*;
import com.example.entities.*;
import java.util.List;


@RestController
// Set mapping
// @RequestMapping("/api/auth")
public class CalendarController {
    private final CalendarEventsRepository calendarEventsRepository;
    private final UserRepository userRepository;
    private final CalendarInvitesRepository calendarInvitesRepository;

    public CalendarController(CalendarEventsRepository calendarEventsRepository, UserRepository userRepository, CalendarInvitesRepository calendarInvitesRepository) {
        this.userRepository = userRepository;
        this.calendarEventsRepository = calendarEventsRepository;
        this.calendarInvitesRepository = calendarInvitesRepository;
    }

    @GetMapping("/calendar/read/{id}")
    public ResponseEntity<?> getCalendarEvents(@PathVariable Long id) {
        try {
            // Create new calendar event
            User user = userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));
            List<CalendarEvents> events =  this.calendarEventsRepository.findByUser(user);
            List<CalendarEventDTO> eventsMapped = events.stream().map(event -> new CalendarEventDTO(
                event.getId(),
                event.getName(),
                event.getDateTime(),
                event.getEndTime(),
                event.getAllDay(),
                event.getDescription(),
                event.getUser().getId(), // Get only the user ID
                event.getEditedUser().getName(),
                event.getCreatedAt(),
                event.getUpdatedAt()
            )).toList();
            // Return a success message
            return ResponseEntity.status(200).body(eventsMapped);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the user's calendar events: " + e));
        }
    }

    @PostMapping("/calendar/create") 
    public ResponseEntity<?> createNewCalendarEvent(@RequestBody CalendarEventJSON calendarEventJSON) {
        try {
            // Create new calendar event
            User user = userRepository.findById(calendarEventJSON.getUserId()).orElseThrow(() -> new Exception("User not found"));
            User editingUser = userRepository.findById(calendarEventJSON.getCreatedByUserId()).orElseThrow(() -> new Exception("User not found"));
            CalendarEvents calendarEvents = new CalendarEvents(calendarEventJSON.getName(), calendarEventJSON.getDateTime(), calendarEventJSON.getEndTime(),
            calendarEventJSON.getAllDay(), calendarEventJSON.getDescription() ,user, editingUser);
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
            User user = userRepository.findById(calendarEventJSON.getUserId()).orElseThrow(() -> new Exception("User not found"));
            this.calendarEventsRepository.updateEventbyId(id, calendarEventJSON.getName(), calendarEventJSON.getDateTime(), 
            calendarEventJSON.getEndTime(), calendarEventJSON.getAllDay(), calendarEventJSON.getDescription(), user);

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

    @PostMapping("/calendar/invite/create") 
    public ResponseEntity<?> createNewCalendarInvite(@RequestBody CalendarInvitesJSON calendarInvitesJSON) {
        try {
            // Create new calendar event
            User userToBeInvited = userRepository.findByEmail(calendarInvitesJSON.getEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));
            User invitingUser = userRepository.findById(calendarInvitesJSON.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));

            // Check if user is inviting themself
            if (userToBeInvited.equals(invitingUser)) {
                throw new IllegalStateException("You cannot invite yourself");
            }

            // Check if invite already exists
            if(calendarInvitesRepository.checkIfInviteExists(userToBeInvited, invitingUser).isPresent()) {
                throw new IllegalStateException("Invite already exists!");
            }

            // Check if user already accepted invite
            if(calendarInvitesRepository.checkIfInviteAccepted(userToBeInvited, invitingUser).isPresent()) {
                throw new IllegalStateException("Invite already accepted by user!");
            }

            
            CalendarInvites calendarInvite = new CalendarInvites("pending", userToBeInvited, invitingUser);

            this.calendarInvitesRepository.save(calendarInvite);
            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar invite created successfully!"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(new MessageResponseJSON(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(new MessageResponseJSON(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar event creation: " + e));
        }
    }

    @GetMapping("/calendar/invite/read/{id}")
    public ResponseEntity<?> getCalendarInvite(@PathVariable Long id) {
        try {
            // Create new calendar event
            User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
            List<CalendarInvitedDTO> users =  this.userRepository.findPendingInvitesByUser(user);
            List<GetCalendarInvitesDTO> invites = users.stream().map(u -> new GetCalendarInvitesDTO(u.getUser().getId(), u.getUser().getName(), u.getUser().getEmail(), u.getCalendarInviteID())).toList();
            GetCalendarInvitesWithCountDTO inviteWithCount = new GetCalendarInvitesWithCountDTO(invites.size(), invites);
            return ResponseEntity.status(200).body(inviteWithCount);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the user's calendar invites: " + e));
        }
    }

    @GetMapping("/calendar/acceptedinvites/read/{id}")
    public ResponseEntity<?> getAcceptedCalendarInvite(@PathVariable Long id) {
        try {
            // Create new calendar event
            User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
            List<User> users =  this.userRepository.findAcceptedInvitesByUser(user);
            List<AcceptedCalendarInviteJSON> invites = users.stream().map(u -> new AcceptedCalendarInviteJSON(u.getId(), u.getName(), u.getEmail())).toList();
            return ResponseEntity.status(200).body(invites);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the user's calendar events: " + e));
        }
    }

    @PutMapping("/calendar/invite/accept/{id}")
    public ResponseEntity<?> acceptCalendarInvite(@PathVariable Long id) {
        try {     
            this.calendarInvitesRepository.updateEventbyId(id, "accepted");
            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar invite accepted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar event update: " + e));
        }
    }

    @PutMapping("/calendar/invite/reject/{id}")
    public ResponseEntity<?> rejectCalendarInvite(@PathVariable Long id) {
        try {     
            this.calendarInvitesRepository.updateEventbyId(id, "reject");
            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar invite rejected successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar event update: " + e));
        }
    }
}

