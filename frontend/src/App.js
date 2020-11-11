import React from 'react';
import './App.scss';
import './Responsive.css';
import Main from './core/Main';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import UserMg from './core/UserMg';
import LocationPage from './core/LocationPage';
import Tour from './core/Tour';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <PrivateRoute path="/dashboard/tours" exact component={Tour} />
        <PrivateRoute path="/dashboard/locations" exact component={LocationPage} />
        <AdminRoute path="/dashboard/users" exact component={UserMg} />
        
      </Switch>
    </BrowserRouter>
  );
}

export default App;
