import React from 'react';
import { Route } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';

const Layout = ({
    component: Component,
    ...rest
}) => {
    return (
        <Route {...rest} render={props => (
            <React.Fragment>
                <Header />
                <Sidebar />
                <main>
                    <Component {...props} />
                    <Footer />
                </main>
            </React.Fragment>
        )} />
    );
}

export default Layout;
