package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import com.example.models.CalendarEvents;

import java.time.Instant;
import java.util.List;
import com.example.models.User;

// Basically the queries that we perform on the user table simplified by JPA's Repository interface
public interface CalendarEventsRepository extends JpaRepository<CalendarEvents, Long> {
    // To get all calendar events of a user
    List<CalendarEvents> findByUser(User user);

    // To update a calendar event by its id
    @Modifying
    @Transactional // DB transaction
    @Query("UPDATE CalendarEvents c SET c.name = :name, c.dateTime = :dateTime, c.allDay = :allDay WHERE c.id = :id")
    void updateEventbyId(@Param("id") Long id, @Param("name") String name, 
    @Param("dateTime") Instant dateTime, @Param("allDay") Boolean allDay); // @Param binds method params to query params

    // To delete a calendar event by its id
    @Modifying
    @Transactional
    @Query("DELETE FROM CalendarEvents c WHERE c.id = :id")
    void deleteEventById(@Param("id") Long id);
}

