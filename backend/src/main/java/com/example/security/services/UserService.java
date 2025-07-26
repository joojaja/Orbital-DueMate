package com.example.security.services;

import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.time.LocalDate;

import com.google.zxing.WriterException;

import com.example.models.User;
import com.example.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final QRCodeService qrCodeService;

    public boolean is2FAEnabled(String email) {
        return userRepository.findByEmail(email)
            .map(User::isOtpEnabled)
            .orElse(false);
    }

    public String enable2FA(String email) throws WriterException, IOException {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (user.getOtpSecretKey() == null || user.getOtpSecretKey().isEmpty()) {
            user.setOtpSecretKey(TOTPUtil.generateSecret());
        }
        user.setOtpEnabled(true);
        userRepository.save(user);
        return qrCodeService.generateQRCodeImageBase64(TOTPUtil.getOtpAuthURL(email, user.getOtpSecretKey()));
    }

    public void disable2FA(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setOtpEnabled(false);
        userRepository.save(user);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void changeEmail(String email, String newEmail) {
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    public void addExp(String email, int amount) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setExp(user.getExp() + amount);
        userRepository.save(user);
    }

    public void handleTaskCompletion(User user) {
        LocalDate lastDate = user.getLastTaskCompletionDate();
        LocalDate today = LocalDate.now();

        if (lastDate != null && lastDate.plusDays(1).equals(today)) {
            // Consecutive day: increment streak
            user.setDailyStreak(user.getDailyStreak() + 1);
        } else if (lastDate == null || lastDate.isBefore(today.minusDays(1))) {
            // Missed a day: reset streak to 1
            user.setDailyStreak(1);
        } 
        // else: same day again, keep current streak

        user.setLastTaskCompletionDate(today);
        user.setTasksCompleted(user.getTasksCompleted() + 1);
    }

}
