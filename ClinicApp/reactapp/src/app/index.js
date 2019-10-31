import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './components/login';
import PrivateRoute from './routes';

const App = () => {
    return (
        <Router>
            <Switch>
                <Redirect exact from="/" to="/dashboard" />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <Route exact path="/login" component={Login} />
                <Redirect to="/dashboard" />
            </Switch>
        </Router>
    );
}

export default App;
