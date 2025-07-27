// this page uses MUI and inline CSS for styling

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, IconButton, Chip, Fab, useTheme, useMediaQuery, Container, Paper } from "@mui/material";
import { Add as AddIcon, CheckCircle as CheckIcon, RadioButtonUnchecked as UncheckedIcon } from "@mui/icons-material";
import axios from "axios";
import authenticationService from "../services/authenticationService";
import TaskCard from "./TaskCard"; // individual tasks as a component
import NewTaskForm from "./NewTaskForm"; // new task form as a component

export default function Tasks() {
    const [todo, setTodo] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", due: "", notes: "", priority: "low" });
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
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchTasks();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        fetchTasks();

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fetchTasks]);

    // Input handlers
    const handleTitleChange = useCallback((e) => {
        setNewTask(prev => ({ ...prev, title: e.target.value }));
    }, []);

    const handleDueChange = useCallback((e) => {
        setNewTask(prev => ({ ...prev, due: e.target.value }));
    }, []);

    const handleNotesChange = useCallback((e) => {
        setNewTask(prev => ({ ...prev, notes: e.target.value }));
    }, []);

    const handlePriorityChange = useCallback((e) => {
    setNewTask(prev => ({ ...prev, priority: e.target.value }));
    }, []);


    const handleAddTask = useCallback(async (task) => {
        try {
            const response = await axios.post(`${apiURL}/api/tasks`, task, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });

            setTodo(prev => [...prev, response.data]);

            // add 20 exp when adding new task
            await axios.post(`${apiURL}/api/user/add-exp`, { amount: 20 }, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });

            setNewTask({ title: "", due: "", notes: "" });
            setShowInput(false);
        } catch (err) {
            console.error("Error creating task:", err);
        }
    }, [apiURL, jwtToken]);

    const handleDeleteTask = useCallback(async (id) => {
        try {
            await axios.delete(`${apiURL}/api/tasks/${id}`, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            fetchTasks();
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    }, [apiURL, jwtToken, fetchTasks]);

    const moveTask = useCallback(async (task, toCompleted) => {
        try {
            await axios.put(`${apiURL}/api/tasks/${task.id}`, {
                ...task,
                completed: toCompleted
            }, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            
            // add 50 exp once task is completed
            if (toCompleted) {
                await axios.post(`${apiURL}/api/user/add-exp`, { amount: 50 }, {
                    headers: { "Authorization": `Bearer ${jwtToken}` }
                });
            }

            fetchTasks();
        } catch (err) {
            console.error("Error moving task:", err);
        }
    }, [apiURL, jwtToken, fetchTasks]);

    const handleEditTask = useCallback(async (editedTask) => {
        try {
            await axios.put(`${apiURL}/api/tasks/${editedTask.id}`, editedTask, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            fetchTasks();
        } catch (err) {
            console.error("Error updating task:", err);
        }
    }, [apiURL, jwtToken, fetchTasks]);

    const handleCancelClick = useCallback(() => {
        setNewTask({ title: "", due: "", notes: "" });
        setShowInput(false);
    }, []);

    const [focusedField, setFocusedField] = useState("title");

    const TaskColumn = React.memo(({ title, tasks, isCompleted, icon, showInput, setShowInput, newTask, handleTitleChange, handleDueChange, handleNotesChange, handleAddTask, handleCancelClick, handleDeleteTask, moveTask, handleEditTask }) => (
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
                    bgcolor: isCompleted ? 'success.light' : 'primary.light',  // light green for completed, light blue for TODO
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
                        <Chip // show how many tasks left
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

            {/* Add new task form */}
            {showInput && !isCompleted && (
                <NewTaskForm
                    newTask={newTask}
                    onTitleChange={handleTitleChange}
                    onDueChange={handleDueChange}
                    onNotesChange={handleNotesChange}
                    onPriorityChange={handlePriorityChange}
                    onAddTask={handleAddTask}
                    onCancelClick={handleCancelClick}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                />
            )}
            {/* end of add new task form */}

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
        </Box>
    ));

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
                    showInput={showInput}
                    setShowInput={setShowInput}
                    newTask={newTask}
                    handleTitleChange={handleTitleChange}
                    handleDueChange={handleDueChange}
                    handleNotesChange={handleNotesChange}
                    handleAddTask={handleAddTask}
                    handleCancelClick={handleCancelClick}
                    handleDeleteTask={handleDeleteTask}
                    moveTask={moveTask}
                    handleEditTask={handleEditTask}
                />
                <TaskColumn
                    title="COMPLETED"
                    tasks={completed}
                    isCompleted={true}
                    icon={<CheckIcon />}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    newTask={newTask}
                    handleTitleChange={handleTitleChange}
                    handleDueChange={handleDueChange}
                    handleNotesChange={handleNotesChange}
                    handleAddTask={handleAddTask}
                    handleCancelClick={handleCancelClick}
                    handleDeleteTask={handleDeleteTask}
                    moveTask={moveTask}
                    handleEditTask={handleEditTask}
                />
            </Box>

            {/* Mobile phone action button for adding tasks */}
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
