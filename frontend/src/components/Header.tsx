import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import { useState } from "react";
import AuthService from "../services/authService";

function Header() {
    const navigate = useNavigate();
    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
    }
    return (
    <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
        }}>
    <Button variant="contained" onClick={handleLogout}>Logout</Button>
    </Box>
    )
}

export default Header;