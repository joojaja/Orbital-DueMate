package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.models.Modules;

import java.util.List;
import com.example.models.User;

// Basically the queries that we perform on the Modules table simplified by JPA's Repository interface
public interface ModulesRepository extends JpaRepository<Modules, Long> {
    // To get all modules of a user
    List<Modules> findByUser(User user);

    @Transactional
    void deleteByUser(User user);
    
    // Check if a moduleCode already exists for a user
    Boolean existsByModuleCodeAndUser(String moduleCode, User user);

    // Get the programme requirement modules for a user
    @Transactional
    @Query("SELECT m FROM Modules m where m.user = :user AND m.subcategory != 'University Pillars' AND m.category != 'Unrestricted Elective'")
    List<Modules> getProgrammeRequirements(@Param("user") User user);

    // Get the programme requirement credit sum
    @Transactional
    @Query("SELECT SUM(m.moduleCredit) FROM Modules m where m.user = :user AND m.subcategory != 'University Pillars' AND m.category != 'Unrestricted Elective'")
    Integer getProgrammeRequirementsCreditSum(@Param("user") User user);

    // Get count for checking of fulfilment of breadth and depth
    @Transactional
    @Query("SELECT COUNT(m) FROM Modules m where m.user = :user AND m.category = :category AND m.subcategory = :subcategory AND m.subsubcategory = :subsubcategory AND m.level = :level")
    Integer countForBreadthAndDepth(@Param("user") User user, @Param("category") String category, 
    @Param("subcategory") String subcategory, @Param("subsubcategory") String subsubcategory, @Param("level") Integer level);

    // Get count for number of that category
    @Transactional
    @Query("SELECT COUNT(m) FROM Modules m where m.user = :user AND m.category = :category")
    Integer countForCategory(@Param("user") User user, @Param("category") String category);

    // Get count for number of that category and subcategory
    @Transactional
    @Query("SELECT COUNT(m) FROM Modules m where m.user = :user AND m.category = :category AND m.subcategory = :subcategory")
    Integer countForCategoryAndSubCategory(@Param("user") User user, @Param("category") String category, @Param("subcategory") String subcategory);

    // Get count for number of that category and level
    @Transactional
    @Query("SELECT COUNT(m) FROM Modules m where m.user = :user AND m.category = :category AND m.level = :level")
    Integer countForCategoryAndLevel(@Param("user") User user, @Param("category") String category, @Param("level") Integer level);

    // Get credit sum for number of that category and subcategory and level
    @Transactional
    @Query("SELECT SUM(m.moduleCredit) FROM Modules m where m.user = :user AND m.category = :category AND m.subcategory = :subcategory AND m.level = :level")
    Integer countForCategoryAndSubCategoryAndLevelCreditSum(@Param("user") User user, @Param("category") String category, @Param("subcategory") String subcategory, 
    @Param("level") Integer level);

    // Get Breadth and Depth 4k credits sum
    @Transactional
    @Query("SELECT SUM(m.moduleCredit) FROM Modules m where m.user = :user AND m.category = :category AND m.level = :level")
    Integer get4kCreditSum(@Param("user") User user, @Param("category") String category, @Param("level") Integer level);

    // Get all categories of a user
    @Transactional
    @Query("SELECT m FROM Modules m where m.user = :user AND m.category = :category")
    List<Modules> getCategories(@Param("user") User user, @Param("category") String category);

    // Get all subcategories of a user
    @Transactional
    @Query("SELECT m FROM Modules m where m.user = :user AND m.subcategory = :subcategory")
    List<Modules> getSubCategories(@Param("user") User user, @Param("subcategory") String subcategory);

    // Get sum of credits for the category
    @Transactional
    @Query("SELECT SUM(m.moduleCredit) FROM Modules m where m.user = :user AND m.category = :category")
    Integer getCategoryCreditSum(@Param("user") User user, @Param("category") String category); 

    // Get CP courses credits sum
    @Transactional
    @Query("SELECT SUM(m.moduleCredit) FROM Modules m where m.user = :user AND m.subcategory = :subcategory")
    Integer getSubCategoryCreditSum(@Param("user") User user, @Param("subcategory") String subcategory);

    // To delete a calendar event by its id
    @Modifying
    @Transactional
    @Query("DELETE FROM Modules m WHERE m.id = :id")
    void deleteModuleById(@Param("id") Long id);
}

