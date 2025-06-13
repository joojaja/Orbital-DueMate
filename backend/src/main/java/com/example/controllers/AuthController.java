package com.example.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.repository.*;
import com.example.security.jwt.*;
import com.example.security.services.*;
import com.example.models.*;
import com.example.entities.*;
// import java.util.Date;

@RestController
// Set mapping
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtility jwtUtility;
    
    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
            PasswordEncoder passwordEncoder, JWTUtility jwtUtility) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtility = jwtUtility;
    }

    // the endpoint for user login; /api/auth/signin
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequestJSON loginRequest) {
        try {
            // Authenticate/ Valid the user using the authentication manager
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            // Set authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String jwt = this.jwtUtility.generateJwtToken(authentication);

            // Get all of the user details from the authentication object
            OurUserDetails userDetails = (OurUserDetails) authentication.getPrincipal();

            // Return JSON response with the JWT token and user details
            return ResponseEntity.ok(new JwtResponseJSON(jwt, userDetails.getId(),
                userDetails.getName(), userDetails.getUsername(), "Bearer"));

        } catch (Exception e) {
            // Return error if invalid details
            return ResponseEntity.status(401).body(new MessageResponseJSON("Invalid username or password"));
        }
    }

    @PostMapping("/signup") // the endpoint for user register; /api/auth/signin
    public ResponseEntity<?> registerUser(@RequestBody SignupRequestJSON signUpRequest) {
        // Check if the email is already taken
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            // Return error response if email is already in use
            return ResponseEntity.status(409).body(new MessageResponseJSON("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getName(), signUpRequest.getEmail(), passwordEncoder.encode(signUpRequest.getPassword()));
        userRepository.save(user);

        // Return a success message
        return ResponseEntity.status(200).body(new MessageResponseJSON("User registered successfully!"));
    }
}
