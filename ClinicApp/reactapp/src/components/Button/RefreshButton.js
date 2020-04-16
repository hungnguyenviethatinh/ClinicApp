import React from 'react';
import { withStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import PropTypes from 'prop-types';

const styles = {
    button: {

    },
    icon: {

    }
};

const RefreshButton = props => {
    const { classes, onClick } = props;

    return (
        <IconButton
            className={classes.button}
            color="inherit"
            onClick={onClick}
        >
            <Refresh className={classes.icon} />
        </IconButton>
    );
};

RefreshButton.propTypes = {
    onClick: PropTypes.func,
};

RefreshButton.defaultProps = {
    onClick: () => { console.log('I am so tired!'); }
};

export default withStyles(styles)(RefreshButton);
