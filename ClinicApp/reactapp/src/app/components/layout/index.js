import React from 'react';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },

    appBarSpacer: theme.mixins.toolbar,

    content: {
        display: 'flex',
        'flex-direction': 'column',
        flex: 1,
        height: '100vh',
        overflow: 'auto',
    },

    container: {
        display: 'flex',
        'flex-grow': 1,
        padding: theme.spacing(3),
    },

}));

const Layout = ({
    component: Component,
    ...rest
}) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(true);
    const toggleSidebar = () => {
        setOpen(!open);
    };

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const changeCurrentIndex = (index) => {
        setCurrentIndex(index);
    };

    return (
        <Route {...rest} render={props => (
            <div className={classes.root}>
                <CssBaseline />
                <Header toggleSidebar={toggleSidebar} />
                <Sidebar open={open} currentIndex={currentIndex} changeCurrentIndex={changeCurrentIndex}/>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <div className={classes.container}>
                        <Component {...props} />
                    </div>
                    <Footer />
                </main>
            </div>
        )} />
    );
}

export default Layout;
