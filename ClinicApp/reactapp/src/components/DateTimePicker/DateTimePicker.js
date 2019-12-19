import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import PropTypes from 'prop-types';

const styles = {
    picker: {
        // width: 200,
    }
};

const DateTimePickerComponent = props => {
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
            <KeyboardDateTimePicker
                className={classes.picker}
                autoOk
                disableToolbar
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
                    "aria-label": `${id}_datetimepicker-label`
                }}
                invalidDateMessage="Ngày giờ không hợp lệ"
                // minDate={minDate}
                // minDateMessage={minDateMessage}
                // maxDate={maxDate}
                // maxDateMessage={maxDateMessage}
                {...rest}
            />
        </FormControl>
    );
};

DateTimePickerComponent.protoTypes = {
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

DateTimePickerComponent.defaultProps = {
    classes: null,
    format: 'DD-MM-YYYY HH:mm',
    views: ['date', 'month', 'year', 'hours', 'minutes'],
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

export default withStyles(styles)(DateTimePickerComponent);
