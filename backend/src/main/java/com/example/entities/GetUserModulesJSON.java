package com.example.entities;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.*;
import com.example.models.Modules;

// JSON that we return of the user's modules added
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserModulesJSON {
    private List<Modules> universityPillars;
    // private List<Modules> compSciFoundation;
    // private List<Modules> compSciBreadthAndDepth;
    // private List<Modules> mathAndScience;
    private List<Modules> unrestrictedElectives;
    private List<Modules> programmeRequirements;
    private FulfilRequirementsDTO fulfilRequirements;
    private RequirementsCreditTotalDTO creditTotalForRequirements;

}