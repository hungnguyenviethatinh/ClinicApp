import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { StatusBullet } from '../StatusBullet';
import { 
    color,
    DrugStatus,
    PatientStatus,
    PrescriptionStatus,
    UserStatus,
} from '../../constants';

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
    [PatientStatus.IsNew]: color.success,
    [PatientStatus.IsAppointed]: color.neutral,
    [PatientStatus.IsChecking]: color.primary,
    [PatientStatus.IsChecked]: color.danger,
    [PatientStatus.IsRechecking]: color.info,
    [PrescriptionStatus.IsNew]: color.success,
    [PrescriptionStatus.IsPrinted]: color.danger,
    [PrescriptionStatus.IsPending]: color.warning,
    [UserStatus.Active]: color.success,
    [UserStatus.Inactive]: color.warning,
    [DrugStatus.Yes]: color.success,
    [DrugStatus.No]: color.danger,
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
