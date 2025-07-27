package com.example.security.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.mail.SimpleMailMessage;

/**
 * Service to send email
 */
@Service
public class EmailService{
    private final JavaMailSender emailSender;

    @Value("${EMAIL_USER}")
    private String senderEmail;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Async
    public void sendSimpleEmail(String receiverEmail, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom(senderEmail);
        message.setTo(receiverEmail); 
        message.setSubject(subject); 
        message.setText(text);
        emailSender.send(message);
    }
}