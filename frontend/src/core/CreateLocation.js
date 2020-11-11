import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import { readLocations, deleteLocation, editLocation, createLocation } from '../API/locationAPI'
import './Location.scss'



const CreateLocation = ({ rerender, dummy }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [location, setLocation] = useState({});
    const [opened, setOpened] = useState(false);
    const [alertOpened, setAlertOpened] = useState(false);
    const [error, setError] = useState();
    const [role, setRole] = useState(jwt.user.role);

    useEffect(() => {

    }, [])


    const handleChange = (name) => (e) => {
        var value = e.target.value
        setLocation({ ...location, [name]: value });
    }

    const clickAway = (e) => {
        var target = e.target.closest(".modal-container-create-location")
        console.log("target : ", target)
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
            <div className=" modal-background my-modal z-index-2 row justify-content-center align-items-center" onClick={clickAway}>
                <div className="modal-container-create-location modal-container z-index-2">
                    <div className="modal-header">
                        Create new location
                    </div>
                    <div className="modal-body ">
                        {showError()}
                        <div>Name : <input value={location.name} onChange={handleChange("name")} /></div>
                        <div>city : <input value={location.city} onChange={handleChange("city")} /></div>
                        <div>country : <input value={location.country} onChange={handleChange("country")} /></div>
                        <div>description : <input value={location.description} onChange={handleChange("description")} /></div>
                        <div>x_axis : <input value={location.x_axis} onChange={handleChange("x_axis")} /></div>
                        <div>y_axis : <input value={location.y_axis} onChange={handleChange("y_axis")} /></div>
                        <div>area_code : <input value={location.area_code} onChange={handleChange("area_code")} /></div>
                        <div>min : <input value={location.min} onChange={handleChange("min")} /></div>
                        <button className="button-blue mx-1 submit-button" onClick={handleCreate} >Submit</button>
                    </div>
                </div>
            </div>
        ) : ""
    }

    const handleCreate = () => {
        createLocation({ token, location }).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                rerender(dummy + 1)
                setOpened(false)
                setLocation({})
            }
        })
    }


    return (
        <div className="location-container px-2 py-2">
            <div className="create-loc-btn" onClick={() => { setOpened(true) }}>Create New Location</div>
            {showForm()}
        </div>
    )
}

export default CreateLocation