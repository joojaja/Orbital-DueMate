package com.example.security.jwt;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;

import com.example.security.services.*;

// Filter to intercept HTTP requests to check their header for a valid JWT.
@Component
public class AuthenticationTokenFilter extends OncePerRequestFilter {
    private final JWTUtility jwtUtils;
    private final OurUserDetailsService ourUserDetailsService;
    
    public AuthenticationTokenFilter(JWTUtility jwtUtils, OurUserDetailsService ourUserDetailsService) {
        this.jwtUtils = jwtUtils;
        this.ourUserDetailsService = ourUserDetailsService;
    }

    // Do not filter requests that start with "/api/auth/". Since it is for login and registration.
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getServletPath().startsWith("/api/auth/");
    }
    
    // Extract JWT from Authorization header
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        // Check for Authorization header and that it starts with Bearer
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            // Get the token from the header
            return headerAuth.substring(7);
        }
        
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            // Extract JWT
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // Get email 
                String email = jwtUtils.getEmailFromJWT(jwt);
                
                // Load user info from DB using email
                UserDetails userDetails = this.ourUserDetailsService.loadUserByUsername(email);

                // Create authentication token and set it in security context
                // Basically to tell Spring Security that we have authenticated the current user
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Error setting user authentication: {}", e);
        }
        
        // Continue with the rest of the filters
        filterChain.doFilter(request, response);
    }
}
