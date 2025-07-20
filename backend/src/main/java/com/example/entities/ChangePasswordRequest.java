package com.example.entities;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String currentPassword;
    private String newPassword;
}
