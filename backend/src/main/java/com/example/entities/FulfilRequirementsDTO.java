package com.example.entities;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import lombok.AllArgsConstructor;
import lombok.Builder;

// DTO for the booleans for fulfilment of requirements for Grad
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FulfilRequirementsDTO {
    private Boolean fulfilUniversityPillars;
    private Boolean fulfilUnrestrictedElectives;
    private Boolean fulfilProgrammeRequirements;
    private Boolean canGraduate;
}
