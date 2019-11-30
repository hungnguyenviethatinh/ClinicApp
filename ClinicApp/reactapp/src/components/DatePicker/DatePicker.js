import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import { KeyboardDatePicker } from "@material-ui/pickers";
import PropTypes from 'prop-types';

const styles = {
    picker: {
        width: 200,
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
        // minDate, 
        // maxDate, 
        // minDateMessage, 
        // maxDateMessage 
    } = props;

    return (
        <FormControl style={style}>
            <KeyboardDatePicker
                className={classes.picker}
                autoOk
                disableToolbar
                variant="inline"
                format={format}
                margin="dense"
                views={views}
                id={id}
                inputVariant="outlined"
                label={label}
                value={value}
                onChange={onChange}
                KeyboardButtonProps={{
                    "aria-label": `${id}-label`
                }}
                // minDate={minDate}
                // minDateMessage={minDateMessage}
                // maxDate={maxDate}
                // maxDateMessage={maxDateMessage}
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
    // minDate: moment(),
    // minDateMessage: '',
    // maxDate: moment(),
    // maxDateMessage: '',
};

export default withStyles(styles)(DatePickerComponent);
