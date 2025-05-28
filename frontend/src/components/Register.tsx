import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";


function Register() {
    const [formData, setFormData] = useState({email: "", password: ""});

    const navigate = useNavigate();

    const handleClick = () => navigate("/");

    const handleFormChange = (e: { target: { name: string; value: string; }; }) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        console.log(formData);
    }

    return (
        <Box sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        >
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
                }}
                >
                    <Typography variant="h3" align="center">
                        Register
                    </Typography>
                    <TextField
                        id ="filled-search"
                        label ="Email"
                        name = "email"
                        type="search"
                        variant="filled"
                        onChange={handleFormChange}
                    />
                    <TextField
                        id="filled-password-input"
                        name = "password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="filled"
                        onChange={handleFormChange}
                    />
                    <Button variant="contained" onClick={handleClick}>Submit</Button>
                </Box>
            </div>
        </Box>
    )
}

export default Register;