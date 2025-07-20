import authenticationService from "../services/authenticationService";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { Autocomplete, Button, Modal, Box, Typography, TextField, Switch, FormGroup, FormControlLabel, Alert, Badge, IconButton, Grid, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';

function GradPlanning() {
    const token = authenticationService.getCurrentUser();

    const currUserId = token ? token.id : 0;
    const currUserName = token ? token.name : "Error";

    const jwtToken = token ? token.token : "";

    // API URL 
    const apiURL = process.env.REACT_APP_API_URL;

    // State for storing modules
    const [mods, setMods] = useState([]);

    // States for snackbar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [selectedModule, setSelectedModule] = useState({});

    // States for courses dropdown
    const [supportedCourses, setSupportedCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    // States for user modules
    const [commonCurr, setCommonCurr] = useState([]);
    const [CSFoundation, setCSFoundation] = useState([]);
    const [breadthAndDepth, setBreadthAndDepth] = useState([]);
    const [mathAndScience, setMathAndScience] = useState([]);
    const [unrestrictedElective, setUnrestrictedElective] = useState([]);
    const [programmeRequirements, setProgrammeRequirements] = useState([]);

    // States for respective categories total credits added
    const [commonCurrTotal, setCommonCurrTotal] = useState(0);
    const [CSFoundationTotal, setCSFoundationTotal] = useState(0);
    const [breadthAndDepthTotal, setBreadthAndDepthTotal] = useState(0);
    const [mathAndScienceTotal, setMathAndScienceTotal] = useState(0);
    const [unrestrictedElectiveTotal, setUnrestrictedElectiveTotal] = useState(0);
    const [programmeRequirementsTotal, setProgrammeRequirementsTotal] = useState(0);

    // State to toggle so that we can call the API for fetching user modules again
    const [toggleFetchMods, setToggleFetchMods] = useState(false);
    const [toggleSelectCourse, setToggleSelectCourse] = useState(false);
    const [toggleAutoComplete, setToggleAutoComplete] = useState(false);

    // States for graduation booleans
    const [fulfilCommonCurr, setFulfilCommonCurr] = useState(false);
    // const [fulfilCSFoundation, setFulfilCSFoundation] = useState(false);
    // const [fulfilbreadthAndDepth, setFulfilBreadthAndDepth] = useState(false);
    // const [fulfilmathAndScience, setFulfilMathAndScience] = useState(false);
    const [fulfilunrestrictedElective, setFulfilUnrestrictedElective] = useState(false);
    const [fulfilProgrammeRequirements, setFulfilProgrammeRequirements] = useState(false);
    const [canGraduate, setCanGraduate] = useState(false);

    // Get the modules for the autocomplete and supported courses dropdown
    useEffect(() => {
        // TODO: Milestone 3: change this to server side instead of throwing all 15k mods into autocomplete, too slow
        // Autocomplete dropdown for selecting modules to add
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


        // Get the supported courses for the dropdown
        axios.get(apiURL + "/planning/supportedCourses/read", { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                if (!dismounted) {
                    setSupportedCourses(response.data);
                }
            })
            .catch(error => {
                if (!dismounted) {
                    console.log("Error happened fetching courses: " + error)
                }
            });

        // When dismounting set it to true so that the other asynchronous calls do not update anything to avoid the concurrent error hopefully
        return () => {
            dismounted = true;
        }

    }, [jwtToken, toggleAutoComplete]);

    // Get the current course the user has selected
    useEffect(() => {
        let dismounted = false;

        axios.get(apiURL + `/planning/selectedCourse/read/${currUserId}`, { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                if (!dismounted) {
                    setCurrentCourse({ course: response.data });
                }
            })
            .catch(error => {
                if (!dismounted) {
                    console.log("Error happened fetching selected course: " + error)
                }
            });

        // When dismounting set it to true so that the other asynchronous calls do not update anything to avoid the concurrent error hopefully
        return () => {
            dismounted = true;
        }

    }, [jwtToken, toggleSelectCourse]);

    // Get the modules the user added
    useEffect(() => {
        let dismounted = false;
        axios.get(apiURL + `/planning/modules/saved/read/${currUserId}`, { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                if (!dismounted) {
                    // Set mods for respective categories
                    console.log(response.data);
                    setCommonCurr(response.data.universityPillars);
                    setUnrestrictedElective(response.data.unrestrictedElectives);
                    setProgrammeRequirements(response.data.programmeRequirements);

                    // Set respective categories total credits added
                    setCommonCurrTotal(response.data.creditTotalForRequirements.universityPillarCreditTotal);
                    setUnrestrictedElectiveTotal(response.data.creditTotalForRequirements.unrestrictedElectivesCreditTotal);
                    setProgrammeRequirementsTotal(response.data.creditTotalForRequirements.programmeRequirementsCreditTotal);

                    // Set booleans regarding graduation
                    setFulfilCommonCurr(response.data.fulfilRequirements.fulfilUniversityPillars);
                    setFulfilUnrestrictedElective(response.data.fulfilRequirements.fulfilUnrestrictedElectives);
                    setFulfilProgrammeRequirements(response.data.fulfilRequirements.fulfilProgrammeRequirements);
                    setCanGraduate(response.data.fulfilRequirements.canGraduate);
                }
            })
            .catch(error => {
                if (!dismounted) {
                    console.log("Error happened fetching user mods: " + error)
                }
            });

        // When dismounting set it to true so that the other asynchronous calls do not update anything to avoid the concurrent error hopefully
        return () => {
            dismounted = true;
        }

    }, [jwtToken, toggleFetchMods]);

    const handleSnackBarClose = () => {
        setOpenSnackBar(false);
    }

    const handleAutoCompleteChange = (event, selected) => {
        setSelectedModule(selected);
    }

    const handleCourseAutoCompleteChange = (event, selected) => {
        if (!selected) {
            setCurrentCourse(null);
            return;
        }

        // Call PUT API to update selected course and then reset the modules for the user
        // encodeURIComponent is used since course has spaces in it
        axios.put(apiURL + `/planning/selectedCourse/update/${currUserId}/${encodeURIComponent(selected.course)}`,
            {},
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                // Trigger API call to get selected course
                setToggleSelectCourse(prev => !prev);

                // Trigger API call to update autocomplete containing mods,
                // since a new course is selected the module categories are now different
                setToggleAutoComplete(prev => !prev);
            })
            .then(() => { // Chain delete API
                return axios.delete(apiURL + `/planning/modules/reset/${currUserId}`,
                    { headers: { "Authorization": `Bearer ${jwtToken}` } })
                })
            .then(response => {
                // Trigger API call to get user modules
                setToggleFetchMods(prev => !prev);
            })
            .catch(error => console.log(error));
    }


    const handleAddModuleClick = () => {
        axios.post(apiURL + `/planning/modules/add/${currUserId}`,
            {
                moduleCode: selectedModule.moduleCode,
                moduleCredit: selectedModule.moduleCredit,
                category: selectedModule.category,
                subcategory: selectedModule.subcategory,
                subsubcategory: selectedModule.subsubcategory,
                level: selectedModule.level,
                secondCategory: selectedModule.secondCategory
            },
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setSnackBarMessage("Module successfully added");
                setOpenSnackBar(true);
                setToggleFetchMods(prev => !prev);
            })
            .catch(error => {
                console.log(error);
                setSnackBarMessage(error.response.data.message);
                setOpenSnackBar(true);
            });
    }

    const handleDeleteModuleClick = (id) => {
        axios.delete(apiURL + `/planning/modules/delete/${id}`,
            { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                setSnackBarMessage("Module successfully deleted");
                setOpenSnackBar(true);
                setToggleFetchMods(prev => !prev);
            })
            .catch(error => {
                setSnackBarMessage(error.response.data.message);
                setOpenSnackBar(true);
            });
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
                        options={supportedCourses}
                        getOptionLabel={(option) => option ? option.course : ""}
                        sx={{ width: { xs: '100%', sm: 350 } }}
                        onChange={handleCourseAutoCompleteChange}
                        value={currentCourse || ""}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;

                            return (
                                <Box
                                    component="li"
                                    key={key}
                                    {...optionProps}
                                >
                                    {option.course}
                                </Box>
                            );
                        }}

                        // Field for user to type
                        renderInput={(items) => <TextField {...items} label="Course" />}
                    />
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
                        sx={{ width: { xs: '100%', sm: '100%', md: 1000 } }}
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

                        // Field for user to type
                        renderInput={(items) => <TextField {...items} label="Modules" />}
                    />
                    <Button variant="contained" onClick={handleAddModuleClick} sx={{ transform: { xs: 'scale(1.0)', sm: 'scale(1.2)' }, minWidth: { xs: '80px', sm: 'auto' } }}>Add</Button>
                </Box>

                <Box>
                    <Typography variant="h4"> Can graduate: {canGraduate ? "YES" : "NO"}</Typography>
                </Box>

                <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3
                }}>

                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        flex: 1,
                    }}>
                        <Box sx={{
                            backgroundColor: "#fafafa",
                            borderRadius: 3,
                            minHeight: 100,
                            p: { xs: 1, sm: 2 },
                        }}>
                            <Typography variant="h5">Common Curriculumn Requirements ({commonCurrTotal} MCs)</Typography>
                            {commonCurr.map((mod, index) => (
                                <Box key={index}>
                                    <Grid container alignItems="center" spacing={{ xs: 1, sm: 2 }}>
                                        <Grid item xs={8}>
                                            <Typography>
                                                {mod.moduleCode} ({mod.moduleCredit} MC)
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={4} container justifyContent="flex-end" spacing={2}>
                                            <Grid item>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteModuleClick(mod.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br></br>
                                </Box>))}
                        </Box>
                        <Box sx={{
                            backgroundColor: "#fafafa",
                            borderRadius: 3,
                            minHeight: 100,
                            p: 2,
                        }}>
                            <Typography variant="h5">Unrestricted Electives  ({unrestrictedElectiveTotal} MCs)</Typography>
                            {unrestrictedElective.map((mod, index) => (
                                <Box key={index}>
                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid item xs={12} sm={8}>
                                            <Typography>
                                                {mod.moduleCode} ({mod.moduleCredit} MC)
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={4} container justifyContent={{ xs: "flex-start", sm: "flex-end" }} spacing={2}>
                                            <Grid item>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteModuleClick(mod.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br></br>
                                </Box>))}
                        </Box>
                    </Box>


                    <Box sx={{
                        flex: 1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p: { xs: 1, sm: 2 },
                    }}>
                        <Typography variant="h5">Programme Requirements ({CSFoundationTotal} MCs)</Typography>
                        {programmeRequirements.map((mod, index) => (
                            <Box key={index}>
                                <Grid container alignItems="center" spacing={{ xs: 1, sm: 2 }}>
                                    <Grid item xs={12} sm={8}>
                                        <Typography>
                                            {mod.moduleCode} ({mod.moduleCredit} MC)
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={4} container justifyContent={{ xs: "flex-start", sm: "flex-end" }} spacing={2}>
                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteModuleClick(mod.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br></br>
                            </Box>))}
                    </Box>
                </Box>
            </Box>
        </div>

    );
}
export default GradPlanning;