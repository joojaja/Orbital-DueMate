// import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate} from "react-router-dom";
// import { Button, TextField, Box, Typography, Alert } from "@mui/material";
// import { useState } from "react";
// import AuthService from "../services/authService";

// // This component is used to protect routes that require authentication
// const ProtectedRoute = ({ children: React.ReactNode }) => {
//     const navigate = useNavigate();
//     if (!AuthService.getCurrentUser) {
//         return <Navigate to ="/login" state ="You must be logged in to view this page." />; 
//     }

//     return <>{children}</>;
// }

const ProtectedRoute = () => {};
export default ProtectedRoute;