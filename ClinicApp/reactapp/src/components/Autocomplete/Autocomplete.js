import React from 'react';
import { FormControl, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = {
    root: { },
};

const AutocompleteComponent = props => {

    const { 
        classes, 
        className, 
        id, 
        label, 
        value, 
        fullWidth, 
        options, 
        onChange,
        getOptionLabel,
        ...rest
    } = props;

    return (
        <FormControl
            className={clsx(classes.root, className)}
            fullWidth={fullWidth}
        >
            <Autocomplete
                id={id}
                options={options}
                getOptionLabel={getOptionLabel}
                value={value}
                onChange={onChange}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={label}
                        variant="outlined"
                        margin="dense"
                        className={classes.root}
                        fullWidth
                    />
                )}
                {...rest}
            />
        </FormControl>
    );
};

AutocompleteComponent.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    fullWidth: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    getOptionLabel: PropTypes.func,
};

AutocompleteComponent.defaultProps = {
    classes: null,
    id: '',
    label: '',
    value: null,
    fullWidth: false,
    options: [{ }],
    onChange: () => { },
    getOptionLabel: () => { },
};

export default withStyles(styles)(AutocompleteComponent);
