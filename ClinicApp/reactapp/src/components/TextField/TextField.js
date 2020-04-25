import React from 'react';
import {
    FormControl,
    TextField,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const styles = {
    root: { },
};

const TextFieldComponent = props => {
    const { 
        classes, className, autoFocus, error, fullWidth, helperText, style,
        id, label, name, onChange, required, readOnly, value, maxLength,
        placeholder, multiline, rows, onBlur, onKeyPress, margin,
    } = props;

    const [showPassword, setShowPassword] = React.useState(false);

    const [type, setType] = React.useState(props.type);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
        setType(type === 'password' ? 'text' : props.type)
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    return (
        <FormControl
            className={clsx(classes.root, className)}
            fullWidth={fullWidth}
            margin={margin}
            style={style}
        >
            <TextField
                variant="outlined"
                margin={margin}
                required={required}
                name={name}
                label={label}
                type={type}
                id={id}
                value={value}
                placeholder={placeholder}
                onBlur={onBlur}
                onChange={onChange}
                onKeyPress={onKeyPress}
                inputProps={{
                    maxLength,
                }}
                InputProps={{
                    endAdornment: (type === 'password' || showPassword) && (
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                aria-label="Toggle password visibility."
                                onClick={handleShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                    readOnly
                }}
                error={error}
                helperText={(error) ? helperText : ''}
                autoFocus={autoFocus}
                className={classes.root}
                multiline={multiline}
                rows={rows}
            />
        </FormControl>
    );
};

TextFieldComponent.propTypes = {
    autoFocus: PropTypes.bool,
    classes: PropTypes.object,
    className: PropTypes.string,
    error: PropTypes.bool,
    fullWidth: PropTypes.bool,
    helperText: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyPress: PropTypes.func,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.any,
    maxLength: PropTypes.number,
    style: PropTypes.object,
    placeholder: PropTypes.string,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
};

TextFieldComponent.defaultProps = {
    autoFocus: false,
    classes: null,
    error: false,
    fullWidth: false,
    helperText: '',
    id: '',
    label: '',
    name: '',
    onChange: () => { },
    onBlur: () => { },
    onKeyPress: () => { },
    required: false,
    readOnly: false,
    type: 'text',
    value: '',
    maxLength: 100,
    style: null,
    placeholder: '',
    multiline: false,
    rows: 0,
    margin: 'dense',
};

export default withStyles(styles)(TextFieldComponent);
