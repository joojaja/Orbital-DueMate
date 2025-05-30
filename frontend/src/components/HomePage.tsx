import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import { useState } from "react";
import AuthService from "../services/authService";
import Header from "./Header";

function HomePage() {
    console.log(AuthService.getCurrentUser())
    const user = AuthService.getCurrentUser().name || "Guest";


    return (
        <Box>
            <Header/>
            <Box sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Typography variant="h3" align="center">
                    Welcome {user}
                </Typography>
            </Box>
        </Box>)
}

export default HomePage;