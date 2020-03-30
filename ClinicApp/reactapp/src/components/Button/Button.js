import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { 
    Add, 
    Autorenew, 
    Edit, 
    Delete, 
    Done, 
    Save, 
    Print, 
    Visibility,
    Search, 
    Cancel,
    BorderColor,
    FileCopy } from '@material-ui/icons';
import { CircularProgress, FormControl } from '@material-ui/core';

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
            return <Add style={{ marginRight: 16 }} />;
        case 'edit':
            return <Edit style={{ marginRight: 16 }} />;
        case 'delete':
            return <Delete style={{ marginRight: 16 }} />;
        case 'save':
            return <Save style={{ marginRight: 16 }} />;
        case 'print':
            return <Print style={{ marginRight: 16 }} />;
        case 'view':
            return <Visibility style={{ marginRight: 16 }} />
        case 'reset':
            return <Autorenew style={{ marginRight: 16 }} />
        case 'search':
            return <Search style={{ marginRight: 16 }} />;
        case 'done':
            return <Done style={{ marginRight: 16 }} />;
        case 'cancel':
            return <Cancel style={{ marginRight: 16 }} />;
        case 'pen':
            return <BorderColor style={{ marginRight: 16 }} />;
        case 'copy':
            return <FileCopy style={{ marginRight: 16 }} />;
        default:
            return <React.Fragment />
    }
}

const ButtonComponent = props => {
    const {
        id, style, color, children, variant,
        disabled, size, onClick, iconName,
        fullWidth, loading, ...rest
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
                { loading && <CircularProgress size={20} style={{ position: 'absolute', color: 'white' }} /> }
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
    loading: PropTypes.bool,
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
    loading: false,
    fullWidth: false,
    size: 'small',
    style: null,
    onClick: () => { },
}

export default ButtonComponent;
