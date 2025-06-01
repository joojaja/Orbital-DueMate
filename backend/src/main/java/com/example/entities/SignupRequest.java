package com.example.entities;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// DTO for the registration request that will be sent from the client to the server.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String name;
    private String email;
    private String password;

    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
    }

}
