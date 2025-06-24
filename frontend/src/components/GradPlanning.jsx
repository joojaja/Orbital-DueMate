import authenticationService from "../services/authenticationService";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { Autocomplete, Button, Modal, Box, Typography, TextField, Switch, FormGroup, FormControlLabel, Alert, Badge, IconButton, Grid, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';

function GradPlanning() {
    const token = authenticationService.getCurrentUser();

    const currUserId = token.id;
    const currUserName = token.name;

    const jwtToken = token.token;

    // API URL 
    const apiURL = "http://localhost:8081";

    // State for storing modules
    const [mods, setMods] = useState([]);

    // States for snackbar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [selectedModule, setSelectedModule] = useState({});

    // Get the modules for the autocomplete
    useEffect(() => {
        let dismounted = false;
        axios.get(apiURL + "/planning/modules/read", { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                if (!dismounted) {
                    setMods(response.data);
                }
            })
            .catch(error => {
                if (!dismounted) {
                    console.log("Error happened fetching mods: " + error)
                }
            });

        // When dismounting set it to true so that the other asynchronous calls do not update anything to avoid the concurrent error hopefully
        return () => {
            dismounted = true;
        }

    }, [jwtToken]);

    const handleSnackBarClose = () => {
        setOpenSnackBar(false);
    }

    const handleAutoCompleteChange = (event, selected) => {
        setSelectedModule(selected);
    }

    const handleAddModuleClick = () => {
        console.log(selectedModule);
    }

    return (
        <div>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                p: 3
            }}>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={openSnackBar}
                    onClose={handleSnackBarClose}
                    message={snackBarMessage}
                    autoHideDuration={3000}
                />
                <Box>
                    <Typography variant="h4">Graduation Planning</Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3
                }}>
                    <Autocomplete
                        disablePortal
                        options={mods}
                        getOptionLabel={(option) => option.moduleCode}
                        sx={{ width: 1000 }}
                        onChange={handleAutoCompleteChange}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;

                            return (
                                <Box
                                    component="li"
                                    key={key}
                                    {...optionProps}
                                >
                                    {option.moduleCode} ({option.moduleCredit} credits)
                                </Box>
                            );
                        }}
                        renderInput={(items) => <TextField {...items} label="Modules" />}
                    />
                    <Button variant="contained" onClick={handleAddModuleClick} sx={{ transform: 'scale(1.2)' }}>Add</Button>
                </Box>
                <Box sx={{
                    display: "flex",
                    // alignItems: "center",
                    gap: 3
                }}>
                    <Box sx={{
                        flex:1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p:2,
                    }}>
                        <Typography variant="h5">Common Curriculumn Requirements</Typography>
                        {/* invites.map((inv, index) => ( // CalendarInviteID
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
                        </Box> */}
                    </Box>
                    <Box sx={{
                        flex:1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p:2,
                    }}>
                        <Typography variant="h5">Computer Science Foundation</Typography>
                    </Box>
                </Box>
                <Box sx={{
                    display: "flex",
                    // alignItems: "center",
                    gap: 3
                }}>
                    <Box sx={{
                        flex:1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p:2,
                    }}>
                        <Typography variant="h5">Computer Science Breadth and Depth + Mathematics and Sciences</Typography>
                    </Box>
                    <Box sx={{
                        flex:1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p:2,
                    }}>
                        <Typography variant="h5">Unrestricted Electives</Typography>
                    </Box>
                </Box>
            </Box>
        </div>

    );

}

export default GradPlanning;