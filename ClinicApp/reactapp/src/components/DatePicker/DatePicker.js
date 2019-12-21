import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import { KeyboardDatePicker } from "@material-ui/pickers";
import PropTypes from 'prop-types';

const styles = {
    picker: {
        // width: 200,
    }
};

const DatePickerComponent = props => {
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
        // minDate, 
        // maxDate, 
        // minDateMessage, 
        // maxDateMessage,
        ...rest
    } = props;

    return (
        <FormControl
            fullWidth={fullWidth}
            style={style}
        >
            <KeyboardDatePicker
                className={classes.picker}
                autoOk
                disableToolbar
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
                    "aria-label": `${id}_datepicker-label`
                }}
                invalidDateMessage="Ngày không hợp lệ"
                // minDate={minDate}
                minDateMessage="Ngày nhỏ hơn ngày tối thiểu"
                // maxDate={maxDate}
                maxDateMessage="Ngày lớn hơn ngày tối đa"
                {...rest}
            />
        </FormControl>
    );
};

DatePickerComponent.protoTypes = {
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
    // minDate: PropTypes.instanceOf(Date),
    // minDateMessage: PropTypes.string,
    // maxDate: PropTypes.instanceOf(Date),
    // maxDateMessage: PropTypes.string,
};

DatePickerComponent.defaultProps = {
    classes: null,
    format: 'DD-MM-YYYY',
    views: ['date', 'month', 'year'],
    id: '',
    label: '',
    value: '',
    onChange: () => { },
    style: null,
    variant: 'inline',
    fullWidth: false,
    // minDate: moment(),
    // minDateMessage: '',
    // maxDate: moment(),
    // maxDateMessage: '',
};

export default withStyles(styles)(DatePickerComponent);
