import React from 'react';
import { Redirect } from 'react-router-dom';

import Layout from '../../layout';
import { verifyJWT } from '../../common';

const PrivateRoute = ({
    component: Component,
    ...rest
}) => {
    const token = localStorage.getItem('access_token');
    const isAuthenticated = verifyJWT(token);
    
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
