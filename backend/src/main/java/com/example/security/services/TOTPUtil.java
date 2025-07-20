package com.example.security.services;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

public class TOTPUtil {

    public static String generateSecret() {
        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        GoogleAuthenticatorKey credentials = gAuth.createCredentials();
        return credentials.getKey();
    }

    public static String getOtpAuthURL(String email, String secret) {
        String issuer = "DueMate";
        return String.format("otpauth://totp/%s:%s?secret=%s&issuer=%s", issuer, email, secret, issuer);
    }

    public static boolean verifyCode(String secret, String code) {
        com.warrenstrange.googleauth.GoogleAuthenticator gAuth = new com.warrenstrange.googleauth.GoogleAuthenticator();
        return gAuth.authorize(secret, Integer.parseInt(code));
    }
}
