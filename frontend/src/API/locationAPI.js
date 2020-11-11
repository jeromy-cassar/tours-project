import { BASE_URL } from "../config";
const API = BASE_URL + '/api'

export const readLocations = ({ limit = 20, token }) => {
    return fetch(`${API}/locations?limit=${limit}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const deleteLocation = ({ token, id }) => {
    return fetch(`${API}/location/remove/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const editLocation = ({ token, location, id }) => {
    return fetch(`${API}/location/update/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(location)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const createLocation = ({ token, location}) => {
    return fetch(`${API}/location/create/`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(location)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const copyLocation = ({ token, locationId}) => {
    return fetch(`${API}/location/copy/`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({locationId})
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};