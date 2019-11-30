import React from 'react';
import { Redirect } from 'react-router-dom';

import Layout from '../../layout';

const PrivateRoute = ({
    component: Component,
    ...rest
}) => {
    const isAuthenticated = (true && localStorage.getItem('user'));
    return (
        <Layout {...rest} component={matchProps => (
            isAuthenticated ? <Component {...matchProps} /> : <Redirect to={{
                pathname: "/login",
                state: { from: matchProps.location }
            }} />
        )}/>
    );
}

export default PrivateRoute;
