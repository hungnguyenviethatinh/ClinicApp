import React from 'react';
import { withStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import PropTypes from 'prop-types';

const styles = {
    button: {

    },
    icon: {

    }
};

const AddButton = props => {
    const { classes, onClick } = props;

    return (
        <IconButton
            className={classes.button}
            color="inherit"
            onClick={onClick}
        >
            <Add className={classes.icon} />
        </IconButton>
    );
};

AddButton.propTypes = {
    classes: PropTypes.object,
    onClick: PropTypes.func,
};

AddButton.defaultProps = {
    classes: null,
    onClick: () => { console.log('I am so tired!'); }
};

export default withStyles(styles)(AddButton);
