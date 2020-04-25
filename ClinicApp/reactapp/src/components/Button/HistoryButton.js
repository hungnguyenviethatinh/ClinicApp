import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = {
    root: {
        padding: 0,
    },
    icon: {
        marginRight: 'auto',
    }
};

const HistoryButton = withRouter((props) => {
    const { classes, history } = props;

    const onClick = () => {
        history.goBack();
    }

    return (
        <Button color="primary" variant="text" className={classes.root} onClick={onClick}>
            <ArrowBackIcon className={classes.icon} />
        </Button>
    );
});

HistoryButton.propTypes = {
    classes: PropTypes.object,
};

HistoryButton.defaultProps = {
    classes: null,
};

export default withStyles(styles)(HistoryButton);
