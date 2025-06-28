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
    private Boolean fulfilDigitalLiteracy;
    private Boolean fulfilCritiqueAndExpression;
    private Boolean fulfilCultureAndConnections;
    private Boolean fulfilDataLiteracy;
    private Boolean fulfilSingaporeStudies;
    private Boolean fulfilCommunitiesAndEngagement;
    private Boolean fulfilComputingEthics;
    private Boolean fulfilInterAndCrossDisciplinary;
    private Boolean fulfilUniversityPillars;
    private Boolean fulfilComputerScienceFoundation;
    private Boolean fulfilBreadthAndDepthFocusArea;
    private Boolean fulfilBreadthAndDepth4k;
    private Boolean fulfilInternship;
    private Boolean fulfilCPCourseRestriction;
    private Boolean fulfilBreadthAndDepth;
    private Boolean fulfilMathAndScience;
    private Boolean fulfilUnrestrictedElectives;
    private Boolean canGraduate;
}
