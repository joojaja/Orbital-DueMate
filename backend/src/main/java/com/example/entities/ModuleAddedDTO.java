package com.example.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// DTO to get the module added by the uiser
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleAddedDTO {
    String moduleCode;
    Integer moduleCredit;
    String category;
    String subcategory;
    String subsubcategory;
    Integer level;
    String secondCategory;
}
