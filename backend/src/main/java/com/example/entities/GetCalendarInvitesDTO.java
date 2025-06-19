package com.example.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// DTO since we do not want to expose the user's details for calendar invites
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetCalendarInvitesDTO {
    private Long id;
    private String name;
    private String email;
    private Long CalendarInviteID;
}