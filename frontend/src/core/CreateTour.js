import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import { createTour } from '../API/tourAPI'
import './Tour.scss'

const CreateTour = ({ rerender, dummy }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [tour, setTour] = useState({});
    const [opened, setOpened] = useState(false);
    const [alertOpened, setAlertOpened] = useState(false);
    const [error, setError] = useState();
    const [role, setRole] = useState(jwt.user.role);

    useEffect(() => {

    }, [])


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
            <div className="modal-background my-modal row justify-content-center align-items-center" onClick={clickAway}>
                <div className="modal-container">
                    <div className="modal-header">
                        Create new tour
                    </div>
                    <div className="modal-body ">
                        {showError()}
                        <div>Name : <input value={tour.name} onChange={handleChange("name")} /></div>
                        <div>Type : <input value={tour.type} onChange={handleChange("type")} /></div>
                        <button className="button-blue submit-button mx-1" onClick={handleCreate} >Submit</button>
                    </div>
                </div>
            </div>
        ) : ""
    }

    const handleCreate = () => {
        createTour({ token, tour }).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                rerender(dummy + 1)
                setOpened(false)
                setTour({})
            }
        })
    }


    return (
        <div className="tour-container px-2 py-2">
            <div className="create-btn" onClick={() => { setOpened(true) }}>Create New Tour</div>
            {showForm()}
        </div>
    )
}

export default CreateTour