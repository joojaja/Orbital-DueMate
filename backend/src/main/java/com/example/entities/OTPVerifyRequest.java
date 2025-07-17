package com.example.entities;

import lombok.Data;

@Data
public class OTPVerifyRequest {
    private String tempToken;
    private String otp;
}