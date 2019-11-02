import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, colors } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {},
    button: {
        color: colors.blueGrey[800],
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%',
        fontWeight: theme.typography.fontWeightMedium
    },
    icon: {
        color: theme.palette.icon,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(1)
    },
    active: {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        '& $icon': {
            color: theme.palette.primary.main
        }
    }
}));

const CustomRouterLink = forwardRef((props, ref) => (
    <div
        ref={ref}
        style={{ flexGrow: 1 }}
    >
        <RouterLink {...props} />
    </div>
));

const RouterLinkButton = props => {
    const { title, href, icon, className } = props;

    const classes = useStyles();

    return (
        <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={href}
        >
            <div className={classes.icon}>{icon}</div>
            {title}
        </Button>
    );
};

RouterLinkButton.propTypes = {
    className: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.node,
    title: PropTypes.string,
};

export default RouterLinkButton;
