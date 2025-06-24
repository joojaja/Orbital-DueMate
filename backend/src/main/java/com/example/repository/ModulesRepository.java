package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.models.Modules;

import java.util.List;
import java.util.Optional;
import com.example.models.User;

// Basically the queries that we perform on the Modules table simplified by JPA's Repository interface
public interface ModulesRepository extends JpaRepository<Modules, Long> {
    // To get all calendar events of a user
    List<Modules> findByUser(User user);

    // Get count for checking of fulfilment of breadth and depth
    @Transactional
    @Query("SELECT COUNT(m) FROM Modules m where m.user = :user AND m.category = :category AND m.subcategory = :subcategory AND m.subsubcategory = :subsubcategory")
    Integer countForBreadthAndDepth(@Param("user") User user, @Param("category") String category, 
    @Param("category") String subcategory, @Param("category") String subsubcategory);

    // Check if a category already exists 
    @Transactional
    @Query("SELECT m FROM Modules m where m.user = :user AND m.category = :category")
    Optional<Modules> checkIfCategoryExists(@Param("user") User user, @Param("category") String category);

    // To delete a calendar event by its id
    @Modifying
    @Transactional
    @Query("DELETE FROM Modules m WHERE m.id = :id")
    void deleteModuleById(@Param("id") Long id);
}

