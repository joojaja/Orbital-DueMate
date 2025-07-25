import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, LinearProgress, Chip, Stack, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import authenticationService from "../services/authenticationService";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const Profile = () => {
    const [profile, setProfile] = useState({ exp: 0, level: 1, tasksCompleted: 0, dailyStreak: 0 });

    const fetchProfile = async () => {
        try {
            const token = authenticationService.getCurrentUser()?.token;
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const getProgressToNextLevel = () => profile.exp % 100;

    const achievements = [
        { label: "10 Tasks", threshold: 10 },
        { label: "50 Tasks", threshold: 50 },
        { label: "100 Tasks", threshold: 100 }
    ];

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box sx={{ p: isMobile ? 2 : 3 }}>
            <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Your Profile
                </Typography>
                <Typography>Level: <strong>{profile.level}</strong></Typography>
                <Typography>EXP: <strong>{profile.exp}</strong></Typography>
                <Box sx={{ my: 2 }}>
                    <LinearProgress variant="determinate" value={getProgressToNextLevel()} />
                    <Typography variant="caption">
                        {getProgressToNextLevel()}/100 to next level
                    </Typography>
                </Box>
                <Typography>Total Tasks Completed: <strong>{profile.tasksCompleted}</strong></Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <WhatshotIcon color="error" />
                    <Typography>{profile.dailyStreak} Day Task Streak</Typography>
                </Box>
            </Paper>

            <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Achievements
                </Typography>

                <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                    {achievements.map((ach, i) => {
                        const earned = profile.tasksCompleted >= ach.threshold;
                        return (
                            <Chip
                                key={i}
                                icon={
                                    <EmojiEventsIcon sx={{ color: earned ? "gold" : "lightgray" }} />
                                }
                                label={ach.label}
                                variant="outlined"
                                sx={{
                                    backgroundColor: earned ? "lightyellow" : "whitesmoke",
                                    color: earned ? "black" : "gray",
                                    borderColor: earned ? "gold" : "lightgray",
                                    fontWeight: earned ? "bold" : "normal"
                                }}
                            />
                        );
                    })}
                </Stack>
            </Paper>
        </Box>
    );
};

export default Profile;
