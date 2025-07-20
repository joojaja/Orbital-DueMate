package com.example.security.jwt;

import io.jsonwebtoken.*;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.util.Date;

import com.example.security.services.*;
import com.example.models.*;
import com.example.repository.*;

// Contains utility methods related to JWT
@Component
public class JWTUtility {
    // Get JWT Secret key from application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    // Get JWT expiration time from application.properties
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    @Autowired
    private UserRepository userRepository;
    
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
            logger.error("JWT validation error", e);
        } 
        return false;
    }

    // tenporary token for 2FA login
    @SuppressWarnings("deprecation") 
    public String generatePartialToken(User user) {
        return Jwts.builder().setSubject(user.getEmail()).setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 5 * 60 * 1000)) // 5 minutes
            .claim("partial", true)
            .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
    }

    @SuppressWarnings("deprecation")
    public String getEmailFromPartialToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        if (!Boolean.TRUE.equals(claims.get("partial", Boolean.class))) {
            throw new RuntimeException("Not a valid partial token");
        }
        return claims.getSubject();
    }

    @SuppressWarnings("deprecation")
    public User getUserFromPartialToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        if (!Boolean.TRUE.equals(claims.get("partial", Boolean.class))) {
            throw new RuntimeException("Not a valid partial token");
        }
        String email = claims.getSubject();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
