import { useState } from "react";
import "../styles/Calendar.css";

const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

function getCalendarMatrix(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    const matrix = [];
    let day = 1 - firstDay;

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
        if (day > numDays) break;
    }
    return matrix;
}

export default function Calendar() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const calendarMatrix = getCalendarMatrix(year, month);

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
            <div className="calendar-arrows">
                <div className="year">
                    <button className="calendar-arrow-btn" onClick={prevYear}>&lt;</button>
                    <span className="calendar-year">{year}</span>
                    <button className="calendar-arrow-btn" onClick={nextYear}>&gt;</button>
                </div>
                <div className="month">
                    <button className="calendar-arrow-btn" onClick={prevMonth}>&lt;</button>
                    <span className="calendar-month">{monthNames[month]}</span>
                    <button className="calendar-arrow-btn" onClick={nextMonth}>&gt;</button>
                </div>
                <div className="today" onClick={goToToday}>
                    <span>TODAY</span>
                </div>
            </div>
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
                                    const isToday =
                                        date &&
                                        date === today.getDate() &&
                                        month === today.getMonth() &&
                                        year === today.getFullYear();
                                    return (
                                        <td key={colIdx} className="calendar-cell">
                                            {date && (
                                                <span className={`calendar-date-number${isToday ? " today" : ""}`}>
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
        </>
    );
}
