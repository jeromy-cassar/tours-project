import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import { createAccount } from '../API/userAPI'

const CreateAccount = ({ rerender, dummy }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [userInfo, setUserInfo] = useState({});
    const [opened, setOpened] = useState(false);

    const [error, setError] = useState();
    const [role, setRole] = useState(jwt.user.role);

    useEffect(() => {

    }, [])


    const handleChange = (name) => (e) => {
        var value = e.target.value
        setUserInfo({ ...userInfo, [name]: value });
    }

    const clickAway = (e) => {
        var target = e.target.closest(".modal-container")
        if (target) {

        } else {
            setOpened(false)
            // setAlertOpened(false)
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
                        Create new account
                    </div>
                    <div className="modal-body ">
                        {showError()}
                        <div>Name : <input value={userInfo.name} onChange={handleChange("name")} /></div>
                        <div>Email : <input value={userInfo.type} onChange={handleChange("email")} /></div>
                        <div>Role : <input value={userInfo.type} onChange={handleChange("role")} /></div>
                        <div>About : <input value={userInfo.type} onChange={handleChange("about")} /></div>
                        <div>Password : <input value={userInfo.type} type="password" onChange={handleChange("password")} /></div>
                        <button className="button-blue submit-button mx-1" onClick={handleCreate} >Submit</button>
                    </div>
                </div>
            </div>
        ) : ""
    }

    const handleCreate = () => {
        createAccount({ token, userInfo }).then((data) => {
            console.log("Data? : ", data.error)
            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                rerender(dummy + 1)
                setOpened(false)
                setUserInfo({})
            }
        })
    }


    return (
        <div className="tour-container px-2 py-2">
            <div className="create-btn" onClick={() => { setOpened(true) }}>Create account</div>
            {showForm()}
        </div>
    )
}

export default CreateAccount