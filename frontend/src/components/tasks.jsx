// this page uses MUI and inline CSS for styling

// TODO:
// 1. fix losing of focus when adding new task

import React, { useState, useEffect, useCallback} from "react";
import { UseRef, Box, Typography, Button, TextField, Card, CardContent, IconButton, Chip, Fab, useTheme, useMediaQuery, Container, Paper } from "@mui/material";
import { Add as AddIcon, CheckCircle as CheckIcon, RadioButtonUnchecked as UncheckedIcon } from "@mui/icons-material";
import axios from "axios";
import authenticationService from "../services/authenticationService";
import TaskCard from "./TaskCard"; // individual tasks as a component

export default function Tasks() {
    const [todo, setTodo] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", due: "", notes: "" });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const jwtToken = authenticationService.getCurrentUser()?.token;
    const apiURL = process.env.REACT_APP_API_URL;

    const fetchTasks = useCallback(async () => {
        try {
            const [todoRes, completedRes] = await Promise.all([
                axios.get(`${apiURL}/api/tasks?completed=false`, {
                    headers: { "Authorization": `Bearer ${jwtToken}` }
                }),
                axios.get(`${apiURL}/api/tasks?completed=true`, {
                    headers: { "Authorization": `Bearer ${jwtToken}` }
                })
            ]);
            setTodo(todoRes.data);
            setCompleted(completedRes.data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    }, [jwtToken, apiURL]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);
    

    const handleAddTask = async (task) => {
        try {
            await axios.post(`${apiURL}/api/tasks`, task, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            setNewTask({ title: "", due: "", notes: "" });
            setShowInput(false);
            fetchTasks();
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`${apiURL}/api/tasks/${id}`, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            fetchTasks();
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    const moveTask = async (task, toCompleted) => {
        try {
            await axios.put(`${apiURL}/api/tasks/${task.id}`, {
                ...task,
                completed: toCompleted
            }, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            fetchTasks();
        } catch (err) {
            console.error("Error moving task:", err);
        }
    };

    const handleEditTask = async (editedTask) => {
        try {
            await axios.put(`${apiURL}/api/tasks/${editedTask.id}`, editedTask, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            fetchTasks();
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const TaskColumn = ({ title, tasks, isCompleted, icon }) => (
        <Box sx={{ 
            flex: 1, 
            minWidth: { xs: '100%', md: '300px' },
            maxWidth: { xs: '100%', md: '400px' },
        }}>
            {/*TODO and COMPLETED top bar*/}
            <Paper 
                sx={{ 
                    p: 2, 
                    mb: 3, 
                    borderRadius: 3,
                    bgcolor: isCompleted ? 'success.light' : 'primary.light', // light green for completed, light blue for TODO
                    color: 'white', // color of text
                    height: '35px'
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {title}
                        </Typography>
                        <Chip // sh ow how many tasks left
                            label={tasks.length} 
                            size="small" 
                            sx={{ 
                                bgcolor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    </Box>
                    
                    {!isCompleted && (
                        <IconButton 
                            onClick={() => setShowInput(!showInput)}
                            sx={{ color: 'white' }}
                        >
                            <AddIcon />
                        </IconButton>
                    )}
                </Box>
            </Paper>
            {/*end of TODO and COMPLETED top bar*/}

            {/* Add Task Form */}
            {showInput && !isCompleted && (
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Box 
                            component="form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddTask(newTask);
                            }}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <TextField
                                placeholder="Task Title"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                variant="outlined"
                                size="small"
                                required
                                inputProps={{ maxLength: 18 }}
                            />
                            <TextField
                                type="date"
                                label="Due Date"
                                value={newTask.due}
                                onChange={e => setNewTask({ ...newTask, due: e.target.value })}
                                variant="outlined"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                placeholder="Notes (optional)"
                                value={newTask.notes}
                                onChange={e => setNewTask({ ...newTask, notes: e.target.value })}
                                variant="outlined"
                                size="small"
                                multiline
                                rows={3}
                            />
                            
                            {/* cancel and add task button */}
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button // cancel button
                                    onClick={() => setShowInput(false)}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button // submit new task button
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
            )}

            {/* Tasks List */}
            <Box sx={{ 
                overflowY: 'auto',
                pr: { xs: 0, md: 1 }
            }}>
                {tasks.length === 0 ? ( // if no task: display text that says no task
                    <Box sx={{ 
                        textAlign: 'center', 
                        py: 4, 
                        color: 'text.secondary' 
                    }}>
                        <Typography sx={{ fontStyle: 'italic' }}>
                            No {isCompleted ? 'completed' : 'todo'} tasks
                        </Typography>
                    </Box>
                ) : (
                    tasks.map((task, i) => (
                        <TaskCard
                            key={task.id || i}
                            task={task}
                            onDelete={() => handleDeleteTask(task.id)}
                            onMove={() => moveTask(task, !isCompleted)}
                            moveDirection={isCompleted ? "left" : "right"}
                            onEdit={handleEditTask}
                        />
                    ))
                )}
            </Box>
            {/* End of Tasks List */}

        </Box>

    );

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
            <Box sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // row for mobile, column for desktop
                gap: { xs: 3, md: 4 },
            }}>
                <TaskColumn 
                    title="TODO"
                    tasks={todo}
                    isCompleted={false}
                    icon={<UncheckedIcon />}
                />
                <TaskColumn 
                    title="COMPLETED"
                    tasks={completed}
                    isCompleted={true}
                    icon={<CheckIcon />}
                />
            </Box>

            {/* Mobile action button for adding tasks */}
            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="add task"
                    onClick={() => setShowInput(!showInput)}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000
                    }}
                >
                    <AddIcon />
                </Fab>
            )}
        </Container>
    );
}