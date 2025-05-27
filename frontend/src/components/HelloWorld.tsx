import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import {Button} from '@mui/material';


function HelloWorld () {
    const navigate = useNavigate();
    const handleClick = () => navigate("/");
    return (
        <div className="HelloWorld">
            <h1>HELLO WORLD!</h1>
            <Button variant="contained" onClick={handleClick}>Go back to home page</Button>
        </div>
    )
}

export default HelloWorld;