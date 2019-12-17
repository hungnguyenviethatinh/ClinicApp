import React from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    AppBar,
    Button,
    Toolbar,
    // Badge, 
    Hidden,
    IconButton,
    Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
// import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import axios from 'axios';

import {
    ApiUrl,
    SetUserStatusUrl
} from '../../config';
import {
    RouteConstants,
    AccessTokenKey,
} from '../../constants';

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: 'none'
    },
    flexGrow: {
        flexGrow: 1
    },
    signOutButton: {
        marginLeft: theme.spacing(1),
        textTransform: 'none',
    },
    appTitle: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    signOutIcon: {
        marginLeft: 10,
    }
}));

const LogoutButton = withRouter((props) => {
    const { classes, history } = props;

    const handleLogout = () => {
        const url = ApiUrl + SetUserStatusUrl;

        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(AccessTokenKey)}`,
            },
            params: {
                active: false,
            },
        }).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Set User Status] - OK!');
                localStorage.removeItem(AccessTokenKey);
                history.push(RouteConstants.LoginView);
            }
        }).catch((reason) => {
            console.log('[Set User Status] ', reason);
            if (reason.response) {
                const { status } = reason.response;
                if (status === 401) {
                    localStorage.removeItem(AccessTokenKey);
                }
            }
        });
    };

    return (
        <Button color="inherit" variant="text" className={classes.signOutButton} onClick={handleLogout}>
            Đăng xuất
			<ExitToAppIcon className={classes.signOutIcon} />
        </Button>
    );
});

const Header = (props) => {
    const { className, onSidebarOpen, ...rest } = props;

    const classes = useStyles();

    // const [notifications, setNotifications] = React.useState([]);

    return (
        <AppBar
            {...rest}
            className={clsx(classes.root, className)}
        >
            <Toolbar>
                <Hidden mdDown>
                    <Typography component="h5" variant="h5" color="inherit" noWrap className={classes.appTitle}>
                        Hệ thống quản lý phòng khám Dr. Khoa Clinic
					</Typography>
                </Hidden>
                <div className={classes.flexGrow} />
                <Hidden mdDown>
                    {/* <IconButton color="inherit">
                        <Badge
                            badgeContent={notifications.length}
                            color="primary"
                            variant="dot"
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton> */}
                    <LogoutButton classes={classes} />
                </Hidden>
                <Hidden lgUp>
                    <IconButton
                        color="inherit"
                        onClick={onSidebarOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

Header.propTypes = {
    className: PropTypes.string,
    onSidebarOpen: PropTypes.func
};

export default Header;
