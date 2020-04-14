import React from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Cancel, CheckCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';

import {
    DrugStatus,
} from '../../constants';

const useStyles = makeStyles(theme => ({
    statusContainer: {
        display: 'flex',
        alignItems: 'center'
    },
}));

const Status = props => {
    const { status } = props;
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={classes.statusContainer}>
            {
                status === DrugStatus.Yes ?
                    <CheckCircle style={{ color: theme.palette.success.main }} />
                    :
                    <Cancel style={{ color: theme.palette.error.main }} />
            }
        </div>
    );
};

Status.propTypes = {
    status: PropTypes.string,
};

Status.defaultProps = {
    status: '',
};

export default Status;
