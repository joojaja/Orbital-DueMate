import { useNavigate, useLocation } from "react-router-dom";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import AuthenticationService from "../services/authenticationService";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [renderMessage, setRenderMessage] = useState(false);
    const [message, setMessage] = useState("");
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
    }, [authorizedMessage])

    const handleLogin = (event) => {
        event.preventDefault();
        console.log("Trying login")
        setRenderMessage(false);
        setMessage("")

        AuthenticationService.login(formData.email, formData.password)
            .then(() => navigate("/home"))
            .catch((error) => {
                const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                    || "Login failed. Please try again.";
                setMessage(errorMessage);
                setRenderMessage(true);
                console.log(error);
            })
    };

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

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
    )
}

export default Login;