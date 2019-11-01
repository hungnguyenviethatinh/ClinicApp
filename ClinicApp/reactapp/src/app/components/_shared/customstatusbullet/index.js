import React from 'react';
import { makeStyles } from '@material-ui/styles';
import StatusBullet from '../statusbullet';
import PropTypes from 'prop-types';

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
	'Đang khám': 'success',
	'Đang chờ': 'danger',
	'Đang rảnh': 'info',
	'Chưa in': 'warning',
	'Đã in': 'primary'
};

const CustomStatusBullet = props => {
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

CustomStatusBullet.propTypes = {
    status: PropTypes.string
}

export default CustomStatusBullet;
