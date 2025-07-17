import { useNavigate, useLocation } from "react-router-dom";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import AuthenticationService from "../services/authenticationService";
import axios from "axios";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [renderMessage, setRenderMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Check if there is an unauthorized message from Navigate in protectedRoute
    let authorizedMessage = useLocation().state;
    useEffect(() => {
        // Check if the authorizedMessage exists and has a message property
        if (authorizedMessage && authorizedMessage.message) {
            setMessage(authorizedMessage.message);
            setRenderMessage(true);

            // Clear state from browser history so we do not see the message again on refresh
            window.history.replaceState({}, document.title);
        } else {
            setMessage("");
            setRenderMessage(false);
        }
    }, [authorizedMessage]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // clear previous error
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                email: formData.email,
                password: formData.password,
            });

            if (response.data.otpRequired) {
                // Save temp token and navigate to OTP page
                localStorage.setItem("tempToken", response.data.tempToken);
                navigate("/verify-otp");
            } else {
                // Regular login
                AuthenticationService.saveUserToken(response.data.token);
                navigate("/home");
                console.log("i am here")
            }
        } catch (err) {
            setError("Invalid login");
        }
    };

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    return (
        <Box sx={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <form onSubmit={handleLogin}>
                <div className="Login">
                    <Box sx={{
                        width: "100%",
                        maxWidth: { xs: "90%", sm: 500, md: 500 }, // Responsive max width
                        padding: { xs: 2, sm: 3, md: 4 }, // Responsive padding
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 2, sm: 2.5, md: 3 }, // Responsive gap
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        margin: "0 auto", // Center the box
                    }}>
                        {renderMessage && (
                            <Alert
                                variant="filled"
                                severity="warning"
                                sx={{
                                    fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive font size
                                    wordBreak: "break-word", // Prevent text overflow
                                }}
                            >
                                {message}
                            </Alert>
                        )}
                        <Typography
                            variant="h3"
                            align="center"
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // Responsive font size
                            }}
                        >
                            Login
                        </Typography>
                        <TextField
                            id="filled-search"
                            label="Email"
                            name="email"
                            type="email"
                            variant="filled"
                            onChange={handleFormChange}
                            required
                        />
                        <TextField
                            id="filled-password-input"
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="filled"
                            onChange={handleFormChange}
                            required
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {error}
                            </Alert>
                        )}
                        <Button variant="contained" type="submit">Submit</Button>
                        <a href="/register">
                            <Typography variant="h6" align="center">
                                Register
                            </Typography>
                        </a>
                    </Box>
                </div>
            </form>
        </Box>
    );
}

export default Login;
