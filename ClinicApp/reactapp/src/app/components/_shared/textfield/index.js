import React from 'react';
import {
    FormControl,
    TextField,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
    
};

const TextFieldComponent = props => {
    const { autoFocus, classes, error, fullWidth, helperText, id, label, name, onChange, required, style, value } = props;

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
            className={classes.formControl}
            style={style}
            fullWidth={fullWidth}   
            margin="dense"
        >
            <TextField
                variant="outlined"
                margin="dense"
                required={required}
                name={name}
                label={label}
                type={type}
                id={id}
                value={value}
                onChange={onChange}
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
                }}
                error={error}
                helperText={(error) ? helperText : ''}
                autoFocus={autoFocus}
            />
        </FormControl>
    );
};

TextFieldComponent.propTypes = {
    autoFocus: PropTypes.bool,
    classes: PropTypes.object,
    error: PropTypes.bool,
    fullWidth: PropTypes.bool,
    helperText: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    name : PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    style: PropTypes.object,
    type: PropTypes.string,
    value: PropTypes.string,
};

TextFieldComponent.defaultProps = {
    autoFocus: false,
    classes: null,
    error: false,
    fullWidth: false,
    helperText: '',
    id: '',
    label: '',
    name : '',
    onChange: () => { console.log('Text field value changed!'); },
    required: false,
    style: null,
    type: 'text',
    value: '',
};

export default withStyles(styles)(TextFieldComponent);
