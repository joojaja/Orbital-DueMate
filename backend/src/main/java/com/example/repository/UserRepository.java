package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.models.User;

import java.util.Optional;

// Basically the queries that we perform on the user table simplified by JPA's Repository interface
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
    Boolean existsByName(String name);
    Boolean existsByEmail(String email);
}
