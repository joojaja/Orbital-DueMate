package com.example.entities;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// DTO for the login request that the server will receive from the client.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestJSON {
    private String email;
    private String password;
}