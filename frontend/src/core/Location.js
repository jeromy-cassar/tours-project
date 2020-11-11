import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import { readLocations, editLocation } from '../API/locationAPI'
import { addLocationToTour } from '../API/tourAPI'
import './Location.scss'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CreateLocation from "./CreateLocation";


const Location = ({ tourId, setParentDummy, parentDummy }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState({});
    const [id, setId] = useState();
    const [opened, setOpened] = useState(false);
    const [alertOpened, setAlertOpened] = useState(false);
    const [error, setError] = useState();
    const [dummy, setDummy] = useState(0);
    const [role, setRole] = useState(jwt.user.role);

    useEffect(() => {
        readLocations({ token }).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                setLocations(data);
            }
        });
    }, [dummy])

    const OpenForm = (e) => {
        let data = JSON.parse(e.target.id)
        setLocation(data)
        setOpened(true)
    }

    const handleAddLocation = (locationId) => (e) => {
        console.log("ids : ", locationId, tourId)
        addLocationToTour({ token, locationId, tourId }).then(data => {
            console.log("Data in addlocationToTour : ", data)
            if (data.error) {
                setError(data.error);
            } else {
                console.log("tirgeer parent Dummy :  ")
                setParentDummy(parentDummy + 1)
            }
        });
    }

    const showLocation = () => {
        return (
            <TableContainer component={Paper}>
                <Table className={""} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">City</TableCell>
                            <TableCell align="left">Country</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="left">X_axis</TableCell>
                            <TableCell align="left">Y_axis</TableCell>
                            <TableCell align="left">Area_code</TableCell>
                            <TableCell align="left">Min</TableCell>
                            {role === 1 &&
                                <TableCell align="left"><span className="mx-2 px-3">Actions</span></TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map((row, index) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {index}
                                </TableCell>
                                <TableCell align="left">{row.name}</TableCell>
                                <TableCell align="left">{row.city}</TableCell>
                                <TableCell align="left">{row.country}</TableCell>
                                <TableCell align="left">{row.description}</TableCell>
                                <TableCell align="left">{row.x_axis}</TableCell>
                                <TableCell align="left">{row.y_axis}</TableCell>
                                <TableCell align="left">{row.area_code}</TableCell>
                                <TableCell align="left">{row.min}</TableCell>
                                {role === 1 &&
                                    <TableCell align="left">
                                        <button className="button-blue mx-1" onClick={OpenForm} id={JSON.stringify(row)}>Edit</button>
                                        <button className="button-red mx-1" onClick={handleAddLocation(row._id)}>Add</button>
                                    </TableCell>
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    const handleChange = (name) => (e) => {
        var value = e.target.value
        setLocation({ ...location, [name]: value });
    }

    const clickAway = (action) => (e) => {
        var target = undefined
        if (action === "delete") {
            target = e.target.closest(".modal-container-delete-location")
        }
        else if (action === "edit") {
            console.log("this is edit")
            target = e.target.closest(".modal-container-edit-location")
            console.log("Target : ", target)

        }
        if (target) {

        } else {
            setOpened(false)
            setAlertOpened(false)
        }
    }

    const showError = () => {
        return error && (
            <div className="error-cont">
                {error}
            </div>
        )
    }

    const showForm = () => {
        return opened === true ? (
            <div className=" modal-background  row justify-content-center align-items-center" onClick={clickAway("edit")}>
                <div className="modal-container-edit-location my-modal modal-container">
                    <div className="modal-header">{`Editing ${location.name}...`}</div>
                    <div className="modal-body">
                        {showError()}
                        <div>name : <input value={location.name} onChange={handleChange("name")} /></div>
                        <div>city : <input value={location.city} onChange={handleChange("city")} /></div>
                        <div>country : <input value={location.country} onChange={handleChange("country")} /></div>
                        <div>description : <input value={location.description} onChange={handleChange("description")} /></div>
                        <div>x_axis : <input value={location.x_axis} onChange={handleChange("x_axis")} /></div>
                        <div>y_axis : <input value={location.y_axis} onChange={handleChange("y_axis")} /></div>
                        <div>area_code : <input value={location.area_code} onChange={handleChange("area_code")} /></div>
                        <div>min : <input value={location.min} onChange={handleChange("min")} /></div>
                        <button className="button-blue submit-button mx-1" onClick={handleEdit} >Submit</button>
                    </div>
                </div>
            </div>
        ) : ""
    }

    const handleEdit = () => {
        editLocation({ token, id: location._id, location }).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                setDummy(dummy + 1)
                setParentDummy(parentDummy + 1)
                setOpened(false)
            }
        })
    }


    return (
        <div className="location-container ">
            {showLocation()}
            {showForm()}
            <CreateLocation rerender={setDummy} dummy />
            {/* {showAlert()} */}
        </div>
    )
}

export default Location