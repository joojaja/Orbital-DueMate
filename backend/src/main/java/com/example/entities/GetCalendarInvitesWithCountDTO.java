package com.example.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
// DTO to include the total count of invites together with the list of invites details
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetCalendarInvitesWithCountDTO {
    int count;
    List<GetCalendarInvitesDTO> invites;
}
