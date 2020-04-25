import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import { KeyboardDatePicker } from "@material-ui/pickers";
import PropTypes from 'prop-types';

const styles = {
    picker: {}
};

const DatePickerComponent = props => {
    const {
        classes,
        format,
        id,
        label,
        value,
        onChange,
        style,
        variant,
        fullWidth,
        margin,
        disabled,
        ...rest
    } = props;

    return (
        <FormControl
            fullWidth={fullWidth}
            style={style}
            margin={margin}
        >
            <KeyboardDatePicker
                disabled={disabled}
                className={classes.picker}
                autoOk
                disableToolbar
                variant={variant}
                format={format}
                margin="dense"
                id={id}
                inputVariant="outlined"
                label={label}
                value={value}
                onChange={onChange}
                KeyboardButtonProps={{
                    "aria-label": `${id}_datepicker-label`
                }}
                invalidDateMessage="Ngày không hợp lệ"
                minDateMessage="Ngày nhỏ hơn ngày tối thiểu"
                maxDateMessage="Ngày lớn hơn ngày tối đa"
                {...rest}
            />
        </FormControl>
    );
};

DatePickerComponent.protoTypes = {
    classes: PropTypes.object,
    format: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    variant: PropTypes.oneOf(['dialog', 'inline', 'static']),
    fullWidth: PropTypes.bool,
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    disabled: PropTypes.bool,
};

DatePickerComponent.defaultProps = {
    classes: null,
    format: 'DD-MM-YYYY',
    id: '',
    label: '',
    value: '',
    onChange: () => { },
    style: null,
    variant: 'inline',
    fullWidth: false,
    margin: 'none',
    disabled: false,
};

export default withStyles(styles)(DatePickerComponent);
