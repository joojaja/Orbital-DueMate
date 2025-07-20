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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, {
        otp,
        tempToken
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        authenticationService.saveUserToken(response.data.token);
        localStorage.removeItem("tempToken");
        navigate("/home");
      }
      
    } catch (err) {
      setError("Invalid OTP. Try again.");
      console.log(`Error`, err);
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
