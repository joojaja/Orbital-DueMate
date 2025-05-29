import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import { useState } from "react";


function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [renderMessage, setRenderMessage] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        navigate("/");
    }

    const handleFormChange = (e: { target: { name: string; value: string; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
    }

    return (
        <Box sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <form onSubmit={handleSubmit}>
            <div className="Register">
                <Box sx={{
                    width: 300,
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                }}>
                    {renderMessage && (<Alert variant="filled" severity="warning"> {message} </Alert>)}
                    <Typography variant="h3" align="center">
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