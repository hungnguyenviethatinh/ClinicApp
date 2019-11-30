import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Add, Edit, Delete } from '@material-ui/icons';
import { Fab } from '@material-ui/core';

const styledBy = (property, mapping) => props => mapping[props[property]];

const CustomFab = withStyles({
    root: {
        background: styledBy('color', {
            primary: '#007bff',
            secondary: '#6c757d',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8',
            light: '#f8f9fa',
            dark: '#343a40',
            white: '#fff',
            tranparent: 'transparent'
        }),
        color: 'white',
    },
})(({ classes, color, ...other }) => <Fab className={classes.root} {...other} />);

const Icon = props => {
    const { name } = props;
    switch (name) {
        case 'add':
            return <Add />;
        case 'edit':
            return <Edit />;
        case 'delete':
            return <Delete />;
        default:
            return <React.Fragment />
    }
}

const FabComponent = props => {
    const {
        color, 
        variant,
        disabled, 
        size, 
        onClick, 
        iconName,
        ...rest
    } = props;

    return (
        <CustomFab
            color={color}
            variant={variant}
            disabled={disabled}
            size={size}
            onClick={onClick}
            {...rest}
        >
            <Icon name={iconName} />
        </CustomFab>
    );
}

FabComponent.propTypes = {
    iconName: PropTypes.string,
    color: PropTypes.string,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    onClick: PropTypes.func,
}

FabComponent.defaultProps = {
    iconName: '',
    color: 'primary',
    variant: 'round',
    disabled: false,
    size: 'small',
    onClick: () => { },
}

export default FabComponent;
