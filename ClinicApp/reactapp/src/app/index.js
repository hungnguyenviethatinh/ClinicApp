import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './components/login';
import PrivateRoute from './routes';

const App = () => {
    return (
        <Router>
            <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <Route path="/login" component={Login} />
                <PrivateRoute path="*" component={Dashboard} />
            </Switch>
        </Router>
    );
}

export default App;
