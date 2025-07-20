package com.example.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// DTO of the requirements credit total for the respective categories
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequirementsCreditTotalDTO {
    private Integer universityPillarCreditTotal;
    // private Integer CSFoundationCreditTotal;
    // private Integer breadthAndDepthCreditTotal;
    // private Integer mathAndScienceCreditTotal;
    private Integer unrestrictedElectivesCreditTotal;
    private Integer programmeRequirementsCreditTotal;
}
