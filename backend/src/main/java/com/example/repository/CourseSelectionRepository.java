package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.models.CourseSelection;

import com.example.models.User;
import java.util.Optional;

// Basically the queries that we perform on the Modules table simplified by JPA's Repository interface
public interface CourseSelectionRepository extends JpaRepository<CourseSelection, Long> {
    // To get all calendar events of a user
    Optional<CourseSelection> findByUser(User user);

    // To update a the user selected course
    @Modifying
    @Transactional // DB transaction
    @Query("UPDATE CourseSelection c SET c.courseSelection = :course WHERE c.user = :user")
    void updateCourseByUser(@Param("course") String course, @Param("user") User user); // @Param binds method params to query params
}
