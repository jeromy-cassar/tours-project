import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import { readLocations, deleteLocation, editLocation, copyLocation } from '../API/locationAPI'
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


const LocationPage = () => {
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

    const OpenAlert = (param_id) => (e) => {
        setId(param_id)
        setAlertOpened(true)
    }

    const handleCopy = (param_id) => (e) => {
        copyLocation({token, locationId:param_id}).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                setDummy(dummy + 1)
            }
        })
    }

    const showLocation = () => {
        return (
            <div>
                <div className="locations-label">
                    Locations!
                </div>
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
                                    <TableCell align="left"><span className="" style={{paddingRight:'7rem'}}>Actions</span></TableCell>
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
                                            <button className="button-blue mx-1" onClick={OpenForm} id={JSON.stringify(row)}>edit</button>
                                            <button className="button-red mx-1" onClick={OpenAlert(row._id)}>delete</button>
                                            <button className="button-grey mx-1" onClick={handleCopy(row._id)}>copy</button>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }

    const handleChange = (name) => (e) => {
        var value = e.target.value
        setLocation({ ...location, [name]: value });
    }

    const clickAway = (e) => {
        var target = e.target.closest(".modal-container")
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
            <div className="modal-background row justify-content-center align-items-center" onClick={clickAway}>
                <div className="modal-container my-modal">
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
                setOpened(false)
            }
        })
    }

    const showAlert = (id) => {
        return alertOpened === true ? (
            <div className="modal-background row justify-content-center align-items-center" onClick={clickAway}>
                <div className="modal-container modal-container-for-remove">
                    <div className="modal-header">
                        Remove this location?
                    </div>
                    <div className="modal-body ">
                        <div className="remove-options">
                            <button className="button-blue mx-1" onClick={handleDelete} >Yes</button>
                            <button className="button-red mx-1" onClick={() => { setAlertOpened(false) }}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        ) : ""
    }

    const handleDelete = (e) => {
        deleteLocation({ token, id }).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                setDummy(dummy + 1)
                setAlertOpened(false)
            }
        })
    }

    return (
        <Layout>
            <div className="location-container px-2 py-2">
                {showLocation()}
                {showForm()}
                {showAlert()}
                <CreateLocation rerender={setDummy} dummy />
            </div>
        </Layout>
    )
}

export default LocationPage