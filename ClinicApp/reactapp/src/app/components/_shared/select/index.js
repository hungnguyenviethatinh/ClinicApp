import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl, TextField, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = {
    textField: {
        width: 200,
    },
    menu: {
        width: '100%',
    },
};

const SelectComponent = props => {
    const { classes, id, label, value, onChange, options, autoFocus, style, fullWidth } = props;

    return(
        <FormControl
            fullWidth={fullWidth}   
            margin="dense"
            style={style}>
            <TextField
                id={id}
                select
                label={label}
                className={classes.textField}
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
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
    })),
    autoFocus: PropTypes.bool,
    style: PropTypes.object,
}

SelectComponent.defaultProps = {
    fullWidth: false,
    classes: null,
    id: '',
    label: '',
    value: '',
    onChange: () => { console.log('Select changed!'); },
    options: [{}],
    autoFocus: false,
    style: null,
}

export default withStyles(styles)(SelectComponent);
