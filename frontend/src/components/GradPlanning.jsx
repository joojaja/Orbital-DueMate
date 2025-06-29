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
    const apiURL = process.env.REACT_APP_API_URL;

    // State for storing modules
    const [mods, setMods] = useState([]);

    // States for snackbar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [selectedModule, setSelectedModule] = useState({});

    // States for user modules
    const [commonCurr, setCommonCurr] = useState([]);
    const [CSFoundation, setCSFoundation] = useState([]);
    const [breadthAndDepth, setBreadthAndDepth] = useState([]);
    const [mathAndScience, setMathAndScience] = useState([]);
    const [unrestrictedElective, setUnrestrictedElective] = useState([]);

    // States for respective categories total credits added
    const [commonCurrTotal, setCommonCurrTotal] = useState(0);
    const [CSFoundationTotal, setCSFoundationTotal] = useState(0);
    const [breadthAndDepthTotal, setBreadthAndDepthTotal] = useState(0);
    const [mathAndScienceTotal, setMathAndScienceTotal] = useState(0);
    const [unrestrictedElectiveTotal, setUnrestrictedElectiveTotal] = useState(0);


    // State to toggle so that we can call the API for fetching user modules again
    const [toggleFetchMods, setToggleFetchMods] = useState(false);

    // States for graduation booleans
    const [fulfilCommonCurr, setFulfilCommonCurr] = useState(false);
    const [fulfilCSFoundation, setFulfilCSFoundation] = useState(false);
    const [fulfilbreadthAndDepth, setFulfilBreadthAndDepth] = useState(false);
    const [fulfilmathAndScience, setFulfilMathAndScience] = useState(false);
    const [fulfilunrestrictedElective, setFulfilUnrestrictedElective] = useState(false);
    const [canGraduate, setCanGraduate] = useState(false);

    // Get the modules for the autocomplete 
    useEffect(() => {
        // TODO: Milestone 3: change this to server side instead of throwing all 15k mods into autocomplete, too slow
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

    // Get the modules the user added
    useEffect(() => {
        let dismounted = false;
        axios.get(apiURL + `/planning/modules/saved/read/${currUserId}`, { headers: { "Authorization": `Bearer ${jwtToken}` } })
            .then(response => {
                if (!dismounted) {
                    // Set mods for respective categories
                    setCommonCurr(response.data.universityPillars);
                    setCSFoundation(response.data.compSciFoundation);
                    setBreadthAndDepth(response.data.compSciBreadthAndDepth);
                    setMathAndScience(response.data.mathAndScience);
                    setUnrestrictedElective(response.data.unrestrictedElectives);


                    // Set respective categories total credits added
                    setCommonCurrTotal(response.data.creditTotalForRequirements.universityPillarCreditTotal);
                    setCSFoundationTotal(response.data.creditTotalForRequirements.csfoundationCreditTotal);
                    setBreadthAndDepthTotal(response.data.creditTotalForRequirements.breadthAndDepthCreditTotal);
                    setMathAndScienceTotal(response.data.creditTotalForRequirements.mathAndScienceCreditTotal);
                    setUnrestrictedElectiveTotal(response.data.creditTotalForRequirements.unrestrictedElectivesCreditTotal);

                    // Set booleans regarding graduation
                    setFulfilCommonCurr(response.data.fulfilRequirements.fulfilUniversityPillars);
                    setFulfilCSFoundation(response.data.fulfilRequirements.fulfilComputerScienceFoundation);
                    setFulfilBreadthAndDepth(response.data.fulfilRequirements.fulfilBreadthAndDepth);
                    setFulfilMathAndScience(response.data.fulfilRequirements.fulfilMathAndScience);
                    setFulfilUnrestrictedElective(response.data.fulfilRequirements.fulfilUnrestrictedElectives);
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
                setToggleFetchMods(!toggleFetchMods);
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
                setToggleFetchMods(!toggleFetchMods);
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

                <Box>
                    <Typography variant="h4"> Can graduate: {canGraduate ? "YES" : "NO"}</Typography>
                </Box>

                <Box sx={{
                    display: "flex",
                    // alignItems: "center",
                    gap: 3
                }}>
                    <Box sx={{
                        flex: 1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p: 2,
                    }}>
                        <Typography variant="h5">Common Curriculumn Requirements ({commonCurrTotal} MCs)</Typography> 
                        {commonCurr.map((mod, index) => (  
                        <Box key={index}>
                            <Grid container alignItems="center" spacing={2}>
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
                        flex: 1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p: 2,
                    }}>
                        <Typography variant="h5">Computer Science Foundation ({CSFoundationTotal} MCs)</Typography>
                        {CSFoundation.map((mod, index) => (  
                        <Box key={index}>
                            <Grid container alignItems="center" spacing={2}>
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
                </Box>
                <Box sx={{
                    display: "flex",
                    // alignItems: "center",
                    gap: 3
                }}>
                    <Box sx={{
                        flex: 1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p: 2,
                    }}>
                        <Typography variant="h5">Computer Science Breadth and Depth ({breadthAndDepthTotal} MCs)</Typography>
                        {breadthAndDepth.map((mod, index) => (  
                        <Box key={index}>
                            <Grid container alignItems="center" spacing={2}>
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

                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>

                        <Typography variant="h5">Mathematics and Sciences ({mathAndScienceTotal} MCs)</Typography>
                        {mathAndScience.map((mod, index) => (  
                        <Box key={index}>
                            <Grid container alignItems="center" spacing={2}>
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
                        flex: 1,
                        backgroundColor: "#fafafa",
                        borderRadius: 3,
                        minHeight: 100,
                        p: 2,
                    }}>
                        <Typography variant="h5">Unrestricted Electives  ({unrestrictedElectiveTotal} MCs)</Typography>
                        {unrestrictedElective.map((mod, index) => (  
                        <Box key={index}>
                            <Grid container alignItems="center" spacing={2}>
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
                </Box>
            </Box>
        </div>

    );

}

export default GradPlanning;