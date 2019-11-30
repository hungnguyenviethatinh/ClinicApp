import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = {
    formControl: {},
    formLabel: {},
};

const LabelComponent = props => {
    const {
        classes,
        style,
        fullWidth,
        label,
    } = props;

    return (
        <FormControl
            className={classes.formControl}
            fullWidth={fullWidth}
            style={style}
        >
            <FormLabel
                className={classes.formLabel}
                component="label"
                children={label}
            />
        </FormControl>
    );
};

LabelComponent.propTypes = {
    classes: PropTypes.object,
    style: PropTypes.object,
    fullWidth: PropTypes.bool,
    label: PropTypes.string,
};

LabelComponent.defaultProps = {
    classes: null,
    style: null,
    fullWidth: false,
    label: '',
};

export default withStyles(styles)(LabelComponent);
