import dayjs from "dayjs";
import authenticationService from "../services/authenticationService";
import axios, { all } from "axios";

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import { Button, Modal, Box, Typography, TextField, Switch, FormGroup, FormControlLabel, Alert } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import interactionPlugin from '@fullcalendar/interaction';

import "../styles/CalendarCRUD.css";

function CalendarCRUD() {
    const token = authenticationService.getCurrentUser();
    const id = token.id;
    const jwtToken = token.token;

    // State for calendar events
    const [events, setEvents] = useState([]);

    // State that we toggle so that useEffect cann fetch events from backend again
    const [updateEvents, setUpdateEvents] = useState(false);

    // States for modals
    const [openCreateEventModal, setOpenCreateEventModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    // State to hold form data for creating events
    const [createFormData, setCreateFormData] = useState({ title: "", dateTime: "" });
    const [editFormData, setEditFormData] = useState({ title: "", dateTime: "", id: 0 });

    // State to hold all day event that can be toggled
    const [createFormAllDay, setCreateFormAllDay] = useState(false);
    const [editFormAllDay, setEditFormAllDay] = useState(false);

    // States for rendering the message and whether to show for create event form
    const [renderCreateFormMessage, setRenderCreateFormMessage] = useState(false);
    const [createFormMessage, setCreateFormMessage] = useState("");

    const [renderEditFormMessage, setRenderEditFormMessage] = useState(false);
    const [editFormMessage, setEditFormMessage] = useState("");

    // API URL for calendar events
    const apiURL = "http://localhost:8081";

    // API call to retrieve calendar events that is called during mount/dismount and when events are changed
    useEffect(() => {
        axios.get(apiURL + `/calendar/read/${id}`, { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                let calendarEvents = response.data.map(event => {
                    return {
                        id: event.id,
                        title: event.name,
                        start: event.dateTime,
                        allDay: event.allDay
                    }
                });

                setEvents(calendarEvents);
            })
            .catch(error => { console.log("Error happened during login: " + error) });
    }, [updateEvents, id, jwtToken]);


    const handleCloseCreateEventModal = () => {
        setCreateFormMessage("");
        setRenderCreateFormMessage(false);
        setCreateFormData({ title: "", dateTime: "" });
        setCreateFormAllDay(false);
        setOpenCreateEventModal(false);
    }

    const handleCloseEditEventModal = () => {
        setEditFormMessage("");
        setRenderEditFormMessage(false);
        setEditFormData({ title: "", dateTime: "", id: 0 });
        setEditFormAllDay(false);
        setOpenEditModal(false);
    };


    const handleAddEventClick = () => {
        setOpenCreateEventModal(true);
    }

    const toggleCreateFormAllDay = () => {
        setCreateFormAllDay(!createFormAllDay);
    }

    const toggleEditFormAllDay = () => {
        setEditFormAllDay(!editFormAllDay);
    }

    const handleCreateFormChange = (event) => {
        if (event && event.target) {
            setCreateFormData({ ...createFormData, [event.target.name]: event.target.value });
        } else if (event) { // DateTimePicker does not have target property
            const dateOrDateTime = createFormAllDay ?
                dayjs(event).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ") //Set time to midnight since Java instant needs a time
                : dayjs(event).format("YYYY-MM-DDTHH:mm:ssZ");

            setCreateFormData({ ...createFormData, dateTime: dateOrDateTime });
        }
    }

    const handleEditFormChange = (event) => {
        if (event && event.target) {
            setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
        } else if (event) { // DateTimePicker does not have target property
            const dateOrDateTime = editFormAllDay ?
                dayjs(event).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ") //Set time to midnight since Java instant needs a time
                : dayjs(event).format("YYYY-MM-DDTHH:mm:ssZ");

            setEditFormData({ ...editFormData, dateTime: dateOrDateTime });
        }
    }

    const handleAddEventSubmit = (event) => {
        event.preventDefault();
        if (!createFormData.dateTime) {
            setCreateFormMessage("Date / DateTime cannot be empty.");
            setRenderCreateFormMessage(true);
        } else {
            axios.post(apiURL + "/calendar/create",
                {
                    name: createFormData.title,
                    dateTime: createFormData.dateTime,
                    allDay: createFormAllDay,
                    userId: id
                },
                { headers: { "Authorization": `Bearer ${jwtToken}` } })
                .then(response => {
                    console.log(response.data.message);
                    setCreateFormMessage("");
                    setRenderCreateFormMessage(false);
                    setCreateFormData({ title: "", dateTime: "" });
                    setCreateFormAllDay(false);
                    setUpdateEvents(!updateEvents); // To tell useEffect to fetch events again
                    setOpenCreateEventModal(false);
                })
                .catch(error => { console.log("Error happened during login: " + error) });
        }
    }

    const handleEditEventSubmit = (event) => {
        event.preventDefault();
        if (!editFormData.dateTime) {
            setEditFormMessage("Date / DateTime cannot be empty.");
            setRenderEditFormMessage(true);
        } else {
            axios.put(apiURL + "/calendar/update/" + editFormData.id,
                {
                    name: editFormData.title,
                    dateTime: editFormData.dateTime,
                    allDay: editFormAllDay,
                    userId: id
                },
                { headers: { "Authorization": `Bearer ${jwtToken}` } })
                .then(response => {
                    console.log(response.data.message);
                    setEditFormMessage("");
                    setRenderEditFormMessage(false);
                    setEditFormData({ title: "", dateTime: "", id: 0 });
                    setEditFormAllDay(false);
                    setUpdateEvents(!updateEvents); // To tell useEffect to fetch events again
                    setOpenEditModal(false);
                })
                .catch(error => { console.log("Error happened during editing event: " + error) });
        }
    }

    const handleDateClick = (info) => {
        console.log(info.event.title, info.event.start, info.event.allDay, info.event.id);
        const dateTime = new Date(info.event.start);
        const formattedDateTime = editFormAllDay ? dayjs(dateTime).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
            : dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ssZ");

        setEditFormData({ ...editFormData, title: info.event.title, dateTime: formattedDateTime, id: info.event.id });
        setEditFormAllDay(info.event.allDay)
        setOpenEditModal(true);
    }

    const handleDeleteEvent = () => {
        axios.delete(apiURL + "/calendar/delete/" + editFormData.id,
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                console.log(response.data.message);
                setEditFormMessage("");
                setRenderEditFormMessage(false);
                setEditFormData({ title: "", dateTime: "", id: 0 });
                setEditFormAllDay(false);
                setUpdateEvents(!updateEvents); // To tell useEffect to fetch events again
                setOpenEditModal(false);
            })
            .catch(error => { console.log("Error happened during deleting event: " + error) });
    }

    return (
        <div>
            {/* Modal for creating events */}
            <Modal
                open={openCreateEventModal}
                onClose={handleCloseCreateEventModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: "absolute",
                    // width: "45%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}>
                    <form onSubmit={handleAddEventSubmit}>
                        <div className="addEvent">
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 7,
                                    p: 4
                                    // width: "100%",
                                }}>
                                    <TextField
                                        id="filled-search"
                                        label="Add Title"
                                        name="title"
                                        type="search"
                                        variant="filled"
                                        onChange={handleCreateFormChange}
                                        required
                                    />
                                    <FormGroup>
                                        <FormControlLabel control={<Switch onChange={toggleCreateFormAllDay} />} label="All day event?" />
                                    </FormGroup>
                                    {renderCreateFormMessage && (<Alert variant="filled" severity="warning"> {createFormMessage} </Alert>)}
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        {createFormAllDay ?
                                            <DatePicker
                                                onChange={handleCreateFormChange}
                                                required /> :
                                            <DateTimePicker
                                                onChange={handleCreateFormChange}
                                                required
                                            />
                                        }
                                    </LocalizationProvider>
                                    <Button variant="contained" type="submit" sx={{ width: "50%" }}>Create</Button>
                                </Box>
                            </Box>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Modal for editing events */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditEventModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: "absolute",
                    // width: "45%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}>
                    <form onSubmit={handleEditEventSubmit}>
                        <div className="addEvent">
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 7,
                                    p: 4
                                    // width: "100%",
                                }}>
                                    <TextField
                                        id="filled-search"
                                        label="Add Title"
                                        name="title"
                                        type="search"
                                        variant="filled"
                                        onChange={handleEditFormChange}
                                        value={editFormData.title}
                                        required
                                    />
                                    <FormGroup>
                                        <FormControlLabel control={
                                            editFormAllDay ? <Switch onChange={toggleEditFormAllDay} defaultChecked /> :
                                                <Switch onChange={toggleEditFormAllDay} />}
                                            label="All day event?" />
                                    </FormGroup>
                                    {renderEditFormMessage && (<Alert variant="filled" severity="warning"> {editFormMessage} </Alert>)}
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        {editFormAllDay ?
                                            <DatePicker
                                                onChange={handleEditFormChange}
                                                defaultValue={editFormData.dateTime ? dayjs(editFormData.dateTime) : null}
                                                required /> :
                                            <DateTimePicker
                                                onChange={handleEditFormChange}
                                                defaultValue={editFormData.dateTime ? dayjs(editFormData.dateTime) : null}
                                                required
                                            />
                                        }
                                    </LocalizationProvider>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 5
                                    }}>
                                        <Button variant="contained" type="submit" sx={{ width: "40%" }}>Edit</Button>
                                        <Button variant="contained" color="error" onClick={handleDeleteEvent} sx={{ width: "40%" }}>Delete</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </div>
                    </form>
                </Box>
            </Modal>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                // weekends={false}
                headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "addEventButton,dayGridYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                }}
                customButtons={{
                    addEventButton: {
                        text: "Add Event",
                        click: handleAddEventClick,
                    }
                }}
                eventClick={handleDateClick}
                events={events}

            />
        </div>
    )
}

export default CalendarCRUD;