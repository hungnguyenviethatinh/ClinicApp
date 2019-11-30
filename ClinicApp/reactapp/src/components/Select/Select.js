import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl, TextField, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = {
    root: { },
    textField: {
        width: '100%',
    },
    menu: {
        width: '100%',
    },
};

const SelectComponent = props => {
    const {
        classes, className, id, label, value, onChange,
        options, autoFocus, fullWidth, required, style,
    } = props;

    return (
        <FormControl
            fullWidth={fullWidth}
            margin="dense"
            className={clsx(classes.root, className)}
            style={style}
        >
            <TextField
                id={id}
                select
                label={label}
                className={clsx(classes.root, classes.textField)}
                value={value}
                onChange={onChange}
                SelectProps={{
                    MenuProps: {
                        className: classes.menu,
                    },
                }}
                margin="dense"
                variant="outlined"
                autoFocus={autoFocus}
                required={required}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </FormControl>
    );
}

SelectComponent.propTypes = {
    fullWidth: PropTypes.bool,
    classes: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
    })),
    autoFocus: PropTypes.bool,
    style: PropTypes.object,
    required: PropTypes.bool,
}

SelectComponent.defaultProps = {
    fullWidth: false,
    classes: null,
    style: null,
    id: '',
    label: '',
    value: '',
    onChange: () => { },
    options: [{}],
    autoFocus: false,
    style: null,
    required: false,
}

export default withStyles(styles)(SelectComponent);
