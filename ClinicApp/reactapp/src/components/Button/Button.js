import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { Add, Autorenew, Edit, Delete, Save, Print, Visibility, Search } from '@material-ui/icons';
import { FormControl } from '@material-ui/core';

const styledBy = (property, mapping) => props => mapping[props[property]];

const CustomButton = withStyles({
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
        textTransform: 'uppercase',
        width: 'auto',
    },
})(({ classes, color, ...other }) => <Button className={classes.root} {...other} />);

const Icon = props => {
    const { name } = props;
    switch (name) {
        case 'add':
            return <Add style={{ marginRight: 'auto' }} />;
        case 'edit':
            return <Edit style={{ marginRight: 'auto' }} />;
        case 'delete':
            return <Delete style={{ marginRight: 'auto' }} />;
        case 'save':
            return <Save style={{ marginRight: 'auto' }} />;
        case 'print':
            return <Print style={{ marginRight: 'auto' }} />;
        case 'view':
            return <Visibility style={{ marginRight: 'auto' }} />
        case 'reset':
            return <Autorenew style={{ marginRight: 'auto' }} />
        case 'search':
            return <Search style={{ marginRight: 'auto' }} />;
        default:
            return <React.Fragment />
    }
}

const ButtonComponent = props => {
    const {
        id, style, color, children, variant,
        disabled, size, onClick, iconName,
        fullWidth, ...rest
    } = props;

    return (
        <FormControl
            margin="dense"
            fullWidth={fullWidth}
            style={style}
        >
            <CustomButton
                id={id}
                color={color}
                variant={variant}
                disabled={disabled}
                size={size}
                onClick={onClick}
                {...rest}
            >
                <Icon name={iconName} />
                {children}
            </CustomButton>
        </FormControl>
    );
}

ButtonComponent.propTypes = {
    id: PropTypes.string,
    iconName: PropTypes.string,
    color: PropTypes.string,
    children: PropTypes.string.isRequired,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    size: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
}

ButtonComponent.defaultProps = {
    id: '',
    iconName: '',
    color: 'primary',
    children: '',
    variant: 'contained',
    disabled: false,
    fullWidth: false,
    size: 'small',
    style: null,
    onClick: () => { },
}

export default ButtonComponent;
