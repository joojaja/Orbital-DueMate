// this page uses MUI and inline CSS for styling

// TODO:
// 1. color code / priority colouring of task card

import React, { useState } from "react";
import { Box, Typography, Button, TextField, Card, CardContent, IconButton, Chip, useTheme, useMediaQuery, MenuItem} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    {/* for editing and saving the task */}
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });

    const getPriorityColor = () => {
        switch (task.priority) {
            case 'high':
            return '#ffcdd2'; // red
            case 'medium':
            return '#fff9c4'; // yellow
            case 'low':
            return '#c8e6c9'; // green
            default:
            return '#f5f5f5'; // neutral/gray
        }
    };



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

    const getDaysLeftColor = () => {
        if (daysLeft < 0) return 'error';
        if (daysLeft === 0) return 'warning';
        return 'default';
    };

    const getDaysLeftText = () => {
        if (daysLeft < 0) return 'Overdue';
        if (daysLeft === 0) return 'Due Today';
        return `${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
    };


    return (
        <Card sx={{ 
                mb: 4, // margin between cards
                borderRadius: 2,
                backgroundColor: getPriorityColor(),
                '&:hover': { // hover move up
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    transition: '0.2s ease-in-out'
                }
            }}
        >
            <CardContent>
                {/* Task Header and action buttons*/}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                }}>
                    {/* task title */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {isEditing ? ( // if is editing show this
                            <TextField
                                name="title"
                                value={editedTask.title}
                                onChange={handleEditChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                inputProps={{ maxLength: 18 }}
                                sx={{ mb: 2 }}
                            />
                        ) : ( // show the task card title
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {task.title}
                            </Typography>
                        )}
                    </Box> 
                    {/* end of task title */}

                    {/* action buttons */}
                    <Box sx={{ display: 'flex'}}>
                        <IconButton 
                            onClick={() => setIsEditing(!isEditing)}
                            color={isEditing ? "secondary" : "primary"}
                        >
                            {/*show cancel button if editing, edit button if not*/}
                            {isEditing ? <CancelIcon /> : <EditIcon />}
                            
                        </IconButton>
                        {!isEditing && (
                            <>
                                <IconButton // move to completed or todo button
                                    onClick={onMove}
                                    color="primary"
                                >
                                    {moveDirection === "right" ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                                </IconButton>

                                <IconButton // delete button
                                    onClick={onDelete}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>
                    {/* end of action buttons */}

                </Box>
                {/* end of task header and action buttons*/}

                {/* Task Details */}
                {isEditing ? ( // if editing show edit form
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField // Due date input
                            name="due"
                            type="date"
                            value={editedTask.due}
                            onChange={handleEditChange}
                            variant="outlined"
                            size="small"
                            label="Due Date"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField // task notes input
                            name="notes"
                            value={editedTask.notes}
                            onChange={handleEditChange}
                            variant="outlined"
                            size="small"
                            multiline
                            rows={3}
                            label="Notes"
                            placeholder="Optional notes..."
                        />
                        <TextField
                            name="priority"
                            select
                            label="Priority"
                            value={editedTask.priority || ""}
                            onChange={handleEditChange}
                            variant="outlined"
                            size="small"
                            >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </TextField>
                        <Button // save button
                            onClick={handleSave} 
                            variant="contained" 
                            startIcon={<SaveIcon />}
                            sx={{ alignSelf: 'flex-end' }}
                        >
                            Save
                        </Button>
                    </Box>
                ) : ( // show task if not editing
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            
                            <Typography color="text.secondary">
                                Due: {dueDisplay}
                            </Typography>

                            <Chip // show number of days left
                                label={getDaysLeftText()} 
                                color={getDaysLeftColor()}
                                size="small"
                                variant="outlined"
                            />

                        </Box>
                        
                        {/*task notes*/}
                        {task.notes && (
                            <Typography 
                                color="text.secondary"
                                sx={{ 
                                    mt: 1,
                                    fontStyle: 'italic',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {task.notes}
                            </Typography>
                        )}
                        {/*end of task notes*/}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}


