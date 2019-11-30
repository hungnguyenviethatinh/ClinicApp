import React from 'react';
import { FormControl, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const styles = {
    root: {
        marginTop: 0,
        marginBottom: 0,
    },
};

const AutocompleteComponent = props => {

    const { classes, className, id, label, value, fullWidth, options, onChange } = props;

    return (
        <FormControl
            className={clsx(classes.root, className)}
            fullWidth={fullWidth}
            margin="dense"
        >
            <Autocomplete
                id={id}
                options={options}
                getOptionLabel={option => option.key}
                value={value}
                onChange={onChange}
                style={{ width: '100%' }}
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
    options: PropTypes.shape({
        key: propTypes.string,
        value: propTypes.any,
    }),
    onChange: PropTypes.func,
};

AutocompleteComponent.defaultProps = {
    classes: null,
    id: '',
    label: '',
    value: null,
    fullWidth: false,
    options: { },
    onChange: () => { },
};

export default withStyles(styles)(AutocompleteComponent);
