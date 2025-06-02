package com.example.security.jwt;

import io.jsonwebtoken.*;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.util.Date;

import com.example.security.services.*;

// Contains utility methods related to JWT
@Component
public class JWTUtility {
    // Get JWT Secret key from application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    // Get JWT expiration time from application.properties
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;
    
    // Generate JWT
    @SuppressWarnings("deprecation")
    public String generateJwtToken(Authentication authentication) {
        // User that we are authenticating, we convert it into our representation of the user
        OurUserDetails user = (OurUserDetails) authentication.getPrincipal();
        
        // Creation of JWT
        return Jwts.builder().setSubject((user.getUsername())).setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact(); // convert into the final string
    }
    
    @SuppressWarnings("deprecation")
    public String getEmailFromJWT(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }
    
    @SuppressWarnings("deprecation")
    public boolean validateJwtToken(String authenticationToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authenticationToken);
            return true;
        } catch (Exception e) {
            Logger logger = LoggerFactory.getLogger(JWTUtility.class);
            logger.error("Exception occured: {}, e");
        } 
        return false;
    }
}
