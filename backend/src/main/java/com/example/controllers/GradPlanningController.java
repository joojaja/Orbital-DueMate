package com.example.controllers;

import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.entities.CalendarEventJSON;
import com.example.entities.FulfilRequirementsDTO;
import com.example.entities.GetUserModulesJSON;
import com.example.entities.MessageResponseJSON;
import com.example.entities.ModuleAddedDTO;
import com.example.entities.RequirementsCreditTotalDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.models.*;
import com.example.repository.*;


@RestController
public class GradPlanningController {
    private UserRepository userRepository;
    private ModulesRepository modulesRepository;
    private CourseSelectionRepository courseSelectionRepository;

    public GradPlanningController(UserRepository userRepository, ModulesRepository modulesRepository, CourseSelectionRepository courseSelectionRepository) {
        this.userRepository = userRepository;
        this.modulesRepository = modulesRepository;
        this.courseSelectionRepository = courseSelectionRepository;
    }

    // Return all the modules and info for autocomplete
    @GetMapping("/planning/modules/read")
    public ResponseEntity<?> getModules() {
        try {
            // Read JSON file
            ObjectMapper objectMapper = new ObjectMapper();
            ClassPathResource json = new ClassPathResource("db/full_categorized_modules_v9.json");

            // Return the JSON file
            return ResponseEntity.status(200).body(objectMapper.readValue(json.getInputStream(), List.class));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the modules: " + e));
        }
    }

    // Return all the supported courses for graduation planning
    @GetMapping("/planning/supportedCourses/read")
    public ResponseEntity<?> getSupportCourses() {
        try {
            // Read JSON file
            ObjectMapper objectMapper = new ObjectMapper();
            ClassPathResource json = new ClassPathResource("db/supported_courses.json");

            // Return the JSON file
            return ResponseEntity.status(200).body(objectMapper.readValue(json.getInputStream(), List.class));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the courses: " + e));
        }
    }

    // Return all the current course the user has selected previously
    @GetMapping("/planning/selectedCourse/read/{id}")
    public ResponseEntity<?> getSelectedCourse(@PathVariable Long id) {
        try {
            // Get the current user
            User user = this.userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));
            CourseSelection courseSelection = this.courseSelectionRepository.findByUser(user).orElseThrow(() -> new Exception("Course not found"));

