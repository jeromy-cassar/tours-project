import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import { readTours, editTour, deleteTour } from '../API/tourAPI'
import './Tour.scss'
import CreateTour from './CreateTour'
import LocationMg from './LocationMg'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const Tour = () => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [tours, setTours] = useState([]);
    const [tour, setTour] = useState({});
    const [id, setId] = useState();
    const [opened, setOpened] = useState(false);
    const [alertOpened, setAlertOpened] = useState(false);
    const [locMgOpened, setLocMgOpened] = useState(false);

    const [error, setError] = useState();
    const [dummy, setDummy] = useState(1);
    const [role, setRole] = useState(jwt.user.role);

    useEffect(() => {
        console.log("how many")
        readTours({ token }).then(data => {
            console.log("fuck the dat : ", data)
            setTours(data)
            // if (data.error) {
            //     setError(data.error);
            // } else {
            //     console.log("what data : ", data)
            //     setTours(data)
            // }
        });
    }, [dummy])

    // const handleClick = (e) => {
    //     // document.querySelector('.location-list')
    //     var tourRow = e.target.closest('.tour-row')
    //     var plusMinus = tourRow.querySelector('.plus-minus')
    //     var locationList = tourRow.querySelector('.location-list')
    //     console.log("whatsi loaitlsit : ", locationList)
    //     var classList = locationList.classList

    //     if (classList.contains('location-list-active')) {
    //         plusMinus.classList.remove('plus-minus-active')
    //         locationList.classList.remove('location-list-active')
    //     } else {
    //         plusMinus.classList.add('plus-minus-active')
    //         locationList.classList.add('location-list-active')
    //     }
    //     // locationList.classList
    // }


    const handleDelete = () => {
        deleteTour({ token, id }).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                setDummy(dummy + 1)
                setAlertOpened(false)
            }
        })
    }

    const handleEdit = () => {
        editTour({ token, id: tour._id, tour }).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                setDummy(dummy + 1)
                setOpened(false)
            }
        })
    }

    const openLocations = () => {

    }

    const showTour = () => {
        return (
            <div>
                <div className="tours-label">
                    Tours!
                </div>
                <TableContainer component={Paper}>
                    <Table className={""} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Description</TableCell>
                                <TableCell align="left">Duration</TableCell>
                                <TableCell align="left">locations</TableCell>
                                {role === 1 &&
                                    <TableCell align="left">Actions</TableCell>
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tours.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left">{row.type}</TableCell>
                                    <TableCell align="left">{row.description}</TableCell>
                                    <TableCell align="left">{row.min_duration}</TableCell>
                                    <TableCell align="left"><i class="fas fa-list cursor-pointer" onClick={() => { setTour(row); setLocMgOpened(true) }}></i></TableCell>
                                    {role === 1 &&
                                        <TableCell align="left">
                                            <button className="button-blue mx-1" onClick={() => { setOpened(true); setTour(row) }}>edit</button>
                                            <button className="button-red mx-1" onClick={() => { setAlertOpened(true); setId(row._id) }}>delete</button>
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
        setTour({ ...tour, [name]: value });
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
            <div className="modal-background row  justify-content-center align-items-center" onClick={clickAway}>
                <div className="modal-container my-modal">
                    <div className="modal-header">{`Editing ${tour.name}...`}</div>
                    <div className="modal-body">
                        {showError()}
                        <div>Name : <input value={tour.name} onChange={handleChange("name")} /></div>
                        <div>Type : <input value={tour.type} onChange={handleChange("type")} /></div>
                        <button className="button-blue mx-1 submit-button" onClick={handleEdit} >Submit</button>
                    </div>
                </div>
            </div>
        ) : ""
    }


    const showAlert = (id) => {
        return alertOpened === true ? (
            <div className="modal-background row justify-content-center align-items-center" onClick={clickAway}>
                <div className="modal-container modal-container-for-remove">
                    <div className="modal-header">
                        Remove this tour?
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

    return (
        <Layout>
            <div className="tour-container px-2 py-2">
                {showTour()}
                <CreateTour rerender={setDummy} dummy />
                {showForm()}
                {showAlert()}
                <LocationMg setParentDummy={setDummy} parentDummy={dummy} tourId={tour._id} locations={tour.locations} locMgOpened={locMgOpened} setLocMgOpened={setLocMgOpened} />

            </div>
        </Layout>
    )
}

export default Tour