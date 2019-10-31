import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import DashboardView from './components/dashboard';
import LoginView from './components/login';
import UserView from './components/user';
import DoctorView from './components/doctor';
import StoreView from './components/store';
import StatisticView from './components/statistic';
import ClientView from './components/client';
import PatientView from './components/patient';
import InvoiceView from './components/invoice';

import PrivateRoute from './routes';

const App = () => {
    return (
        <Router>
            <Switch>
                <Redirect exact from="/" to="/dashboard" />
                <PrivateRoute exact path="/dashboard" component={DashboardView} />
                <PrivateRoute exact path="/user" component={UserView} />
                <PrivateRoute exact path="/store" component={StoreView} />
                <PrivateRoute exact path="/statistic" component={StatisticView} />
                <PrivateRoute exact path="/client" component={ClientView} />
                <PrivateRoute exact path="/patient" component={PatientView} />
                <PrivateRoute exact path="/invoice" component={InvoiceView} />
                <PrivateRoute exact path="/doctor" component={DoctorView} />
                <Route exact path="/login" component={LoginView} />
                <Redirect to="/dashboard" />
            </Switch>
        </Router>
    );
}

export default App;
