package com.example.entities;

import lombok.Data;

@Data
public class ChangeEmailRequest {
    private String currentEmail;
    private String newEmail;
}
