package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.models.CalendarInvites;
import com.example.models.User;
import java.util.Optional;

// Basically the queries that we perform on the CalendarInvites table simplified by JPA's Repository interface
public interface CalendarInvitesRepository extends JpaRepository<CalendarInvites, Long> {
    // To update a calendar invite status by its id
    @Modifying
    @Transactional // DB transaction
    @Query("UPDATE CalendarInvites c SET c.status = :status WHERE c.id = :id")
    void updateEventbyId(@Param("id") Long id, @Param("status") String status); // @Param binds method params to query params

    // To check if invite already exists
    @Transactional // DB transaction
    @Query("SELECT c FROM CalendarInvites c where c.user = :user AND c.invitedByUser = :invitedUser AND c.status = 'pending'")
    Optional<CalendarInvites> checkIfInviteExists(@Param("user") User user, @Param("invitedUser") User invitedUser); // @Param binds method params to query params

    // To check if user accepted invite already
    @Transactional // DB transaction
    @Query("SELECT c FROM CalendarInvites c where c.user = :user AND c.invitedByUser = :invitedUser AND c.status = 'accepted'")
    Optional<CalendarInvites> checkIfInviteAccepted(@Param("user") User user, @Param("invitedUser") User invitedUser); // @Param binds method params to query params

    // To delete a calendar event by its id
    @Modifying
    @Transactional
    @Query("DELETE FROM CalendarInvites c WHERE c.user = :user AND c.invitedByUser = :invitingUser")
    void deleteInviteByIds(@Param("user") User userId, @Param("invitingUser") User otherUserId);
}
