import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import PropTypes from 'prop-types';

const styles = {
    picker: {}
};

const DateTimePickerComponent = props => {
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
        disablePast,
        disabled,
        ...rest
    } = props;

    return (
        <FormControl
            fullWidth={fullWidth}
            style={style}
        >
            <KeyboardDateTimePicker
                disabled={disabled}
                className={classes.picker}
                autoOk
                disableToolbar
                disablePast={disablePast}
                ampm={false}
                variant={variant}
                format={format}
                margin="dense"
                id={id}
                inputVariant="outlined"
                label={label}
                value={value}
                onChange={onChange}
                KeyboardButtonProps={{
                    "aria-label": `${id}_datetimepicker-label`
                }}
                invalidDateMessage="Ngày giờ không hợp lệ"
                minDateMessage="Ngày nhỏ hơn ngày tối thiểu"
                maxDateMessage="Ngày lớn hơn ngày tối đa"
                {...rest}
            />
        </FormControl>
    );
};

DateTimePickerComponent.protoTypes = {
    classes: PropTypes.object,
    format: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    variant: PropTypes.oneOf(['dialog', 'inline', 'static']),
    fullWidth: PropTypes.bool,
    disablePast: PropTypes.bool,
};

DateTimePickerComponent.defaultProps = {
    classes: null,
    format: 'DD-MM-YYYY HH:mm',
    id: '',
    label: '',
    value: '',
    onChange: () => { },
    style: null,
    variant: 'inline',
    fullWidth: false,
    disablePast: false,
    disabled: false,
};

export default withStyles(styles)(DateTimePickerComponent);
