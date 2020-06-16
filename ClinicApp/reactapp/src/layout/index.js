import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';


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
    children: {
        'flex-grow': 1,
        padding: theme.spacing(4),
    },
}));

const Layout = props => {
    const { component: Component, ...rest } = props;

    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
        defaultMatches: true
    });

    const [openSidebar, setOpenSidebar] = useState(isDesktop);
    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };
    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };
    const handleToggleSidebar = () => {
        setOpenSidebar(!openSidebar);
    };

    return (
        <Route {...rest} render={matchProps => (
            <div
                className={clsx({
                    [classes.root]: true,
                    [classes.shiftContent]: isDesktop && openSidebar,
                })}
            >
                <Header onSidebarOpen={handleSidebarOpen} onToggleSidebar={handleToggleSidebar} />
                <Sidebar
                    onClose={handleSidebarClose}
                    open={openSidebar}
                    variant={isDesktop ? 'persistent' : 'temporary'}
                />
                <main className={classes.content}>
                    <div className={classes.children} >
                        <Component {...matchProps} />
                    </div>
                    <Footer />
                </main>
            </div>
        )} />
    );
}

export default Layout;
