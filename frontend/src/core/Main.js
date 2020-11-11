import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './Main.scss'
import { signin, authenticate } from '../API/userAPI'
import Loader from './Loader'
// import { Parallax, Background } from 'react-parallax';
import Parallax from 'parallax-js' // Now published on NPM

const Main = ({ history }) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    if (jwt && jwt.token) {
        history.push('/dashboard/locations')
    }

    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
    })
    const { email, password, loading, error } = values;

    useEffect(() => {
        var parallax = new Parallax(document.getElementById('scene'))
    }, [])

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        signin({ email, password }).then(
            data => {
                console.log("data : ", data)
                if (data.error) {
                    setValues({ ...values, error: data.error })
                }
                else {
                    authenticate(data, () => {
                        history.push('/dashboard/locations')
                    });
                }
            })
    }

    const showError = () => {

    }


    const ValidateEmail = (mail) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            if (ValidateEmail(email)) {
                handleSubmit(e)
            } else {
                setValues({ ...values, error: true })
            }
        }
    }

    const isFilled = () => {
        if (email !== '') {
            return 'label label-active'
        } else {
            return 'label'
        }
    }

    const showForm = () => {
        return (
            <form onKeyDown={handleEnter} className="signin-form">
                <div class="signin-header">
                    <div class="row justify-content-center mr-3">
                        <img src="img/user.png" className="user-icon" />
                    </div>
                    <h3 class="" id="" ><strong>Sign in</strong></h3>
                </div>
                <div class="signin-body">

                    <div class="md-form ">
                        <input type="email" id="Form-email1" class="form-control " onChange={handleChange('email')} />
                        <label data-error="wrong" className={isFilled()} for="Form-email1">Your email</label>
                    </div>

                    <div class="md-form ">
                        <input type="password" id="Form-pass1" class="form-control " onChange={handleChange('password')} />
                        <label className={isFilled()} data-error="wrong" for="Form-pass1">Your password</label>
                    </div>
                    {error && (<div className="position-absolute showError ">{error}</div>)}
                    <div class="row justify-content-center mr-3 mt-5">
                        <button type="button" class="signin-button" onClick={handleSubmit}>Sign in</button>
                    </div>
                </div>
            </form>
        )
    }

    return (
        <div className="main-container row align-items-center justify-content-end">
            <div className="signin-container">
                {showForm()}
            </div>


            <ul id="scene">
                {/* <li class="layer arereal" data-depth="0.7"><img src="img/arereal.png" alt="image" /></li> */}
                <li class="layer polygons" data-depth="0.15"><img src="img/main/polygons.png" alt="image" /></li>
                <li class="layer filledpolygon" data-depth="0.09"><img src="img/main/filledpolygon.png" alt="image" /></li>
                <li class="layer tour" data-depth="-0.34"><img src="img/main/userfriendly.png" alt="a" /></li>
                <li class="layer unicorn" data-depth="0.09"><img src="img/main/business.png" alt="image" /></li>
                <li class="layer ease" data-depth="-0.1"><img src="img/main/easeofuse.png" alt="image" /></li>
                <li class="layer smart" data-depth="-0.05"><img src="img/main/efficiency.png" alt="image" /></li>
                <li class="layer tour" data-depth="-0.11"><img src="img/main/inspiration.png" alt="a" /></li>
                <li class="layer tour" data-depth="-0.14"><img src="img/main/locations.png" alt="a" /></li>
                <li class="layer tour" data-depth="-0.04"><img src="img/main/management.png" alt="a" /></li>
                <li class="layer tour" data-depth="0.34"><img src="img/main/plan.png" alt="a" /></li>
                <li class="layer tour" data-depth="0.14"><img src="img/main/schedule.png" alt="a" /></li>
                <li class="layer tour" data-depth="-0.24"><img src="img/main/smarttour.png" alt="a" /></li>
                <li class="layer tour" data-depth="0.24"><img src="img/main/travel.png" alt="a" /></li>
            </ul>
            <Loader loading={loading} />
        </div>
    )
}

export default Main