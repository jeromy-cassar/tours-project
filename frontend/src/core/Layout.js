import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import './Layout.scss';

const Layout = ({
    children,
    className = "",
    keywordIn = "",
    history
}) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));

    const [redirect, setRedirect] = useState(false)
    const [role, setRole] = useState(jwt && jwt.user.role);
    const [userName, setUserName] = useState(jwt && jwt.user.name);

    const handleSignout = () => {
        localStorage.removeItem("jwt");
        // can not get history object becuz layout is not a route
        // history.push('/')
        setRedirect(true)
    }

    return (
        <div className="row overflow-hidden my-nav-bar">
            {redirect && <Redirect to={'/'} />}
            <div className="sidenav-container col-2">
                <Link to={'/dashboard/tours'}><div>Tours</div></Link>
                <Link to={'/dashboard/locations'}><div>Locations</div></Link>
                {role === 1 && <Link to={'/dashboard/users'}><div>Users</div></Link>}
            </div>
            <div className="head-nav row col-10 align-items-center justify-content-end pr-5">
                <div className="mr-1">
                    {role === 0 && <img src="../img/assistant.png" alt="image" />}
                    {role === 1 && <img src="../img/user.png" alt="image" />}
                </div>
                <div className="mr-3 user-name">
                    Hi {userName}!
                </div>

                <div onClick={handleSignout} className="pointer signout-btn">Sign out</div>

            </div>
            <div className="children-container col-10  mt-2">

                {children}
            </div>
            {/* <Route {...rest} component={component} />: <Redirect to={'/'}/> */}
        </div>
    )
}

export default Layout