package com.example.entities;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

// DTO for a message response that will be sent to the client, used for example in error messages or confirmation upon successful registration
@Getter
@RequiredArgsConstructor
public class MessageResponse {
    private final String message;
}