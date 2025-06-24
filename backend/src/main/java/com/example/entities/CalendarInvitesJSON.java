package com.example.entities;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import lombok.AllArgsConstructor;
import lombok.Builder;

// DTO of a the post body JSON we receive to create a new calendar invite.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarInvitesJSON {
    private String email;
    private Long userId;
}
