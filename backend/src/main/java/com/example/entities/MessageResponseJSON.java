package com.example.entities;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

// DTO for a message response that will be sent to the client, used for example in error messages or confirmation upon successful registration
@Getter
@Setter
@RequiredArgsConstructor
public class MessageResponseJSON {
    private final String message;
}