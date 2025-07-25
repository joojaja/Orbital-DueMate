// this page uses MUI and inline CSS for styling

// TODO:
// 1. profile picture icon
// 2. adding profile page 

import React, { useState } from "react";
import {Box, Button, Typography, Drawer, AppBar, Toolbar, IconButton, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery, Paper, Avatar, Divider} from "@mui/material";
import {Menu as MenuIcon, Close as CloseIcon, Person as TempProfileIcon, Logout as LogoutIcon} from "@mui/icons-material";
import AuthService from "../services/authenticationService";
import { useNavigate } from "react-router-dom";

// Importing of other tabs
import Tasks from "./Tasks";
import Calendar from "./CalendarCRUD";
import GradPlanning from "./GradPlanning";
import Settings from "./Settings"
import Profile from "./Profile"

// Tab names
const TAB_NAMES = ["Calendar", "Tasks", "Planning", "Settings", "Profile"];

// Map tab names to components
const TAB_COMPONENTS = {
    Calendar: <Calendar />,
    Tasks: <Tasks />,
    Planning: <GradPlanning />,
    Settings: <Settings />,
    Profile: <Profile />
};

export default function Dashboard() {

    const token = AuthService.getCurrentUser();
    const user = token ? token.name : "Guest"; // get name
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State for active tab and mobile phone drawer
    const [activeTab, setActiveTab] = useState("Calendar");
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    
    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        if (isMobile) {
            setMobileDrawerOpen(false); // will close the drawer on mobile phone
        }
    };

    // to open and close mobile phone drawer
    const toggleMobileDrawer = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    // Sidebar content component
    const SidebarContent = ({ onTabChange, currentTab, onClose }) => (
        <Box sx={{ width: { xs: 280, sm: 300 }, height: '100%' }}>
            {/* Mobile close button */}
            {isMobile && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                    <IconButton onClick={onClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            {/* Profile section */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: { xs: 2, sm: 3 },
                gap: 2,
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Avatar sx={{ 
                    bgcolor: 'primary.main',
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    flexShrink: 0 // Prevent avatar from shrinking
                }}>
                    <TempProfileIcon /> 
                </Avatar>
                <Box sx={{ 
                    flex: 1, // Take up remaining space
                    minWidth: 0, // Allow shrinking below content size
                    overflow: 'hidden' // Hide overflow
                }}>
                    <Typography 
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {/*user name*/}
                        {user}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                        minWidth: 'auto',
                        px: { xs: 1, sm: 2 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        flexShrink: 0 // Prevent button from shrinking
                    }}
                >
                    Logout
                </Button>
            </Box>
            {/* end of profile section */}

            {/* Navigation tabs */}
            <List sx={{ pt: 3 }}>
                {TAB_NAMES.map((tabName) => (
                    <ListItem key={tabName} disablePadding>
                        <ListItemButton
                            onClick={() => onTabChange(tabName)}
                            selected={currentTab === tabName}
                            sx={{
                                mx: 2,
                                mb: 1,
                                borderRadius: 2,
                                minHeight: { xs: 48, sm: 56 },
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        bgcolor: 'primary.dark', // darken when hover
                                    }
                                },
                                '&:hover': {
                                    bgcolor: 'action.hover' // cursor when hhover
                                }
                            }}
                        >
                            <ListItemText 
                                primary={tabName}
                                primaryTypographyProps={{
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                    fontWeight: currentTab === tabName ? 'bold' : 'medium'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile top bar */}
            {isMobile && (
                <AppBar 
                    position="fixed" 
                    sx={{ 
                        zIndex: theme.zIndex.drawer + 1,
                        bgcolor: 'background.paper',
                        color: 'black',
                        boxShadow: 1
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="black"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleMobileDrawer}
                            sx={{ mr: 2 }} // margin
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                            {activeTab}
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Mobile sidebar pop up drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileDrawerOpen}
                    onClose={toggleMobileDrawer}
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    <SidebarContent
                        onTabChange={handleTabChange}
                        currentTab={activeTab}
                        onClose={toggleMobileDrawer}
                    />
                </Drawer>
            )}
            
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Paper
                    sx={{
                        width: 300,
                        flexShrink: 0,
                        borderRight: 1,
                        borderColor: 'divider',
                        borderRadius: 0
                    }}
                >
                    <SidebarContent
                        onTabChange={handleTabChange}
                        currentTab={activeTab}
                    />
                </Paper>
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    mt: { xs: 8, md: 0 }, // margin for mobile app
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 2, sm: 3 },
                        overflow: 'auto', // allow scrolling since calendar too big
                        bgcolor: 'background.default'
                    }}
                >
                    {/* Name of tab at the top for Desktop */}
                    {!isMobile && (
                        <Box sx={{ mb: 0 }}> 
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    mb: 1
                                }}
                            >
                                {activeTab}
                            </Typography>
                            <Divider />
                        </Box>
                    )}

                    {/* main content that changes*/}
                    <Box sx={{ 
                        height: 'auto'
                    }}>
                        {TAB_COMPONENTS[activeTab]}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}