package com.example.entities;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import lombok.AllArgsConstructor;
import lombok.Builder;

import com.example.models.User;

// DTO to get users info and the id of the Calendar Invite
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarInvitedDTO {
    private Long CalendarInviteID;
    private User user;
}