import React, { useState } from "react";

// calculate number of days left from today
function calculateDaysLeft(dueDateStr) {
    const today = new Date();
    const dueDate = new Date(dueDateStr);
    const msPerDay = 1000 * 60 * 60 * 24; // miliseconds per day
    const daysLeft = Math.round((dueDate - today) / msPerDay);
    return  daysLeft;
}

export default function TaskCard({ task, onDelete, onMove, moveDirection, onEdit}) {
    const daysLeft = calculateDaysLeft(String(task.due).slice(0, 10));
    const dueDateObj = new Date(String(task.due).slice(0, 10));
    const dueDisplay = dueDateObj.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

    {/* for editing and saving the task */}
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });

    const handleEditChange = (e) => {
        setEditedTask({
            ...editedTask,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        onEdit(editedTask);
        setIsEditing(false);
    };


    return (
        <div className="task-card">
            <div className="task-header">
                {/* if editing show different */}
                {isEditing ? ( <input type="text" name="title" value={editedTask.title} onChange={handleEditChange} className="edit-input" maxLength={18}/>) 
                           : ( <b>{task.title}</b> )}
                <div className="task-actions">
                    <button className="edit-btn button" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                    {/* if editing hide arrow and delete */}
                    {isEditing ? <></> : 
                        <>
                            <button className="move-btn" onClick={onMove}> 
                                {moveDirection === "right" ? ">" : "<"}
                            </button>
                            <span className="task-delete-btn" onClick={onDelete}>X</span>
                        </>}
                </div>
            </div>
            <div className="task-card-details">
                {/* if editing show editing text input */}
                {isEditing ? (
                    <>
                        <input
                            type="date"
                            name="due"
                            value={editedTask.due}
                            onChange={handleEditChange}
                            className="edit-input"
                        />
                        <textarea
                            name="notes"
                            value={editedTask.notes}
                            onChange={handleEditChange}
                            rows={3}
                            style={{ resize: 'none' }}
                            className="edit-textarea"
                        />
                        <button onClick={handleSave} className="button">Save</button>
                    </>) : (
                    <>
                        <div>DUE: {dueDisplay}</div>
                        <div>
                            DAYS LEFT:{" "}
                            <span style={{ color: daysLeft < 0 ? "red" : daysLeft === 0 ? "orange" : "black" }}>
                                {daysLeft < 0
                                    ? "Overdue"
                                    : daysLeft === 0
                                        ? "Due Today"
                                        : `${daysLeft} day${daysLeft > 1 ? "s" : ""}`}
                            </span>
                        </div>
                        <div>
                            {task.notes ? `NOTES: ${task.notes}` : ""}
                        </div>
                    </>)}
            </div>
        </div>
    );
}

