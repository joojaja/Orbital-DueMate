import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
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