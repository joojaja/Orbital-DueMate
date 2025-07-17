import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authenticationService from "../services/authenticationService";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const tempToken = localStorage.getItem("tempToken");

  const handleVerify = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, {
        tempToken,
        otp,
      });

      authenticationService.saveUserToken(res.data.token);
      localStorage.removeItem("tempToken");
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Enter OTP
      </Typography>
      <TextField
        label="Authenticator Code"
        fullWidth
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        margin="normal"
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Button variant="contained" onClick={handleVerify} fullWidth sx={{ mt: 2 }}>
        Verify
      </Button>
    </Container>
  );
}
