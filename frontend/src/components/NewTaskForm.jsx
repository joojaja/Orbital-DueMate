// NewTaskForm.js
import React, { useCallback, useRef, useEffect } from "react";
import {  MenuItem, Select, InputLabel, FormControl, Box, Button, TextField, Card, CardContent } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const NewTaskForm = React.memo(({
    newTask,
    onTitleChange,
    onDueChange,
    onNotesChange,
    onPriorityChange,
    onAddTask,
    onCancelClick
}) => {
    const titleRef = useRef(null);

    // Focus on the title field when the form first appears
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onAddTask(newTask);
    }, [newTask, onAddTask]);

    return (
        <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        inputRef={titleRef} // Keep ref for initial focus
                        placeholder="Task Title"
                        value={newTask.title}
                        onChange={onTitleChange}
                        variant="outlined"
                        size="small"
                        required
                        inputProps={{ maxLength: 18 }}
                    />
                    <TextField
                        type="date"
                        label="Due Date"
                        value={newTask.due}
                        onChange={onDueChange}
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        placeholder="Notes (optional)"
                        value={newTask.notes}
                        onChange={onNotesChange}
                        variant="outlined"
                        size="small"
                        multiline
                        rows={3}
                    />
                    <FormControl size="small">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            value={newTask.priority || "green"}
                            label="Priority"
                            onChange={onPriorityChange}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                            onClick={onCancelClick}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<AddIcon />}
                        >
                            Add Task
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
});

export default NewTaskForm;