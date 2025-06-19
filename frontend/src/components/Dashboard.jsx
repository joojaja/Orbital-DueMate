import React, { useState } from "react";
import "../styles/Dashboard.css";
import AuthService from "../services/authenticationService";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Importing of other tabs
import Tasks from "./tasks";
import Calendar from "./CalendarCRUD";
// import Grades from "./Grades";
// import Friends from "./Friends";


// Tab names
const TAB_NAMES = ["Calendar", "Tasks", "Grades", "Friends"];

// Map tab names to components
const TAB_COMPONENTS = {
    Calendar: <Calendar />,
    Tasks: <Tasks />,
    //Grades: <Grades />,
    //Friends: <Friends />,
};

export default function Dashboard() {

    const token = AuthService.getCurrentUser();

    // Get the name of the user
    const user = token ? token.name : "Guest";

    const navigate = useNavigate();
    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
    };

    // State for active tab
    const [activeTab, setActiveTab] = useState("Calendar");

    return (
        <>
            {/*Main div (100vh 100vw)*/}
            <div className="page-container">
                {/* Left side content */}
                <div className="page-sidebar">
                    {/* Sidebar Profile Pic and Name*/}
                    <div className="profile">
                        <div className="profile-picture"></div>
                        <a className="profile-name">{user}</a>
                    </div>
                    {/* Sidebar Other tabs*/}
                    <div className="sidebar-tabs">
                        {TAB_NAMES.map((tabName) => (
                            <a
                                key={tabName}
                                className={`new-tab ${activeTab === tabName ? "active" : ""}`}
                                onClick={() => setActiveTab(tabName)}
                            >
                            {tabName}
                            </a>
                        ))}
                    </div>
                </div>  {/* End of left sidebar div */}

                {/* Right side content */}
                <div className="main-page">
                    {/* Top Header */}
                    <div className="page-header">
                    {/* Logout button */}
                    <span className="header-action"> <Button variant="contained" onClick={handleLogout}>Logout</Button></span>
                        <span className="header-action">ADD EVENT</span>
                        <span className="header-action">IMPORT</span>
                        <span className="header-action">EXPORT</span>
                    </div>

                    {/* Main Content */}
                    <div className="main-content">
                        {TAB_COMPONENTS[activeTab]}
                    </div>

                </div>
            </div>
        </>
    );
}