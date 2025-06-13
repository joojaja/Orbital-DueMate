package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.security.jwt.*;

// Configures Spring Security
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final AuthenticationTokenFilter authenticationTokenFilter;
    
    public SecurityConfig(AuthenticationTokenFilter authenticationTokenFilter) {
        this.authenticationTokenFilter = authenticationTokenFilter;
    }


    // Let Spring manage the returned object as beans
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Let Spring manage the returned object as beans
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Let Spring manage the returned object as beans
    // Filter to allow access to the /api/auth endpoint for register and login with a Authorization header with valid token
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless sessions: server doesnt store user info but uses the token to check
            .cors(cors -> cors
                .configurationSource(configureCORS()) // Use the CORS config
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // For /api/auth/.... do not require authentication
                .anyRequest().authenticated()
            ).addFilterBefore(authenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }


    // CORS connfiguration
    @Bean
    public CorsConfigurationSource configureCORS() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000"); // Allowed endpoint to call backend
        config.addAllowedMethod("*"); // Allow all REST methods call
        config.addAllowedHeader("Authorization"); // Allow headers with Authorization which we use for JWT
        config.addAllowedHeader("Content-Type");
        config.setMaxAge(3600L);
        config.setAllowCredentials(true);

        // Set our config to all endpoints from frontend
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    } 
}
