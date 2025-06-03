import { Box, Typography } from "@mui/material";
import AuthService from "../services/authService";
import Header from "./Header";

function HomePage() {
    const token = AuthService.getCurrentUser();
    let user = "";
    if (token === null) {
        user = "Guest";
    } else {
        user = token.name;
    }


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