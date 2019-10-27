import React from 'react';
import Layout from '../components/layout';
import { Redirect } from 'react-router-dom';
import { AuthService } from '../services';

const PrivateRoute = ({
    component: Component,
    ...rest
}) => {
    return (
        <Layout {...rest} component={props => (
            AuthService.IsAuthenticated() ? <Component {...props} /> : <Redirect to={{
                pathname: "/login",
                state: { from: props.location }
            }} />
        )}/>
    );
}

export default PrivateRoute;
