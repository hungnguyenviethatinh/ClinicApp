import React from 'react';
import Layout from '../components/layout';
import { Redirect } from 'react-router-dom';

const PrivateRoute = ({
    component: Component,
    ...rest
}) => {
    return (
        <Layout {...rest} component={props => (
            false ? <Component {...props} /> : <Redirect to="/login" />
        )}/>
    );
}

export default PrivateRoute;
