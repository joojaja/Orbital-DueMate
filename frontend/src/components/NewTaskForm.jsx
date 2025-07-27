import React, { useRef, useEffect, useState, useCallback } from "react";
import { MenuItem, Select, InputLabel, FormControl, Box, Button, TextField, Card, CardContent } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const NewTaskForm = React.memo(({
  newTask,
  onTitleChange,
  onDueChange,
  onNotesChange,
  onPriorityChange,
  onAddTask,
  onCancelClick,
  focusedField,
  setFocusedField
}) => {
  const titleRef = useRef(null);
  const notesRef = useRef(null);

  // Focus active field
  useEffect(() => {
    if (focusedField === "title" && titleRef.current) {
        titleRef.current.focus();
    } 
    else if (focusedField === "notes" && notesRef.current) {
        // Focus notes
        notesRef.current.focus();
        const length = notesRef.current.value.length; 
        notesRef.current.setSelectionRange(length, length); //move cursor to end of string
    }
}, [focusedField]);

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
            inputRef={titleRef}
            placeholder="Task Title"
            value={newTask.title}
            onFocus={() => setFocusedField("title")}
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
            inputRef={notesRef}
            placeholder="Notes (optional)"
            value={newTask.notes}
            onFocus={() => setFocusedField("notes")}
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