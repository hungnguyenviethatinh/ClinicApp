import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {},
    item: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0
    },
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

const Menu = props => {
    const { menus, className, ...rest } = props;

    const classes = useStyles();

    return (
        <List
            {...rest}
            className={clsx(classes.root, className)}
        >
            {menus.map(menu => (
                <ListItem
                    className={classes.item}
                    disableGutters
                    key={menu.title}
                >
                    <Button
                        activeClassName={classes.active}
                        className={classes.button}
                        component={CustomRouterLink}
                        to={menu.href}
                    >
                        <div className={classes.icon}>{menu.icon}</div>
                        {menu.title}
                    </Button>
                </ListItem>
            ))}
        </List>
    );
};

Menu.propTypes = {
    className: PropTypes.string,
    menus: PropTypes.array.isRequired
};

export default Menu;
