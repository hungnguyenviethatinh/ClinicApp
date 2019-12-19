import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const a11yProps = (index) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

const TabComponent = (props) => {
    const classes = useStyles();

    const {
        value,
        names,
        handleChange,
        children,
        ...rest
    } = props;

    return (
        <div className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="tabs"
                {...rest}
            >
                {names.map((name, index) => <Tab key={index} label={name} {...a11yProps(index)} />)}
            </Tabs>
            {children}
        </div>
    );
};

TabComponent.propTypes = {
    value: PropTypes.number,
    handleChange: PropTypes.func,
    names: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node,
};

export default TabComponent;
