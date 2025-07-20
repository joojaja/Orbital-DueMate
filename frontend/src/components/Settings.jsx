// this page uses MUI and inline CSS for styling

// TODO
// 1. test case for 2FA, change password, change email
// 2. look nicer on phone view

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Switch, FormControlLabel, CircularProgress, Alert, Snackbar, Container, Paper, Divider, TextField, Button } from "@mui/material";
import axios from "axios";
import authenticationService from "../services/authenticationService";

export default function Settings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // states for change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // states for change email
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const jwtToken = authenticationService.getCurrentUser()?.token;
  const apiURL = process.env.REACT_APP_API_URL;

  const [qrCodeImage, setQrCodeImage] = useState(null);

  // Function to fetch the current 2FA status and user email
  const fetchUserSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [twoFaRes, userProfileRes] = await Promise.all([
        axios.get(`${apiURL}/api/user/2fa-status`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }),
        axios.get(`${apiURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }),
      ]);
      setTwoFactorEnabled(twoFaRes.data.twoFactorEnabled);
      setCurrentEmail(userProfileRes.data.email); 
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Failed to fetch settings.");
      setSnackbarMessage("Failed to fetch settings.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [apiURL, jwtToken]);

  // Function to toggle 2FA
  const toggleTwoFactor = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = twoFactorEnabled
        ? `${apiURL}/api/user/2fa/disable`
        : `${apiURL}/api/user/2fa/enable`;

        const response = await axios.post(
          endpoint,
          {},
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );
        
        if (!twoFactorEnabled && response.data.qrCodeImage) {
          setSnackbarMessage("2FA enabled. Scan the QR code below.");
          setQrCodeImage(response.data.qrCodeImage); 
        } else {
          setSnackbarMessage(`Two-factor authentication ${twoFactorEnabled ? "disabled" : "enabled"} successfully!`);
        }
        
      setTwoFactorEnabled((prev) => !prev);
      setSnackbarMessage(
        `Two-factor authentication ${twoFactorEnabled ? "disabled" : "enabled"} successfully!`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error toggling 2FA:", err);
      setError(`Failed to ${twoFactorEnabled ? "disable" : "enable"} 2FA.`);
      setSnackbarMessage(`Failed to ${twoFactorEnabled ? "disable" : "enable"} 2FA.`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [apiURL, jwtToken, twoFactorEnabled]);

  // Function to handle password change
  const handleChangePassword = useCallback(async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      setPasswordLoading(false);
      return;
    }
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All password fields are required.");
      setPasswordLoading(false);
      return;
    }
    if (newPassword.length < 1) { // temporary password restriction
      setPasswordError("New password must be at least 1 characters long.");
      setPasswordLoading(false);
      return;
    }

    try {
      await axios.post(
        `${apiURL}/api/user/change-password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setSnackbarMessage("Password changed successfully! ✅");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMessage = err.response?.data?.message || "Failed to change password. ❌";
      setPasswordError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setPasswordLoading(false);
    }
  }, [apiURL, jwtToken, currentPassword, newPassword, confirmNewPassword]);

  // Function to handle email change
  const handleChangeEmail = useCallback(async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError("");

    if (!newEmail || !currentEmail) {
        setEmailError("All email fields are required.");
        setEmailLoading(false);
        return;
    }
    if (newEmail === currentEmail) {
        setEmailError("New email cannot be the same as the current email.");
        setEmailLoading(false);
        return;
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        setEmailError("Please enter a valid new email address.");
        setEmailLoading(false);
        return;
    }

    try {
      await axios.post(
        `${apiURL}/api/user/change-email`,
        { currentEmail, newEmail }, 
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setSnackbarMessage("Email changed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setCurrentEmail(newEmail); // Update the displayed current email
      setNewEmail("");
    } catch (err) {
      console.error("Error changing email:", err);
      const errorMessage = err.response?.data?.message || "Failed to change email. ❌";
      setEmailError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setEmailLoading(false);
    }
  }, [apiURL, jwtToken, currentEmail, newEmail]);

  useEffect(() => {
    if (jwtToken) {
      fetchUserSettings();
    } else {
      setError("User not authenticated.");
      setLoading(false);
    }
  }, [fetchUserSettings, jwtToken]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 2, md: 3 } }}>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
            Security Settings ⚙️
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={2}>
            Manage your account's security features and personal information.
          </Typography>

          {/* 2FA Section */}
          <Divider sx={{ width: "100%", mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", alignSelf: "flex-start" }}>
            Two-Factor Authentication
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, width: "100%" }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error}
            </Alert>
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                mt: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={toggleTwoFactor}
                    color="primary"
                    disabled={loading}
                  />
                }
                label={
                  <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                    Mobile App Two-Factor Authentication (2FA)
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                {twoFactorEnabled
                  ? "2FA is currently enabled."
                  : "2FA is currently disabled."}
              </Typography>

              {qrCodeImage && (
                <Box sx={{ ml: 4, mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Scan this QR code with your authenticator app:
                  </Typography>
                  <img src={qrCodeImage} alt="QR Code for 2FA" style={{ width: 200, height: 200 }} />
                </Box>
              )}
            </Box>
          )}

          {/* Change Password Section */}
          <Divider sx={{ width: "100%", my: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", alignSelf: "flex-start" }}>
            Change Password
          </Typography>
          <Box component="form" onSubmit={handleChangePassword} sx={{ width: "100%", mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={passwordLoading}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={passwordLoading}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={passwordLoading}
              required
            />
            {passwordError && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {passwordError}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
              disabled={passwordLoading}
            >
              {passwordLoading ? <CircularProgress size={24} /> : "Change Password"}
            </Button>
          </Box>

          {/* Change Email Section */}
          <Divider sx={{ width: "100%", my: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", alignSelf: "flex-start" }}>
            Change Email Address
          </Typography>
          <Box component="form" onSubmit={handleChangeEmail} sx={{ width: "100%", mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Current Email"
              type="email"
              value={currentEmail}
              disabled // Current email should not be editable directly
              InputProps={{
                readOnly: true, // Make it truly read-only
              }}
              sx={{ '.MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)' } }} // Keep text color visible when disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={emailLoading}
              required
            />
            {emailError && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {emailError}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
              disabled={emailLoading}
            >
              {emailLoading ? <CircularProgress size={24} /> : "Change Email"}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}