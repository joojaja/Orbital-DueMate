import React, { useState, useEffect, useCallback} from "react";
import "../styles/Tasks.css"; // includes individual tasks styling
import TaskCard from "./taskCard"; // individual tasks as a component
import axios from "axios";
import authenticationService from "../services/authenticationService";

export default function Tasks() {
    const [todo, setTodo] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", due: "", notes: "" });
    
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
    }, [jwtToken]);

    useEffect(() => {
        try {
            fetchTasks();
        } catch (e) {
            return ("Something went wrong : " + e);
        }
    }, [fetchTasks]);

    const handleAddTask = async (task) => {
        try {
            await axios.post(`${apiURL}/api/tasks`, task, {
                headers: { "Authorization": `Bearer ${jwtToken}` }
            });
            setNewTask({ title: "", due: "", notes: "" });
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

    return (
        <div className="tasks-board">
            {/* TODO Column */}
            <div className="column">
                <div className="header">
                    <span>TODO</span>
                    <button className="add-task-btn" onClick={() => setShowInput(!showInput)}>+</button>
                </div>
                {/*input card -> will show if state is true*/}
                {showInput && (
                    <form // input form for new task, form is required so that Enter key can be used to add task
                        onSubmit={(e) => {
                            console.log(newTask);
                            e.preventDefault();
                            handleAddTask(newTask);
                        }}
                        className="input-card"
                    >
                        <input
                            type="text"
                            placeholder="Title"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            maxLength={18}
                        />
                        <input
                            type="date"
                            placeholder="Due Date"
                            value={newTask.due}
                            onChange={e => setNewTask({ ...newTask, due: e.target.value })}
                        />
                        <textarea
                            placeholder="Notes (optional)"
                            value={newTask.notes}
                            onChange={e => setNewTask({ ...newTask, notes: e.target.value })}
                            rows={3}
                            style={{ resize: 'none' }} /* prevent resizing */
                        />
                        <button type="submit" className="button">Add</button>
                    </form>
                )} {/*end of input card*/}
                {todo.length === 0 && <div className="tasks-empty">No todo tasks</div>}
                {todo.map((task, i) => (
                    <TaskCard
                        key={task.id || i}
                        task={task}
                        onDelete={() => handleDeleteTask(task.id, "todo")}
                        onMove={() => moveTask(task, true)}
                        moveDirection="right" 
                        onEdit={(editedTask) => handleEditTask(editedTask)}
                    />
                ))}
            </div> {/* End of TODO Column */}

            {/* COMPLETED Column */}
            <div className="column">
                <div className="header">
                    <span>COMPLETED</span>
                </div>
                {completed.length === 0 && <div className="tasks-empty">No completed tasks</div>}
                {completed.map((task, i) => (
                    <TaskCard
                        key={task.id || i}
                        task={task}
                        onDelete={() => handleDeleteTask(task.id, "completed")}
                        onMove={() => moveTask(task, false)}
                        moveDirection="left"
                        onEdit={(editedTask) => handleEditTask(editedTask, i, "completed")}
                    />
                ))}
            </div> {/* End of COMPLETED Column */}
        </div>
    );
}
