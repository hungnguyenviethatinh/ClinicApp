import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { StatusBullet } from '../StatusBullet';

const useStyles = makeStyles(theme => ({
    statusContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    status: {
        marginRight: theme.spacing(1)
    },
}));

const statusColors = {
	'Mới': 'success',
	'Khám': 'primary',
    'Tái khám': 'info',
    'Đã in': 'danger',
    'Có mặt': 'success',
    'Vắng mặt': 'danger',
    'Còn': 'success',
    'Hết': 'danger',
};

const Status = props => {
    const { status } = props;
    const classes = useStyles();

    return (
        <div className={classes.statusContainer}>
            <StatusBullet
                className={classes.status}
                color={statusColors[status]}
                size="sm"
            />
            {status}
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
