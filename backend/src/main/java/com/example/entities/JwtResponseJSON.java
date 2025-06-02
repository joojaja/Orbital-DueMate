package com.example.entities;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

// DTO of a JWT response that will be sent to the client after successful authentication.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseJSON {
    private String token;
    private String type;
    private Long id;
    private String name;
    private String email;

    public JwtResponseJSON(String token, Long id, String name, String email, String type) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.type = type;
    }
    
}