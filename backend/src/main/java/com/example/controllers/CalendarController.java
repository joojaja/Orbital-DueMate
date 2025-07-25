package com.example.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.repository.*;

import jakarta.persistence.EntityNotFoundException;

import com.example.models.*;
import com.example.entities.*;

import java.util.List;
import com.example.security.services.*;

@RestController
// Set mapping
// @RequestMapping("/api/auth")
public class CalendarController {
    private final CalendarEventsRepository calendarEventsRepository;
    private final UserRepository userRepository;
    private final CalendarInvitesRepository calendarInvitesRepository;
    private final EmailService emailService;

    public CalendarController(CalendarEventsRepository calendarEventsRepository, UserRepository userRepository, CalendarInvitesRepository calendarInvitesRepository
    , EmailService emailService) {
        this.userRepository = userRepository;
        this.calendarEventsRepository = calendarEventsRepository;
        this.calendarInvitesRepository = calendarInvitesRepository;
        this.emailService = emailService;
    }

    @PostMapping("/calendar/read")
    public ResponseEntity<?> getCalendarEventsByUsers(@RequestBody List<Long> userIds) {
        try {
            // Create new calendar event
            List<User> users = userIds.stream()
                .map(id -> this.userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User ID " + id + " not found")))
                .toList();

            List<CalendarEvents> events =  this.calendarEventsRepository.findByUserIn(users);
            List<CalendarEventDTO> eventsMapped = events.stream().map(event -> new CalendarEventDTO(
                event.getId(),
                this.userRepository.findById(event.getUser().getId()).orElseThrow(() -> new EntityNotFoundException("User not found")).getName(),
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
            User calendarOwner = this.userRepository.findById(calendarEventJSON.getUserId()).orElseThrow(() -> new Exception("User not found"));
            User user = this.userRepository.findById(calendarEventJSON.getCreatedByUserId()).orElseThrow(() -> new Exception("User not found"));

            CalendarEvents calendarEvents = new CalendarEvents(calendarEventJSON.getName(), calendarEventJSON.getDateTime(), calendarEventJSON.getEndTime(),
            calendarEventJSON.getAllDay(), calendarEventJSON.getDescription() ,calendarOwner, user);
            this.calendarEventsRepository.save(calendarEvents);

            String subject = "New Calendar Event created for " + calendarOwner.getName() + "'s calendar";
            String text = "A new calendar event has been created by " + user.getName() + " for " + calendarOwner.getName() + "'s calendar.\n" +
                        "Event Name: " + calendarEventJSON.getName() + "\n" +
                        "Start Time: " + calendarEventJSON.getDateTime() + "\n" +
                        "End Time: " + calendarEventJSON.getEndTime() + "\n" +
                        "All Day event: " + calendarEventJSON.getAllDay() + "\n" +
                        "Description: " + calendarEventJSON.getDescription();

            // Send email notifications to all users invited by the owner of the calendar
            this.calendarInvitesRepository.findByInvitedByUser(calendarOwner)
            .forEach(invite -> {
                    if (!invite.getUser().equals(user)) {
                        String receiverEmail = invite.getUser().getEmail();
                        this.emailService.sendSimpleEmail(receiverEmail, subject, text);
                    }
            });

            // We also send an email to the owner of the calendar if they are not the one creating the event
            if (!calendarOwner.equals(user)) {
                String receiverEmail = calendarOwner.getEmail();
                this.emailService.sendSimpleEmail(receiverEmail, subject, text);
            }

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
            User user = this.userRepository.findById(calendarEventJSON.getUserId()).orElseThrow(() -> new Exception("User not found"));
            CalendarEvents currentEvent = this.calendarEventsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Calendar event not found"));

            this.calendarEventsRepository.updateEventbyId(id, calendarEventJSON.getName(), calendarEventJSON.getDateTime(), 
            calendarEventJSON.getEndTime(), calendarEventJSON.getAllDay(), calendarEventJSON.getDescription(), user);

            User calendarOwner = currentEvent.getUser();

            String subject = "Calendar Event updated for " + calendarOwner.getName() + "'s calendar";
            String text = "A calendar event has been updated by " + user.getName() + " for " + calendarOwner.getName() + "'s calendar.\n" +
            "Event Name: " + currentEvent.getName() + " -> " + calendarEventJSON.getName() + "\n" +
            "Start Time: " + currentEvent.getDateTime() + " -> " + calendarEventJSON.getDateTime() + "\n" +
            "End Time: " + currentEvent.getEndTime() + " -> " + calendarEventJSON.getEndTime() + "\n" +
            "All Day event: " + currentEvent.getAllDay() + " -> " + calendarEventJSON.getAllDay() + "\n" +
            "Description: " + currentEvent.getDescription() + " -> " + calendarEventJSON.getDescription();

            // Send email notifications to all users invited by the owner of the calendar
            this.calendarInvitesRepository.findByInvitedByUser(calendarOwner).forEach(invite -> {
                if (!invite.getUser().equals(user)) {
                    String receiverEmail = invite.getUser().getEmail();
                    this.emailService.sendSimpleEmail(receiverEmail, subject, text);
                }
            });
            
            // We also send an email to the owner of the calendar if they are not the one editing the event
            if (!calendarOwner.equals(user)) {
                String receiverEmail = calendarOwner.getEmail();
                this.emailService.sendSimpleEmail(receiverEmail, subject, text);
            }

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar event updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar event update: " + e));
        }
    }

    @DeleteMapping("/calendar/delete/{id}/{currUserId}")
    public ResponseEntity<?> deleteCalendarEvent(@PathVariable Long id, @PathVariable Long currUserId) {
        try {
            // Delete calendar event
            User user = this.userRepository.findById(currUserId).orElseThrow(() -> new Exception("User not found"));
            CalendarEvents currentEvent = this.calendarEventsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Calendar event not found"));
            User calendarOwner = currentEvent.getUser();

            this.calendarEventsRepository.deleteEventById(id);

            String subject = "Calendar Event deleted for " + calendarOwner.getName() + "'s calendar";
            String text = "A calendar event has been deleted by " + user.getName() + " for " + calendarOwner.getName() + "'s calendar.\n" +
            "Event Name: " + currentEvent.getName() + "\n" +
            "Start Time: " + currentEvent.getDateTime() + "\n" +
            "End Time: " + currentEvent.getEndTime() + "\n" +
            "All Day event: " + currentEvent.getAllDay() + "\n" +
            "Description: " + currentEvent.getDescription();

            // Send email notifications to all users invited by the owner of the calendar
            this.calendarInvitesRepository.findByInvitedByUser(calendarOwner).forEach(invite -> {
                if (!invite.getUser().equals(user)) {
                    String receiverEmail = invite.getUser().getEmail();
                    this.emailService.sendSimpleEmail(receiverEmail, subject, text);
                }
            });

            // We also send an email to the owner of the calendar if they are not the one deleting the event
            if (!calendarOwner.equals(user)) {
                String receiverEmail = calendarOwner.getEmail();
                this.emailService.sendSimpleEmail(receiverEmail, subject, text);
            }
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
            User userToBeInvited = this.userRepository.findByEmail(calendarInvitesJSON.getEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));
            User invitingUser = this.userRepository.findById(calendarInvitesJSON.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));

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
            User user = this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
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
            User user = this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
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

    @DeleteMapping("/calendar/invite/delete/{userId}/{otherUserId}")
    public ResponseEntity<?> deleteCalendarInvite(@PathVariable Long userId, @PathVariable Long otherUserId) {
        try {
            // Delete calendar event
            User user = this.userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
            User invitingUser = this.userRepository.findById(otherUserId).orElseThrow(() -> new EntityNotFoundException("User not found"));
            this.calendarInvitesRepository.deleteInviteByIds(user, invitingUser);

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar invite deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar invite deletion: " + e));
        }
    }

    @GetMapping("/calendar/usersThatAcceptedInvite/read/{id}")
    public ResponseEntity<?> getUsersThatAcceptedInvite(@PathVariable Long id) {
        try {
            // Create new calendar event
            User user = this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
            List<User> users =  this.userRepository.findInvitedUserThatAccepted(user);
            List<AcceptedCalendarInviteJSON> usersDTO = users.stream().map(u -> new AcceptedCalendarInviteJSON(u.getId(), u.getName(), u.getEmail())).toList();
            return ResponseEntity.status(200).body(usersDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the user's calendar events: " + e));
        }
    }
}

