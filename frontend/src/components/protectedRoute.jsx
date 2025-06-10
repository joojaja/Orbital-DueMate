import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../services/authenticationService";

// This component is used to protect routes that require authentication
const ProtectedRoute = () => {
    // Check if the user is authenticated, if the token is stored in localStorage
    if (AuthService.getCurrentUser() === null) {
        return <Navigate to ="/" state ={{message: "You must be logged in to view this page." }}/>; 
    }

    // Render the child components if the user is authenticated
    return <Outlet />; 
}

export default ProtectedRoute;