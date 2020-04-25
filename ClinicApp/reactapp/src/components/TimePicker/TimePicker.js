import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import { KeyboardTimePicker } from "@material-ui/pickers";
import PropTypes from 'prop-types';

const styles = {
    picker: {}
};

const TimePickerComponent = props => {
    const {
        classes,
        format,
        views,
        id,
        label,
        value,
        onChange,
        style,
        variant,
        fullWidth,
        disabled,
        ...rest
    } = props;

    return (
        <FormControl
            fullWidth={fullWidth}
            style={style}
        >
            <KeyboardTimePicker
                className={classes.picker}
                autoOk
                disableToolbar
                disabled={disabled}
                ampm={false}
                variant={variant}
                format={format}
                margin="dense"
                views={views}
                id={id}
                inputVariant="outlined"
                label={label}
                value={value}
                onChange={onChange}
                KeyboardButtonProps={{
                    "aria-label": `${id}_timepicker-label`
                }}
                {...rest}
            />
        </FormControl>
    );
};

TimePickerComponent.protoTypes = {
    classes: PropTypes.object,
    format: PropTypes.string,
    views: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    variant: PropTypes.oneOf(['dialog', 'inline', 'static']),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
};

TimePickerComponent.defaultProps = {
    classes: null,
    format: 'HH:mm',
    views: ['hours', 'minutes'],
    id: '',
    label: '',
    value: '',
    onChange: () => { },
    style: null,
    variant: 'inline',
    fullWidth: false,
    disabled: false,
};

export default withStyles(styles)(TimePickerComponent);
