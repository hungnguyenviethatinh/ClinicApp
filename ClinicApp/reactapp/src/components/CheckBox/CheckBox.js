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
        id,
        classes,
        style,
        fullWidth,
        label,
        value,
        checked,
        onChange,
        disabled,
        labelPlacement,
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
                        id={id}
                        className={classes.checkBox}
                        checked={checked}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                }
                label={label}
                labelPlacement={labelPlacement}
                {...rest}
            />
        </FormControl>
    );
};

CheckBoxComponent.propTypes = {
    id: PropTypes.string,
    classes: PropTypes.object,
    style: PropTypes.object,
    fullWidth: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    labelPlacement: PropTypes.oneOf(['start', 'top', 'end', 'bottom']),
};

CheckBoxComponent.defaultProps = {
    id: '',
    classes: null,
    style: null,
    fullWidth: false,
    label: '',
    value: '',
    checked: false,
    onChange: () => { },
    disabled: false,
    labelPlacement: 'start',
};

export default withStyles(styles)(CheckBoxComponent);
