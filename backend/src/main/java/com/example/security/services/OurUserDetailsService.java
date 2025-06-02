package com.example.security.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.repository.*;
import com.example.models.*;

// Implement UserDetailsService to load our user based on their email.
// Spring service
@Service
public class OurUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    
    public OurUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    // Database transaction 
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User with email: " + email + " does not exist"));
        
        return OurUserDetails.build(user);
    }
}