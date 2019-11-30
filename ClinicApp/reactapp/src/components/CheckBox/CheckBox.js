import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Checkbox, FormControl, FormControlLabel } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = {
    formControl: { },
    formControlLabel: {
        marginLeft: 0,
    },
    checkBox: { },
};

const CheckBoxComponent = props => {
    const {
        classes,
        style,
        fullWidth,
        label,
        value,
        checked,
        onChange,
        ...rest
    } = props;

    return (
        <FormControl
            fullWidth={fullWidth}
            className={classes.formControl}
            style={style}
        >
            <FormControlLabel
                className={classes.formControlLabel}
                control={
                    <Checkbox
                        className={classes.checkBox}
                        checked={checked}
                        value={value}
                        onChange={onChange}
                    />
                }
                label={label}
                labelPlacement="start"
                {...rest}
            />
        </FormControl>
    );
};

CheckBoxComponent.propTypes = {
    classes: PropTypes.object,
    style: PropTypes.object,
    fullWidth: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

CheckBoxComponent.defaultProps = {
    classes: null,
    style: null,
    fullWidth: false,
    label: '',
    value: '',
    checked: false,
    onChange: () => { },
};

export default withStyles(styles)(CheckBoxComponent);
