import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import { useState } from "react";
import AuthenticationService from "../services/authenticationService";

function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [renderMessage, setRenderMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [messageSeverity, setMessageSeverity] = useState("warning");

    const handleRegister = (event) => {
        event.preventDefault();
        setRenderMessage(false);
        setMessage("")

        AuthenticationService.register(formData.name, formData.email, formData.password)
        .then(() => {setMessage("Account registration successful");
        setRenderMessage(true);
        setMessageSeverity("success")
        })
        .catch((error) => {
            const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() 
            || "Login failed. Please try again.";
            setMessage(errorMessage);
            setRenderMessage(true);
            setMessageSeverity("warning");
        })
    };

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    return (
        <Box sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <form onSubmit={handleRegister}>
            <div className="Register">
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
                            Register
                        </Typography>
                    <TextField
                        id="filled-search"
                        label="Name"
                        name="name"
                        type="search"
                        variant="filled"
                        onChange={handleFormChange}
                        required
                    />
                    <TextField
                        id="filled-search"
                        label="Email"
                        name="email"
                        type="search"
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
                    <Button variant="contained" type = "submit">Submit</Button>
                    <a href="/">
                    <Typography variant="h6" align="center">
                        Login
                    </Typography>
                    </a>
                </Box>
            </div>
            </form>
        </Box>
    )
}

export default Register;