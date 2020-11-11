import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import Location from "./Location";
import { readLocations, deleteLocation, editLocation } from '../API/locationAPI'
import { readTour, deleteLocationFromTour } from '../API/tourAPI'
import './LocationMg.scss'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CreateLocation from "./CreateLocation";


const LocationMg = ({ locMgOpened, setLocMgOpened, tourId, setParentDummy, parentDummy }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [id, setId] = useState();
    const [tour, setTour] = useState({ locations: [] });
    const [opened, setOpened] = useState();
    const [alertOpened, setAlertOpened] = useState(false);
    const [error, setError] = useState();
    const [dummy, setDummy] = useState(0);
    const [role, setRole] = useState(jwt.user.role);

    useEffect(() => {
        console.log("use effect in locationMg")
        readTour({ token, tourId }).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                setTour(data);
            }
        });
        
        setParentDummy(parentDummy+1)
        // setOpened(visible)

        // readLocations({ token }).then(data => {
        //     if (data.error) {
        //         setError(data.error);
        //     } else {
        //         console.log("what data : ", data)
        //         setLocations(data);
        //     }
        // });
    }, [dummy, tourId])


    const handleDeleteLocationFromTour = (locationId) => () => {

        deleteLocationFromTour({ token, locationId, tourId }).then(data => {
            console.log("Data in addlocationToTour : ", data)
            if (data.error) {
                setError(data.error);
            } else {
                setDummy(dummy + 1)
                // console.log("tirgeer parent Dummy :  ")
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
                                <TableCell align="left">Actions</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tour.locations.length > 0 ? tour.locations.map((row, index) => (
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
                                        {/* <button className="button-blue mx-1" onClick={addLocation} id={JSON.stringify(row)}>add</button> */}
                                        <button className="button-red  mx-1" onClick={handleDeleteLocationFromTour(row._id)}>delete</button>
                                    </TableCell>
                                }
                            </TableRow>
                        )) : <div>No location</div>}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }



    const clickAway = (e) => {
        var target = e.target.closest(".modal-container")
        if (target) {

        } else {
            setLocMgOpened(!locMgOpened)
        }
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

    return locMgOpened === true ? (
        <div className="modal-background row align-items-center justify-content-center" onClick={clickAway} >
            <div className="modal-container my-modal modal-locMg">
                <div className="modal-body">
                    <div className="current-loc-label" >{`Locations in ${tour.name}`}</div>
                    {showLocation()}
                    <div className="available-loc-label">Available Locations</div>
                    <Location tourId={tourId} setParentDummy={setDummy} parentDummy={dummy} />
                </div>
            </div>
        </div>

    ) : ""
}

export default LocationMg