            // Return the JSON file
            return ResponseEntity.status(200).body(courseSelection.getCourseSelection());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the courses: " + e));
        }
    }

    // Update the selected course for the user
    @PutMapping("/planning/selectedCourse/update/{id}/{course}")
    public ResponseEntity<?> updateSelectedCourse(@PathVariable Long id, @PathVariable String course) {
        try {
            // Update calendar event
            User user = this.userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));
            this.courseSelectionRepository.updateCourseByUser(course, user);

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Calendar event updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during calendar event update: " + e));
        }
    }




    /**
     * TODO:
     * 1) Create a new table called gradselection to store the current dropdown of the course selected for grad planning
     * 2) When returning data collapse all the other categories apart from University Pillars and Unrestricted Electives to Programme Requirements,
     * however leave the checking of fulfiling the requirements as the same
     * 3) Format the data properly for the 3 other degrees, and also work on the logic for fulfilling the requirements
     * 4) Add the dropdown to the frontend to select the course
     */
    @GetMapping("/planning/modules/saved/read/{id}")
    public ResponseEntity<?> getUserModules(@PathVariable Long id) {
        try {
            // Get the current user and query the DB or the respectively categories of the user
            User user = this.userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));

            List<Modules> universityPillars = this.modulesRepository.getSubCategories(user, "University Pillars");
            List<Modules> unrestrictedElectives = this.modulesRepository.getCategories(user, "Unrestricted Elective");
            List<Modules> programmeRequirements = this.modulesRepository.getProgrammeRequirements(user);
            
            Integer programmeRequirementsCreditTotal = this.modulesRepository.getProgrammeRequirementsCreditSum(user);
            programmeRequirementsCreditTotal =  programmeRequirementsCreditTotal == null ? 0 : programmeRequirementsCreditTotal;
            // List<Modules> compSciFoundation = this.modulesRepository.getCategories(user, "Computer Science Foundation");
            // List<Modules> compSciBreadthAndDepth = this.modulesRepository.getCategories(user, "Breadth and Depth");
            // List<Modules> mathAndScience = this.modulesRepository.getCategories(user, "Mathematics and Sciences");

            // University Pillars
            Boolean fulfilDigitalLiteracy = fulfilDigitalLiteracy(user);
            Boolean fulfilCritiqueAndExpression = fulfilCritiqueAndExpression(user);
            Boolean fulfilCultureAndConnections = fulfilCultureAndConnections(user);
            Boolean fulfilDataLiteracy = fulfilDataLiteracy(user);
            Boolean fulfilSingaporeStudies = fulfilSingaporeStudies(user);
            Boolean fulfilCommunitiesAndEngagement = fulfilCommunitiesAndEngagement(user);
            Boolean fulfilComputingEthics = fulfilComputingEthics(user);
            Boolean fulfilInterAndCrossDisciplinary = fulfilInterAndCrossDisciplinary(user);
            Boolean fulfilUniversityPillars = fulfilDigitalLiteracy && fulfilCritiqueAndExpression && fulfilCultureAndConnections && fulfilDataLiteracy && fulfilSingaporeStudies
            && fulfilCommunitiesAndEngagement && fulfilComputingEthics && fulfilInterAndCrossDisciplinary;

            Integer universityPillarCreditTotal =  this.modulesRepository.getSubCategoryCreditSum(user, "University Pillars");
            // Check if is null, if null means no mods for this category found
            universityPillarCreditTotal =  universityPillarCreditTotal == null ? 0 : universityPillarCreditTotal;


            // UEs
            Boolean fulfilUnrestrictedElectives = fulfilUnrestrictedElectives(user);
            Integer unrestrictedElectivesCreditTotal =  this.modulesRepository.getCategoryCreditSum(user, "Unrestricted Elective");
            // Check if is null, if null means no mods for this category found
            unrestrictedElectivesCreditTotal =  unrestrictedElectivesCreditTotal == null ? 0 : unrestrictedElectivesCreditTotal;


            CourseSelection courseSelection= this.courseSelectionRepository.findByUser(user).orElseThrow(() -> new Exception("Course selection not found for user"));
            String course = courseSelection.getCourseSelection();
            Boolean fulfilProgrammeRequirements = false;
            
            switch(course) {
                case "CompSci":
                    // CS Foundation
                    Boolean fulfilComputerScienceFoundation = fulfilComputerScienceFoundation(user);
                    Integer CSFoundationCreditTotal=  this.modulesRepository.getCategoryCreditSum(user, "Computer Science Foundation");
                    // Check if is null, if null means no mods for this category found
                    CSFoundationCreditTotal =  CSFoundationCreditTotal == null ? 0 : CSFoundationCreditTotal;

                    // Breadth and Depth
                    Boolean fulfilBreadthAndDepthFocusArea = fulfilBreadthAndDepthFocusArea(user);
                    Boolean fulfilBreadthAndDepth4k = fulfilBreadthAndDepth4k(user);
                    Boolean fulfilInternship = fulfilInternship(user);
                    Boolean fulfilCPCourseRestriction = fulfilCPCourseRestriction(user);
                    Boolean fulfilBreadthAndDepth = fulfilBreadthAndDepth(user);
                    Integer breadthAndDepthCreditTotal=  this.modulesRepository.getCategoryCreditSum(user, "Breadth and Depth");
                    // Check if is null, if null means no mods for this category found
                    breadthAndDepthCreditTotal =  breadthAndDepthCreditTotal == null ? 0 : breadthAndDepthCreditTotal;

                    // Math and Science
                    Boolean fulfilMathAndScience = fulfilMathAndScience(user);
                    Integer mathAndScienceCreditTotal =  this.modulesRepository.getCategoryCreditSum(user, "Mathematics and Sciences");
                    // Check if is null, if null means no mods for this category found
                    mathAndScienceCreditTotal =  mathAndScienceCreditTotal == null ? 0 : mathAndScienceCreditTotal;

                    fulfilProgrammeRequirements = fulfilComputerScienceFoundation && fulfilBreadthAndDepth && fulfilMathAndScience;
                    
            }

            Boolean canGraduate = fulfilUniversityPillars && fulfilProgrammeRequirements && fulfilUnrestrictedElectives;

            return ResponseEntity.status(200).body(new GetUserModulesJSON(universityPillars, unrestrictedElectives, programmeRequirements, 
            new FulfilRequirementsDTO(fulfilUniversityPillars, fulfilUnrestrictedElectives, fulfilProgrammeRequirements, canGraduate),
            new RequirementsCreditTotalDTO(universityPillarCreditTotal, unrestrictedElectivesCreditTotal, programmeRequirementsCreditTotal)));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong retrieving the modules: " + e));
        }
    }


    // POST API
    // Rmb to add special check for CS2103T/ CS2103 only can take one, if one exists cannot add the other
    
    @PostMapping("/planning/modules/add/{id}")
    public ResponseEntity<?> addModuleForUser(@PathVariable Long id, @RequestBody ModuleAddedDTO moduleAddedDTO) {
        try {
            // Get the current user and query the DB or the respectively categories of the user
            User user = this.userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));

            // Check if user already added this module
            if (this.modulesRepository.existsByModuleCodeAndUser(moduleAddedDTO.getModuleCode(), user)) {
                throw new IllegalStateException("Module has already been added");
            }   
            
            String moduleCode = moduleAddedDTO.getModuleCode();
            Integer moduleCredit = moduleAddedDTO.getModuleCredit();
            String category = moduleAddedDTO.getCategory();
            String subcategory = moduleAddedDTO.getSubcategory();
            String subsubcategory = moduleAddedDTO.getSubsubcategory();
            String secondCategory = moduleAddedDTO.getSecondCategory();
            Integer level = moduleAddedDTO.getLevel();
            
            // Only one of either CS2103/CS2103T can be added
            if ((moduleCode.equals("CS2103") && this.modulesRepository.existsByModuleCodeAndUser("CS2103T", user)) 
            || (moduleCode.equals("CS2103") && this.modulesRepository.existsByModuleCodeAndUser("CS2103T", user))) {
                throw new IllegalStateException("Only one of either CS2103/CS2103T can be added");
            }


            // Checks as we might need to recategorize it to UE or throw an error since the user is not allowed to add this mod cuz of restrictions
            switch(category) {
                case "Cultures and Connections":
                    if(fulfilCultureAndConnections(user)) {
                        category = "Unrestricted Elective";
                    }
                    break;
                case "Data Literacy":
                    if (fulfilDataLiteracy(user)) {
                        category = "Unrestricted Elective";
                    }
                    break;
                case "Singapore Studies":
                    if (fulfilSingaporeStudies(user)) {
                        category = "Unrestricted Elective";
                    }
                    break;
                case "Communities and Engagement":
                    if (fulfilCommunitiesAndEngagement(user)) {
                        category = "Unrestricted Elective";
                    }
                    break;
                case "Interdisciplinary":
                    if (fulfilInterAndCrossDisciplinary(user)) {
                        category = "Unrestricted Elective";
                    }
                    break;
                case "Cross-Disciplinary":
                    if (fulfilInterAndCrossDisciplinary(user) || !acceptableIfAddCross(user)) {
                        category = "Unrestricted Elective";
                    }
                    break;
                case "Internship":
                    if (getCompletedInternshipCredits(user) + moduleCredit > 12) {
                        throw new IllegalStateException("Adding this internship will violate the restriction for Industry Experience courses");
                    }
                case "Breadth and Depth":
                    if (subcategory.equals("CP") && getCompletedCPCredits(user) + moduleCredit > 12) {
                        category = "Unrestricted Elective";
                    }
                default:
            }



            Modules module = new Modules(moduleCode, moduleCredit, category, subcategory, 
            subsubcategory, user, secondCategory, level);

            this.modulesRepository.save(module);

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Module added successfully!"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(new MessageResponseJSON(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong adding the modules: " + e));
        }
    }

    @DeleteMapping("/planning/modules/delete/{id}")
    public ResponseEntity<?> deleteAddedModuleForUser(@PathVariable Long id) {
        try {
            // Delete module for user
            this.modulesRepository.deleteModuleById(id);

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Module deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during deleting module: " + e));
        }
    }

    @DeleteMapping("/planning/modules/reset/{id}")
    public ResponseEntity<?> resetModules(@PathVariable Long id) {
        try {
            // Delete all modules for user
            User user = this.userRepository.findById(id).orElseThrow(() -> new Exception("User not found"));
            this.modulesRepository.deleteByUser(user);

            // Return a success message
            return ResponseEntity.status(200).body(new MessageResponseJSON("Module resetted for user successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponseJSON("Something went wrong during deleting module: " + e));
        }
    }


    // Functions to check if a user fulfils the said requirements

    // *** Check for fulfilment of University Pillars
    public boolean fulfilDigitalLiteracy(User user) {
        if (modulesRepository.getCategories(user, "Digital Literacy").size() == 1) {
            return true;
        }
        return false;
    }

    public boolean fulfilCritiqueAndExpression(User user) {
        if (modulesRepository.getCategories(user, "Critique and Expression").size() == 1) {
            return true;
        }
        return false;
    }

    public boolean fulfilCultureAndConnections(User user) {
        if (modulesRepository.getCategories(user, "Cultures and Connections").size() == 1) {
            return true;
        }
        return false;
    }

    public boolean fulfilDataLiteracy(User user) {
        if (modulesRepository.getCategories(user, "Data Literacy").size() == 1) {
            return true;
        }
        return false;
    }

    public boolean fulfilSingaporeStudies(User user) {
        if (modulesRepository.getCategories(user, "Singapore Studies").size() == 1) {
            return true;
        }
        return false;
    }

    public boolean fulfilCommunitiesAndEngagement(User user) {
        if (modulesRepository.getCategories(user, "Communities and Engagement").size() == 1) {
            return true;
        }
        return false;
    } 

    public boolean fulfilComputingEthics(User user) {
        if (modulesRepository.getCategories(user, "Computing Ethics").size() == 1) {
            return true;
        }
        return false;
    } 

    public boolean fulfilInterAndCrossDisciplinary(User user) {
        int interCount = modulesRepository.getCategories(user, "Interdisciplinary").size();
        int crossCount = modulesRepository.getCategories(user, "Cross-Disciplinary").size();
        int totalInterAndCrossCount = interCount + crossCount;

        if (totalInterAndCrossCount == 3 && crossCount <= 1) {
            return true;
        }

        return false;
    }


    // If false just throw to UE if true throw to CD
    // For inter just need to check fulfilInterAndCrossDisciplinary if true throw to UE if false just throw to ID
    public boolean acceptableIfAddCross(User user) {
        int crossCount = modulesRepository.getCategories(user, "Cross-Disciplinary").size();

        if (crossCount + 1 <= 1) {
            return true;
        }

        return false;
    } 


    // *** Check for fulfilment of CS Foundations
    public boolean fulfilComputerScienceFoundation(User user) {
        int csFoundationCount = modulesRepository.getCategories(user, "Computer Science Foundation").size();

        if (csFoundationCount == 9) {
            return true;
        }

        return false;
    } 

    // *** Check for fulfilment of Breadth and Depth 
    
    // Check for fulfilment of Breadth and Depth Focus Area
    public boolean fulfilBreadthAndDepthFocusArea(User user) {
        String[] focusAreaCategory = new String[]{"Algorithms & Theory", "Artificial Intelligence", "Computer Graphics and Games", 
        "Computer Security", "Database Systems", "Multimedia Information Retrieval", "Networking and Distributed Systems", "Parallel Computing",
        "Programming Languages", "Software Engineering"};

        boolean fulfilled = false;

        for (int i = 0; i < focusAreaCategory.length; i++) {
            int threeKCount = modulesRepository.countForBreadthAndDepth(user, "Breadth and Depth", focusAreaCategory[i], "primary", 3);
            int fourKCount = modulesRepository.countForBreadthAndDepth(user, "Breadth and Depth", focusAreaCategory[i], "primary", 4);
            

            // For special cases of double counting like CS2109S, CS2103/CS2103T, CS3230
            threeKCount += modulesRepository.countForBreadthAndDepth(user, "Computer Science Foundation", focusAreaCategory[i], "primary", 3);
            fourKCount += modulesRepository.countForBreadthAndDepth(user, "Computer Science Foundation", focusAreaCategory[i], "primary", 4);

            /*
             * "category": "Computer Science Foundation",
                "subcategory": "Artificial Intelligence",
                "subsubcategory": "primary",
                "level": 2,
                "secondCategory": "Breadth and Depth"
             */
            int totalCount = threeKCount + fourKCount;

            if (fourKCount >= 1 && totalCount >= 3) {
                fulfilled = true;
            }
        }

        return fulfilled;
    } 

    // Check if the 4ks in Breadth and Depth module credit is >= 12MCS
    public boolean fulfilBreadthAndDepth4k(User user) {
        Integer credits = modulesRepository.get4kCreditSum(user, "Breadth and Depth", 4);

        if (credits == null) {
            return false;
        }

        if (credits >= 12) {
            return true;
        }

        return false;
    }


    // Check for fulfilment of Math and Science
    public boolean fulfilMathAndScience(User user) {
        int csFoundationCount = modulesRepository.getCategories(user, "Mathematics and Sciences").size();

        if (csFoundationCount == 3) {
            return true;
        }

        return false;
    } 

    // Get the total credits of internship completed
    public Integer getCompletedInternshipCredits(User user) {
        return modulesRepository.getCategoryCreditSum(user, "Internship");
    }

    // Check for fulfilment of Internship/ Industry Experience
    public boolean fulfilInternship(User user) {
        Integer credits = getCompletedInternshipCredits(user);
        
        // If null means no internship courses
        if (credits == null && this.modulesRepository.getCategories(user, "FYP").size() == 1)  {
            return true;
        } else if (credits == null) {
            return false;
        }

        if (credits >= 6 && credits <= 12) {
            return true;
        }

        return false;
    }

    // Get the total credits of CP Courses
    // If Current CP sum + current module to add > 12 cant add
    public Integer getCompletedCPCredits(User user) {
        return modulesRepository.getSubCategoryCreditSum(user, "CP");
    }
    

    // Check for fulfilment of CP courses restriction
    public boolean fulfilCPCourseRestriction(User user) {
        Integer credits = getCompletedCPCredits(user);

        // If null means not CP courses in db for the user
        if (credits == null || credits <= 12) {
            return true;
        }

        return false;
    }

    // Check for fulfilment of CP courses restriction
    public boolean fulfilBreadthAndDepth(User user) {
        Integer credits = this.modulesRepository.getCategoryCreditSum(user, "Breadth and Depth");

        if (credits == null) {
            return false;
        }

        // If null means not CP courses in db for the user
        if (credits >= 32 && fulfilBreadthAndDepthFocusArea(user) && fulfilBreadthAndDepth4k(user) && fulfilInternship(user) && fulfilCPCourseRestriction(user)) {
            return true;
        }

        return false;
    }

    // Get the total credits of internship completed
    public Integer getCompletedUnrestrictedElectivesCreditSum(User user) {
        return modulesRepository.getCategoryCreditSum(user, "Unrestricted Elective");
    }

    // Check for fulfilment of Math and Science
    public boolean fulfilUnrestrictedElectives(User user) {
        Integer credits = getCompletedUnrestrictedElectivesCreditSum(user);

        // If null means not CP courses in db for the user
        if (credits == null) {
            return false;
        }

        if (credits >= 40) {
            return true;
        }

        return false;
    }

}


