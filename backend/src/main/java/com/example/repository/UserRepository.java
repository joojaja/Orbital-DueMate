package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.entities.CalendarInvitedDTO;
import com.example.models.User;

import java.util.List;
import java.util.Optional;

// Basically the queries that we perform on the user table simplified by JPA's Repository interface
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
    Boolean existsByName(String name);
    Boolean existsByEmail(String email);

    // Find all the users that have invited the current user and the status is pending; used to display in the notifactions
    @Transactional
    @Query("SELECT c.id as inviteId, u as user FROM User u JOIN CalendarInvites c on c.invitedByUser = u WHERE c.user = :user AND c.status = 'pending'")
    List<CalendarInvitedDTO> findPendingInvitesByUser(@Param("user") User user);
    
    // Find all the users that have invited the current user and the status is accepted; used to display in the dropdown
    @Transactional
    @Query("SELECT u FROM User u JOIN CalendarInvites c on c.invitedByUser = u WHERE c.user = :user AND c.status = 'accepted'")
    List<User> findAcceptedInvitesByUser(@Param("user") User user);
}
