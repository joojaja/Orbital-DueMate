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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    
    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                         PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }
    
    @PostMapping("/signin") // the endpoint for user login; /api/auth/signin
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
        // Authenticate the user using the authentication manager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        // Set the authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Generate JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        // Get all of the user details from the authentication object
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Return JSON response with the JWT token and user details
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername()));

        } catch (Exception e) {
            // If the details are invalid, return an error response
            return ResponseEntity
            .status(401)
            .body(new MessageResponse("Invalid username or password"));
        }
    }
    
    @PostMapping("/signup") // the endpoint for user register; /api/auth/signin
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        // if (userRepository.existsByUsername(signUpRequest.getUsername())) {
        //     return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        // }
        
        // Check if the email is already taken
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            // Return error response if email is already in use
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        
        // Create new user's account
        User user = new User(
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()));
        userRepository.save(user);
        
        // Return a success message
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
