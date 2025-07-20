import dayjs from "dayjs";
import authenticationService from "../services/authenticationService";
import axios, { all } from "axios";

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import { Button, Modal, Box, Typography, TextField, Switch, FormGroup, FormControlLabel, Alert, Badge, IconButton, Grid, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
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

    const currUserId = token ? token.id : 0;
    const currUserName = token ? token.name : "Error";

    const jwtToken = token ? token.token : "";

    // State for id of current user's calendar
    const [currCalendarUserId, setCurrCalendarUserId] = useState(token.id);

    // State for calendar events
    const [events, setEvents] = useState([]);

    // State that we toggle so that useEffect cann fetch events from backend again
    const [updateEvents, setUpdateEvents] = useState(false);
    const [updateInvites, setUpdateInvites] = useState(false);
    const [updateAcceptedInvites, setUpdateAcceptedInvites] = useState(false);
    const [updateInvitedUsers, setUpdateInvitedUsers] = useState(false);

    // States for modals
    const [openCreateEventModal, setOpenCreateEventModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openInviteNotiModal, setOpenInviteNotiModal] = useState(false);
    const [openSendInviteModal, setOpenSendInviteModal] = useState(false);
    const [openManageAcceptedCalendarModal, setOpenManageAcceptedCalendarModal] = useState(false); 
    const [openManageInvitedUsersModal, setOpenManageInvitedUsersModal] = useState(false);

    // State to hold form data for creating events
    const [createFormData, setCreateFormData] = useState({ title: "", dateTime: "", endTime: null, description: "" });
    const [editFormData, setEditFormData] = useState({ belongsTo: "", title: "", dateTime: "", endTime: null, description: "", editedBy: "", id: 0 });

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
    const [selectedCalendars, setSelectedCalendars] = useState(new Set()); // For multi select 
    const [calendarChecked, setCalendarChecked] = useState({});
    const [acceptedCalendars, setAcceptedCalendars] = useState([{ id: currUserId, name: currUserName }]);
    const [usersThatAcceptedInvite, setUsersThatAcceptedInvite] = useState([]);

    // API URL for calendar events
    const apiURL = process.env.REACT_APP_API_URL;

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
                    const calendarInvitesAccepted = [];
                    const calendarCheckedObj = {};
                    response.data.forEach(event => {
                        calendarInvitesAccepted.push({id: event.id, name: event.name, email: event.email});
                        calendarCheckedObj[event.id] = false; // Initialize calendarChecked for each invite
                    });
                    
                    // Extract logged in user's details and combine with accepted invites
                    const currCalendar = [acceptedCalendars[0]];
                    const newCalendars = currCalendar.concat(calendarInvitesAccepted);

                    // Set logged in user calendar as checked
                    calendarCheckedObj[currUserId] = true;

                    setCalendarChecked(prev => ({ ...prev, ...calendarCheckedObj}));
                    setSelectedCalendars(prev => {
                        const newSet = new Set(prev);
                        newSet.add(currUserId);
                        return newSet;
                    });

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


    // API call to get all the users that accepted invites from current user
    useEffect(() => {
        let dismounted = false;
        axios.get(apiURL + `/calendar/usersThatAcceptedInvite/read/${currUserId}`, { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                if (!dismounted) {
                    console.log(response.data);
                    const users = [];
                    response.data.forEach(event => {
                        users.push({id: event.id, name: event.name, email: event.email});
                    });
                    setUsersThatAcceptedInvite(users);
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
    }, [currUserId, jwtToken, updateInvitedUsers]);

    // API call to retrieve calendar events that is called during mount/dismount and when events are changed
    useEffect(() => {
        let dismounted = false;
        axios.post(apiURL + `/calendar/read`, Array.from(selectedCalendars), { headers: { "Authorization": `Bearer ${jwtToken}` }})
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
                                belongsTo: event.belongsTo,
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
    }, [updateEvents, selectedCalendars, jwtToken]);


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
        setEditFormData({ belongsTo: "", title: "", dateTime: "", endTime: null, description: "", editedBy: "", id: 0 });
        setEditFormAllDay(false);
        setOpenEditModal(false);
    };

    const handleCloseInviteNotiModal = () => {
        setOpenInviteNotiModal(false);
    };

    const handleCloseManageAcceptedCalendarModal = () => {
        setOpenManageAcceptedCalendarModal(false);
    };

    const handleCloseManageInvitedUsersModal = () => {
        setOpenManageInvitedUsersModal(false);
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
            axios.put(apiURL + `/calendar/update/${editFormData.id}`,
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

                    setEditFormData({ belongsTo: "", title: "", dateTime: "", endTime: null, description: "", editedBy: "", id: 0 });
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
            ...editFormData, belongsTo: info.event.extendedProps.belongsTo, title: info.event.title, dateTime: formattedDateTime, endTime: formattedEndTime,
            description: info.event.extendedProps.description, editedBy: info.event.extendedProps.editedBy, id: info.event.id
        });

        setEditFormAllDay(info.event.allDay)
        setOpenEditModal(true);
    }

    const handleDeleteEvent = () => {
        axios.delete(apiURL + `/calendar/delete/${editFormData.id}`,
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setEditFormMessage("");
                setRenderEditFormMessage(false);

                setEditFormData({ belongsTo: "", title: "", dateTime: "", endTime: null, description: "", editedBy: "", id: 0 });
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

    const handleManageAcceptedCalendarButtonClick = () => {
        setOpenManageAcceptedCalendarModal(true);
    }

    const handleManageInvitedUsersModal = () => {
        setOpenManageInvitedUsersModal(true);
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
        axios.put(apiURL + `/calendar/invite/accept/${entryId}`, {},
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
        axios.put(apiURL + `/calendar/invite/reject/${entryId}`, {},
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setUpdateInvites(!updateInvites)
                setSnackBarMessage("Invite successfully rejected");
                setOpenSnackBar(true);
            })
            .catch(error => { console.log("Error happened during accepting invite: " + error) });
    }

    const handleRemoveAcceptedCalendar = (entryId) => {
        axios.delete(apiURL + `/calendar/invite/delete/${currUserId}/${entryId}`,
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setUpdateAcceptedInvites(!updateAcceptedInvites);
                setUpdateEvents(!updateEvents);
                setSnackBarMessage("Calendar successfully removed");
                setOpenSnackBar(true);
            })
            .catch(error => { console.log("Error happened during deleting invite: " + error) });
    }

    const handleRemoveInvitedUserFromCalendar = (entryId) => {
        axios.delete(apiURL + `/calendar/invite/delete/${entryId}/${currUserId}`,
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setUpdateInvitedUsers(!updateInvitedUsers);
                setSnackBarMessage("User successfully removed from your calendar");
                setOpenSnackBar(true);
            })
            .catch(error => { console.log("Error happened during deleting invite: " + error) });
    }

    const handleNotifIconClick = () => {
        setOpenInviteNotiModal(true);
    }

    const handleSelectCalendar = (event) => {
        setCurrUserCalendar(event.target.value);
        setCurrCalendarUserId(event.target.value);
    }

    const toggleChecked = (event) => {
        console.log(event.target.id, event.target.checked);
        const checked = event.target.checked
        const calendarId = parseInt(event.target.id);
        setCalendarChecked(prev => ({...prev, [calendarId]: !prev[calendarId]}));

        if (checked) {
            setSelectedCalendars(prev => {
                const newSet = new Set(prev);
                newSet.add(calendarId);
                return newSet;
            });
        } else {
            setSelectedCalendars(prev => {
                const newSet = new Set(prev);
                newSet.delete(calendarId);
                return newSet;
            });
        }
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
                    alignItems: { xs: "stretch", sm: "center" },
                    p: { xs: 1, sm: 2 },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 }
                }}
            >
                <Box sx={{ 
                    display: "flex", 
                    gap: { xs: 1, sm: 4 },
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" }
                    }}>
                <Button variant="contained" color="success" onClick={handleManageInvitedUsersModal}>Manage Calendar</Button>
                <Button variant="contained" color="warning" onClick={handleManageAcceptedCalendarButtonClick}>Manage Accepted Calendars</Button>
                </Box>

                <Box sx={{
                    display: "flex",
                    justifyContent: { xs: "center", sm: "flex-end" },
                    alignItems: "center",
                    gap: 2,
                    p: { xs: 1, sm: 2 },
                }}>
                    <Badge badgeContent={inviteCount} color="success">
                        <IconButton onClick={handleNotifIconClick}>
                            <MailIcon fontSize="large" color="action" />
                        </IconButton>
                    </Badge>
                    <Button variant="contained" onClick={handleInviteButtonClick}>Invite</Button>
                </Box>
            </Box>

            {/* Multi-select for calendars */}
            <Box
            sx={{
                width: { xs: "95vw", sm: "90vw" },
                maxWidth: { xs: "95vw", sm: "90vw" },         
                overflowX: "auto",         
                whiteSpace: "nowrap",      
                height: { xs: "auto", sm: 70 },                
                display: "flex",
                alignItems: "center",
                scrollBehavior: "smooth",
                marginBottom: 2,
                padding: { xs: "8px", sm: "0" },
                flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
            >
                {acceptedCalendars.map((calendar) => (
                    <FormControlLabel
                    key={calendar.id}
                    control={
                        <Checkbox
                        checked={calendarChecked[calendar.id] || false}
                        id={calendar.id}
                        />
                    }
                    label={calendar.name}
                    onChange={toggleChecked}
                    sx={{ flexShrink: 0, 
                        marginRight: 2 }}
                    />
                ))}
            </Box>

             {/* Modal managing user's calendar invited users*/}
            <Modal
                open={openManageInvitedUsersModal}
                onClose={handleCloseManageInvitedUsersModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: "absolute",
                    width: { xs: "90%", sm: "auto" },
                    maxHeight: { xs: "80vh", sm: "auto" },
                    overflow: "auto",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
                }}>
                    {/* Check if there is any user that have accepted the invite or not*/}
                    {usersThatAcceptedInvite.length >= 1 ? usersThatAcceptedInvite.map((user, index) => ( 
                        <Box key={index} sx={{ 
                            marginBottom: 2
                        }}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={8}>
                                    <Typography>
                                        Name: {user.name}, Email: {user.email}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4} container justifyContent="flex-end" spacing={2}>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleRemoveInvitedUserFromCalendar(user.id)}
                                        >
                                            Remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )) : <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }, textAlign: { xs: 'center', sm: 'left' } }}> No users have accepted your calendar invite</Typography>}
                </Box>
            </Modal>

            {/* Modal managing accepted calendars */}
            <Modal
                open={openManageAcceptedCalendarModal}
                onClose={handleCloseManageAcceptedCalendarModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: "absolute",
                    width: { xs: "90%", sm: "auto" },
                    maxHeight: { xs: "80vh", sm: "auto" },
                    overflow: "auto",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
                }}>
                    {/* Check if there is any accepted calendars or not*/}
                    {acceptedCalendars.length >= 2 ? acceptedCalendars.slice(1).map((calendar, index) => ( // CalendarInviteID
                        <Box key={index} sx={{ 
                            marginBottom: 2
                        }}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={8}>
                                    <Typography>
                                        Name: {calendar.name}, Email: {calendar.email}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4} container justifyContent="flex-end" spacing={2}>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleRemoveAcceptedCalendar(calendar.id)}
                                        >
                                            Remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    )) : <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }, textAlign: { xs: 'center', sm: 'left' } }}> You do not have any accepted calendars</Typography>}
                </Box>
            </Modal>


            {/* Modal for sending invites */}
            <Modal
                open={openSendInviteModal}
                onClose={handleCloseSendInviteModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: "absolute",
                    width: { xs: "90%", sm: "auto" },
                    maxHeight: { xs: "80vh", sm: "auto" },
                    overflow: "auto",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
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
                    width: { xs: "90%", sm: "auto" },
                    maxHeight: { xs: "80vh", sm: "auto" },
                    overflow: "auto",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
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
                    width: { xs: "90%", sm: "auto" },
                    maxHeight: { xs: "80vh", sm: "auto" },
                    overflow: "auto",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
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
                                    gap: { xs: 4, sm: 7 },
                                    p: { xs: 2, sm: 4 },
                                    // width: "100%",
                                }}>
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel id="demo-simple-select-label">Calendar: </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={currUserCalendar}
                                        // label="Age"
                                        onChange={handleSelectCalendar}
                                    >
                                        {acceptedCalendars.map((calendar) => (<MenuItem value={calendar.id}>{calendar.name}</MenuItem>))}
                                    </Select>
                                </FormControl>
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
                                    gap: { xs: 4, sm: 7 },
                                    p: { xs: 2, sm: 4 },
                                    // width: "100%",
                                }}>
                                    <Alert severity="info">{editFormData.belongsTo}'s calendar</Alert>
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
                                        flexDirection: { xs: "column", sm: "row" },
                                        gap: { xs: 2, sm: 5 },
                                        width: "100%"
                                    }}>
                                        <Button variant="contained" type="submit" sx={{ xs: "100%", sm: "40%" }}>Edit</Button>
                                        <Button variant="contained" color="error" onClick={handleDeleteEvent} sx={{ xs: "100%", sm: "40%" }}>Delete</Button>
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
                    right: window.innerWidth < 768 ? "addEventButton" : "addEventButton,dayGridYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek"
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