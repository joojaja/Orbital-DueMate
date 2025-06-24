package com.example.controllers;

import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.entities.MessageResponseJSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.models.Modules;

@RestController
public class GradPlanningController {
    @GetMapping("/planning/modules/read")
    public ResponseEntity<?> getModules() {
        try {
            // Read JSON file
            ObjectMapper objectMapper = new ObjectMapper();
            ClassPathResource json = new ClassPathResource("db/full_categorized_modules_v3.json");

            // Return the json file
            return ResponseEntity.status(200).body(objectMapper.readValue(json.getInputStream(), List.class));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the modules: " + e));
        }
    }
}
