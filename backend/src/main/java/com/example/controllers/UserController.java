package com.example.controllers;

import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import com.google.zxing.WriterException;

import com.example.security.services.*;
import com.example.security.jwt.*;
import com.example.entities.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JWTUtility jwtUtility;
    private final OurUserDetailsService userDetailsService;

    @GetMapping("/2fa-status")
    public ResponseEntity<?> get2FAStatus(@RequestHeader("Authorization") String tokenHeader) {
        String email = jwtUtility.getEmailFromJWT(tokenHeader.substring(7));;
        return ResponseEntity.ok(Map.of("twoFactorEnabled", userService.is2FAEnabled(email)));
    }

    @PostMapping("/2fa/enable")
    public ResponseEntity<?> enable2FA(@RequestHeader("Authorization") String tokenHeader) throws WriterException, IOException {
        String email = jwtUtility.getEmailFromJWT(tokenHeader.substring(7));
        String qrCodeImage = userService.enable2FA(email);
        return ResponseEntity.ok(Map.of("qrCodeImage", qrCodeImage));
    }

    @PostMapping("/2fa/disable")
    public ResponseEntity<?> disable2FA(@RequestHeader("Authorization") String tokenHeader) {
        String email = jwtUtility.getEmailFromJWT(tokenHeader.substring(7));
        userService.disable2FA(email);
        return ResponseEntity.ok(Map.of("message", "2FA disabled"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String tokenHeader) {
        String email = jwtUtility.getEmailFromJWT(tokenHeader.substring(7));
        return ResponseEntity.ok(Map.of("email", email));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String tokenHeader, @RequestBody ChangePasswordRequest request) {
        String email = jwtUtility.getEmailFromJWT(tokenHeader.substring(7));
        userService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String jwt = jwtUtility.generateJwtToken(authentication);

        return ResponseEntity.ok(Map.of("token", jwt));
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(@RequestHeader("Authorization") String tokenHeader, @RequestBody ChangeEmailRequest request) {
        String email = jwtUtility.getEmailFromJWT(tokenHeader.substring(7));
        userService.changeEmail(email, request.getNewEmail());

        // Use the new email for token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getNewEmail());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String jwt = jwtUtility.generateJwtToken(authentication);

        return ResponseEntity.ok(Map.of("token", jwt));
    }
}


