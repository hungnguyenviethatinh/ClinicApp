import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';


const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: 56,
        height: '100%',
        [theme.breakpoints.up('sm')]: {
            paddingTop: 64
        }
    },
    shiftContent: {
        paddingLeft: 240
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
    },
    childComponent: {
        'flex-grow': 1,
        padding: theme.spacing(3),
    },
}));

const Layout = props => {
    const { component: Component, ...rest } = props;

    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
        defaultMatches: true
    });

    const [openSidebar, setOpenSidebar] = useState(false);

    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    const shouldOpenSidebar = isDesktop ? true : openSidebar;

    return (
        <Route {...rest} render={matchProps => (
            <div
                className={clsx({
                    [classes.root]: true,
                    [classes.shiftContent]: isDesktop
                })}
            >
                <Header onSidebarOpen={handleSidebarOpen} />
                <Sidebar
                    onClose={handleSidebarClose}
                    open={shouldOpenSidebar}
                    variant={isDesktop ? 'persistent' : 'temporary'}
                />
                <main className={classes.content}>
                    <div className={classes.childComponent} >
                        <Component {...matchProps} />
                    </div>
                    <Footer />
                </main>
            </div>
        )} />
    );
}

Layout.propTypes = {
    component: PropTypes.node
};

export default Layout;
