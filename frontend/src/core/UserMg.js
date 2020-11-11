import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./Layout";
import Location from "./Location";
import CreateAccount from "./CreateAccount";
import { getUsers, deactivateAccount, reactivateAccount } from '../API/userAPI'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const Dashboard = ({
    children,
    className = "",
    keywordIn = ""
}) => {
    var jwt = JSON.parse(localStorage.getItem("jwt"));
    var token = jwt.token;

    const [users, setUsers] = useState([])
    const [error, setError] = useState()
    const [role, setRole] = useState(jwt.user.role);
    const [dummy, setDummy] = useState(0);



    useEffect(() => {
        console.log("before requesiton")
        getUsers({ token }).then(data => {
            console.log("got  requesiton : ", data)

            if (data.error) {
                setError(data.error);
            } else {
                console.log("what data : ", data)
                setUsers(data);
            }
        });
    }, [dummy])

    const handleDeactivateAccount = (userId) => (e) => {
        deactivateAccount({ token, userId }).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                setDummy(dummy + 1)
            }
        }
        )
    }

    const HandleReactivateAccount = (userId) => (e) => {
        reactivateAccount({ token, userId }).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                setDummy(dummy + 1)
            }
        }
        )
    }

    const showUsers = () => {
        return (
            <div>
                <div className="tours-label">
                    Users!
                </div>
                <TableContainer component={Paper}>
                    <Table className={""} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Role</TableCell>
                                <TableCell align="left">About</TableCell>
                                <TableCell align="left">Activated</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((row, index) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {index}
                                    </TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
                                    <TableCell align="left">{row.role}</TableCell>
                                    <TableCell align="left">{row.about}</TableCell>
                                    <TableCell align="left">{row.activated == 1 ? "True" : "False"}</TableCell>
                                    <TableCell align="left">
                                        {row.activated == 1 ?
                                            <button className="button-red mx-1" onClick={handleDeactivateAccount(row._id)}>Deactivate</button>
                                            :
                                            <button className="button-blue mx-1" onClick={HandleReactivateAccount(row._id)}>Reactivate</button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }

    return (
        <Layout>
            {showUsers()}
            <CreateAccount rerender={setDummy} dummy={dummy} />
        </Layout>
    )
}

export default Dashboard