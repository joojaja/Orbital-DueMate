import dayjs from "dayjs";
import authenticationService from "../services/authenticationService";
import axios, { all } from "axios";

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import { Button, Modal, Box, Typography, TextField, Switch, FormGroup, FormControlLabel, Alert, Badge, IconButton, Grid, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Snackbar from '@mui/material/Snackbar';
import interactionPlugin from '@fullcalendar/interaction';
import MailIcon from '@mui/icons-material/Mail';

import "../styles/CalendarCRUD.css";

// Can add something to toggle in mounting for events to update after onChange for select
function CalendarCRUD() {
    const token = authenticationService.getCurrentUser();

    const currUserId = token.id;
    const currUserName = token.name;

    const jwtToken = token.token;

    // State for id of current user's calendar
    const [currCalendarUserId, setCurrCalendarUserId] = useState(token.id);

    // State for calendar events
    const [events, setEvents] = useState([]);

    // State that we toggle so that useEffect cann fetch events from backend again
    const [updateEvents, setUpdateEvents] = useState(false);
    const [updateInvites, setUpdateInvites] = useState(false);
    const [updateAcceptedInvites, setUpdateAcceptedInvites] = useState(false);

    // States for modals
    const [openCreateEventModal, setOpenCreateEventModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openInviteNotiModal, setOpenInviteNotiModal] = useState(false);
    const [openSendInviteModal, setOpenSendInviteModal] = useState(false);

    // State to hold form data for creating events
    const [createFormData, setCreateFormData] = useState({ title: "", dateTime: "", endTime: null, description: "" });
    const [editFormData, setEditFormData] = useState({ title: "", dateTime: "", endTime: null, description: "", editedBy: "", id: 0 });

    // State to hold all day event that can be toggled
    const [createFormAllDay, setCreateFormAllDay] = useState(false);
    const [editFormAllDay, setEditFormAllDay] = useState(false);

    // States for rendering the message and whether to show for create event form
    const [renderCreateFormMessage, setRenderCreateFormMessage] = useState(false);
    const [createFormMessage, setCreateFormMessage] = useState("");

    const [renderEditFormMessage, setRenderEditFormMessage] = useState(false);
    const [editFormMessage, setEditFormMessage] = useState("");

    // States for snackbar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");

    // States for invites
    const [inviteCount, setInviteCount] = useState(0);
    const [invites, setInvites] = useState([]);

    // State for sending invite
    const [emailToInvite, setEmailToInvite] = useState("");

    // State for selecting calendar
    const [currUserCalendar, setCurrUserCalendar] = useState(currUserId);
    const [acceptedCalendars, setAcceptedCalendars] = useState([{ id: currUserId, name: currUserName }]);

    // API URL for calendar events
    const apiURL = "http://localhost:8081";

    // API call to retrieve calendar events that is called during mount/dismount and when events are changed
    useEffect(() => {
        let dismounted = false;
        axios.get(apiURL + `/calendar/read/${currCalendarUserId}`, { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                if (!dismounted) {
                    const calendarEvents = response.data.map(event => {
                        return {
                            id: event.id,
                            title: event.name,
                            start: event.dateTime,
                            end: event.endTime,
                            allDay: event.allDay,
                            extendedProps: {
                                description: event.description,
                                editedBy: event.editedBy,
                            }
                        }
                    });

                    setEvents(calendarEvents);
                }
            })
            .catch(error => {
                if (!dismounted) {
                    console.log("Error happened during login: " + error)
                }
            });

        // When dismounting set it to true so that the other asynchronous calls do not update anything to avoid the concurrent error hopefully
        return () => {
            dismounted = true;
        }
    }, [updateEvents, currCalendarUserId, jwtToken]);


    // API call every minute to update notifications for invites
    useEffect(() => {
        let dismounted = false;

        const getNotifications = () => {
            axios.get(apiURL + `/calendar/invite/read/${currUserId}`, { headers: { "Authorization": `Bearer ${jwtToken}` } })
                .then(response => {
                    // Prevent updating of states when dismounting to avoid getting concurrent error from React
                    if (!dismounted) {
                        let count = response.data.count;
                        let invites = response.data.invites;

                        setInviteCount(count);
                        setInvites(invites);

                        console.log(count, invites);
                    }
                })
                .catch(error => {
                    // Prevent updating of states when dismounting to avoid getting concurrent error from React
                    if (!dismounted) {
                        console.log("Error happened during polling of invite notification: " + error);
                    }
                });
        }

        getNotifications();

        // Poll every 30 seconds
        const notifcationPollingInterval = setInterval(getNotifications, 30000);

        // When dismounting we clear/stop the polling interval
        return () => {
            dismounted = true;
            // When dismounting set it to true so that the other asynchronous calls do not update anything to avoid the concurrent error hopefully
            clearInterval(notifcationPollingInterval);
        }
    }, [updateInvites]);

    // API call to get accepted invites
    useEffect(() => {
        let dismounted = false;
        axios.get(apiURL + `/calendar/acceptedinvites/read/${currUserId}`, { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                if (!dismounted) {
                    const calendarInvitesAccepted = response.data.map(event => {
                        return {
                            id: event.id,
                            name: event.name
                        }
                    });

                    const currCalendar = acceptedCalendars.length > 0 ? [acceptedCalendars[0]] : [];
                    const newCalendars = currCalendar.concat(calendarInvitesAccepted);
                    setAcceptedCalendars(newCalendars);
                }
            })
            .catch(error => {
                if (!dismounted) {
                    console.log("Error happened during loading accepted calendar invites: " + error)
                }
            });

        // When dismounting set it to true so that the other asynchronous calls do not update anything to avoid the concurrent error hopefully
        return () => {
            dismounted = true;
        }
    }, [currUserId, jwtToken, updateAcceptedInvites]);


    const handleSnackBarClose = () => {
        setOpenSnackBar(false);
    }

    const handleCloseCreateEventModal = () => {
        setCreateFormMessage("");
        setRenderCreateFormMessage(false);
        setCreateFormData({ title: "", dateTime: "", endTime: null, description: "" });
        setCreateFormAllDay(false);
        setOpenCreateEventModal(false);
    }

    const handleCloseEditEventModal = () => {
        setEditFormMessage("");
        setRenderEditFormMessage(false);
        setEditFormData({ title: "", dateTime: "", endTime: null, description: "", editedBy: "", id: 0 });
        setEditFormAllDay(false);
        setOpenEditModal(false);
    };

    const handleCloseInviteNotiModal = () => {
        setOpenInviteNotiModal(false);
    };

    const handleCloseSendInviteModal = () => {
        setEmailToInvite("");
        setOpenSendInviteModal(false);
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

    // Work on logic for end time also......
    const handleCreateFormChange = (event) => {
        if (event && event.target) {
            setCreateFormData({ ...createFormData, [event.target.name]: event.target.value });
        }
    }

    const handleCreateFormDateTimeChange = (event) => {
        const dateOrDateTime = createFormAllDay ?
            dayjs(event).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ") //Set time to midnight since Java instant needs a time
            : dayjs(event).format("YYYY-MM-DDTHH:mm:ssZ");

        setCreateFormData({ ...createFormData, dateTime: dateOrDateTime });
    }

    const handleCreateFormEndTimeChange = (event) => {
        const dateOrDateTime = createFormAllDay ?
            dayjs(event).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ") //Set time to midnight since Java instant needs a time
            : dayjs(event).format("YYYY-MM-DDTHH:mm:ssZ");

        setCreateFormData({ ...createFormData, endTime: dateOrDateTime });
    }

    const handleEditFormChange = (event) => {
        if (event && event.target) {
            setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
        }
    }

    const handleEditFormDateTimeChange = (event) => {
        const dateOrDateTime = editFormAllDay ?
            dayjs(event).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ") //Set time to midnight since Java instant needs a time
            : dayjs(event).format("YYYY-MM-DDTHH:mm:ssZ");

        setEditFormData({ ...editFormData, dateTime: dateOrDateTime });
    }

    const handleEditFormEndTimeChange = (event) => {
        const dateOrDateTime = editFormAllDay ?
            dayjs(event).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ") //Set time to midnight since Java instant needs a time
            : dayjs(event).format("YYYY-MM-DDTHH:mm:ssZ");

        setEditFormData({ ...editFormData, endTime: dateOrDateTime });
    }

    const handleInviteChange = (event) => {
        if (event && event.target) {
            setEmailToInvite(event.target.value);
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
                    endTime: createFormData.endTime,
                    allDay: createFormAllDay,
                    description: createFormData.description,
                    userId: currCalendarUserId,
                    createdByUserId: currUserId
                },
                { headers: { "Authorization": `Bearer ${jwtToken}` } })
                .then(response => {
                    console.log(response.data.message);
                    setCreateFormMessage("");
                    setRenderCreateFormMessage(false);

                    setCreateFormData({ title: "", dateTime: "", endTime: null, description: "" });
                    setCreateFormAllDay(false);
                    setUpdateEvents(!updateEvents); // To tell useEffect to fetch events again
                    setOpenCreateEventModal(false);

                    setSnackBarMessage("Event successfully created");
                    setOpenSnackBar(true);
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
                    endTime: editFormData.endTime,
                    allDay: editFormAllDay,
                    description: editFormData.description,
                    userId: currUserId
                },
                { headers: { "Authorization": `Bearer ${jwtToken}` } })
                .then(response => {
                    console.log(response.data.message);
                    setEditFormMessage("");
                    setRenderEditFormMessage(false);

                    setEditFormData({ title: "", dateTime: "", endTime: null, description: "", editedBy: "", id: 0 });
                    setEditFormAllDay(false);
                    setUpdateEvents(!updateEvents); // To tell useEffect to fetch events again
                    setOpenEditModal(false);

                    setSnackBarMessage("Event successfully edited");
                    setOpenSnackBar(true);
                })
                .catch(error => { console.log("Error happened during editing event: " + error) });
        }
    }

    const handleDateClick = (info) => {
        const dateTime = new Date(info.event.start);
        const formattedDateTime = editFormAllDay ? dayjs(dateTime).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
            : dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ssZ");


        let formattedEndTime = null;
        if (info.event.end) {
            const endTime = new Date(info.event.end);
            formattedEndTime = editFormAllDay ? dayjs(endTime).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
                : dayjs(endTime).format("YYYY-MM-DDTHH:mm:ssZ");
        }

        console.log(info.event.start, info.event.end)
        setEditFormData({
            ...editFormData, title: info.event.title, dateTime: formattedDateTime, endTime: formattedEndTime,
            description: info.event.extendedProps.description, editedBy: info.event.extendedProps.editedBy, id: info.event.id
        });

        setEditFormAllDay(info.event.allDay)
        setOpenEditModal(true);
    }

    const handleDeleteEvent = () => {
        axios.delete(apiURL + "/calendar/delete/" + editFormData.id,
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setEditFormMessage("");
                setRenderEditFormMessage(false);

                setEditFormData({ title: "", dateTime: "", endTime: null, description: "", editedBy: "", id: 0 });
                setEditFormAllDay(false);
                setUpdateEvents(!updateEvents); // To tell useEffect to fetch events again
                setOpenEditModal(false);

                setSnackBarMessage("Event successfully deleted");
                setOpenSnackBar(true);
            })
            .catch(error => { console.log("Error happened during deleting event: " + error) });
    }

    const handleInviteButtonClick = () => {
        setOpenSendInviteModal(true);
    }

    const handleSendInviteSubmit = (event) => {
        event.preventDefault();
        axios.post(apiURL + "/calendar/invite/create",
            {
                email: emailToInvite,
                userId: currUserId
            },
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setEmailToInvite("");
                setOpenSendInviteModal(false);

                setSnackBarMessage("Invite successfully sent");
                setOpenSnackBar(true);
            })
            .catch(error => {
                console.log(error);
                setSnackBarMessage(error.response.data.message);
                setOpenSnackBar(true);
            });
    }


    const handleAcceptInvite = (entryId) => {
        axios.put(apiURL + "/calendar/invite/accept/" + entryId, {},
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setUpdateInvites(!updateInvites)
                setSnackBarMessage("Invite successfully accepted");
                setOpenSnackBar(true);
                setUpdateAcceptedInvites(!updateAcceptedInvites);
            })
            .catch(error => { console.log("Error happened during accepting invite: " + error) });
    }

    const handleRejectInvite = (entryId) => {
        axios.put(apiURL + "/calendar/invite/reject/" + entryId, {},
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setUpdateInvites(!updateInvites)
                setSnackBarMessage("Invite successfully rejected");
                setOpenSnackBar(true);
            })
            .catch(error => { console.log("Error happened during accepting invite: " + error) });
    }

    const handleNotifIconClick = () => {
        setOpenInviteNotiModal(true);
    }

    const handleSelectCalendar = (event) => {
        setCurrUserCalendar(event.target.value);
        setCurrCalendarUserId(event.target.value);
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={openSnackBar}
                onClose={handleSnackBarClose}
                message={snackBarMessage}
                autoHideDuration={3000}
            />

            {/* Notifications and invite button*/}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={currUserCalendar}
                        // label="Age"
                        onChange={handleSelectCalendar}
                    >
                        {acceptedCalendars.map((calendar) => (<MenuItem value={calendar.id}>{calendar.name}</MenuItem>))}
                        {/* <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                </FormControl>
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                }}>
                    <Badge badgeContent={inviteCount} color="success">
                        <IconButton onClick={handleNotifIconClick}>
                            <MailIcon fontSize="large" color="action" />
                        </IconButton>
                    </Badge>
                    <Button variant="contained" onClick={handleInviteButtonClick}>Invite</Button>
                </Box>
            </Box>
            {/* Modal for sending invites */}
            <Modal
                open={openSendInviteModal}
                onClose={handleCloseSendInviteModal}
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
                    <form onSubmit={handleSendInviteSubmit}>
                        <div className="checkInvite">
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

                                    <Box>
                                        {/* <Typography> Email of user: </Typography> */}
                                        <TextField
                                            id="filled-search"
                                            label="Email of user"
                                            name="email"
                                            type="search"
                                            variant="filled"
                                            onChange={handleInviteChange}
                                            required
                                        />
                                    </Box>
                                    <Button variant="contained" type="submit" sx={{ width: "80%" }}>Send Invite</Button>
                                </Box>
                            </Box>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Modal for checking notification invites */}
            <Modal
                open={openInviteNotiModal}
                onClose={handleCloseInviteNotiModal}
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
                    {/* Check if there is invites or not*/}
                    {inviteCount >= 1 ? invites.map((inv, index) => ( // CalendarInviteID
                        <Box key={index}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={8}>
                                    <Typography>
                                        Name: {inv.name}, Email: {inv.email}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4} container justifyContent="flex-end" spacing={2}>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => handleAcceptInvite(inv.calendarInviteID)}
                                        >
                                            Accept
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleRejectInvite(inv.calendarInviteID)}
                                        >
                                            Reject
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )) : <Typography variant="h3"> You do not have any invites</Typography>}
                </Box>
            </Modal>

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

                                    <Box>
                                        <Typography> Start </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            {createFormAllDay ?
                                                <DatePicker
                                                    onChange={handleCreateFormDateTimeChange}
                                                    required /> :
                                                <DateTimePicker
                                                    onChange={handleCreateFormDateTimeChange}
                                                    required
                                                />
                                            }
                                        </LocalizationProvider>
                                    </Box>

                                    <Box>
                                        <Typography> End </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            {createFormAllDay ?
                                                <DatePicker
                                                    onChange={handleCreateFormEndTimeChange}
                                                    required /> :
                                                <DateTimePicker
                                                    onChange={handleCreateFormEndTimeChange}
                                                    required
                                                />
                                            }
                                        </LocalizationProvider>
                                    </Box>

                                    <TextField
                                        multiline
                                        label="Description"
                                        name="description"
                                        rows={4}
                                        variant="filled"
                                        onChange={handleCreateFormChange}
                                        fullWidth
                                    />

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

                                    <Box>
                                        <Typography> Start </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            {editFormAllDay ?
                                                <DatePicker
                                                    onChange={handleEditFormDateTimeChange}
                                                    defaultValue={editFormData.dateTime ? dayjs(editFormData.dateTime) : null}
                                                    required /> :
                                                <DateTimePicker
                                                    onChange={handleEditFormDateTimeChange}
                                                    defaultValue={editFormData.dateTime ? dayjs(editFormData.dateTime) : null}
                                                    required
                                                />
                                            }
                                        </LocalizationProvider>
                                    </Box>

                                    <Box>
                                        <Typography> End </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            {editFormAllDay ?
                                                <DatePicker
                                                    onChange={handleEditFormEndTimeChange}
                                                    defaultValue={editFormData.endTime ? dayjs(editFormData.endTime) : null}
                                                /> :
                                                <DateTimePicker
                                                    onChange={handleEditFormEndTimeChange}
                                                    defaultValue={editFormData.endTime ? dayjs(editFormData.endTime) : null}
                                                />
                                            }
                                        </LocalizationProvider>
                                    </Box>

                                    <TextField
                                        multiline
                                        label="Description"
                                        name="description"
                                        rows={4}
                                        variant="filled"
                                        onChange={handleEditFormChange}
                                        value={editFormData.description}
                                        fullWidth
                                    />

                                    <Typography> Edited By: {editFormData.editedBy} </Typography>

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