import { useState } from "react";
import "../styles/CalendarDashboard.css";
import AuthService from "../services/authenticationService";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
    { tabName: "Calendar", active: true },
    { tabName: "Tasks", active: false },
    { tabName: "Grades", active: false },
    { tabName: "Pomodoro", active: false },
    { tabName: "Friends", active: false },
];

const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

function getCalendarMatrix(year, month) {
    // First day of the month (0 = Sunday, 1 = Monday, ...)
    const firstDay = new Date(year, month, 1).getDay();
    // Number of days in the month
    const numDays = new Date(year, month + 1, 0).getDate();

    const matrix = [];
    let day = 1 - firstDay; // Start from negative if the month doesn't start on Sunday

    for (let week = 0; week < 6; week++) {
        const weekRow = [];
        for (let d = 0; d < 7; d++) {
            if (day > 0 && day <= numDays) {
                weekRow.push(day);
            } else {
                weekRow.push("");
            }
            day++;
        }
        matrix.push(weekRow);
        // Stop early if we've filled all days
        if (day > numDays) break;
    }
    return matrix;
}

export default function CalendarDashboard() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const calendarMatrix = getCalendarMatrix(year, month);

    const token = AuthService.getCurrentUser();

    // Get the name of the user
    let user = "";
    if (token === null) {
        // Should not happen, if u see this the protected route failed
        user = "Guest";
    } else {
        user = AuthService.getCurrentUser().name;
    }

    const navigate = useNavigate();
    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
    };

    const prevYear = () => setYear(y => y - 1);
    const nextYear = () => setYear(y => y + 1);
    const prevMonth = () => {
        setMonth(m => {
            if (m === 0) {
                setYear(y => y - 1);
                return 11;
            }
            return m - 1;
        });
    };
    const nextMonth = () => {
        setMonth(m => {
            if (m === 11) {
                setYear(y => y + 1);
                return 0;
            }
            return m + 1;
        });
    };
    const goToToday = () => {
        setYear(today.getFullYear());
        setMonth(today.getMonth());
    };

    return (
        <>
            {/*Main div (100vh 100vw)*/}
            <div className="calendar-container">
                {/* Left Sidebar */}
                <div className="calendar-sidebar">
                    {/* Sidebar Profile Pic and Name*/}
                    <div className="calendar-profile">
                        <div className="calendar-profile-picture"></div>
                        <a className="calendar-profile-name">{user}</a>
                    </div>
                    {/* Sidebar Other tabs*/}
                    <div className="calendar-tabs-list">
                        {/* TODO: ADD LINK TO a */}
                        {sidebarItems.map((item) => (
                            <a
                                key={item.tabName}
                                className={`calendar-tab ${item.active && "active"}`}
                            >
                                {item.tabName}
                            </a>
                        ))}
                    </div>
                </div>  {/* End of left sidebar div */}

                {/* Main Calendar Content */}
                <div className="calendar-main">
                    {/* Top Header */}
                    <div className="calendar-header">
                        <div className="year"> {/* Year */}
                            <button className="calendar-arrow-btn" onClick={prevYear}>&lt;</button>
                            <span className="calendar-year">{year}</span>
                            <button className="calendar-arrow-btn" onClick={nextYear}>&gt;</button>
                        </div>
                        <div className="month"> {/* Month */}
                            <button className="calendar-arrow-btn" onClick={prevMonth}>&lt;</button>
                            <span className="calendar-month">{monthNames[month]}</span>
                            <button className="calendar-arrow-btn" onClick={nextMonth}>&gt;</button>
                        </div>
                        <span className="calendar-header-action" onClick={goToToday}>TODAY</span>
                        <span className="calendar-header-action">ADD EVENT</span>
                        <span className="calendar-header-action">IMPORT</span>
                        <span className="calendar-header-action">EXPORT</span>
                        {/* Logout button */}
                        <span className="calendar-header-action"> <Button variant="contained" onClick={handleLogout}>Logout</Button></span>
                    </div>

                    {/* Calendar Grid */}
                    <div className="calendar-grid-container">
                        <table className="calendar-table">
                            <thead>
                                <tr>
                                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                                        <th key={day} className="calendar-header-cell">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {calendarMatrix.map((week, rowIdx) => (
                                    <tr key={rowIdx}>
                                        {week.map((date, colIdx) => {
                                            const isToday = date && date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                            return (
                                                <td key={colIdx} className="calendar-cell">
                                                    {date && (
                                                        <span className={`calendar-date-number ${isToday ? "today" : ""}`}>
                                                            {date}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}