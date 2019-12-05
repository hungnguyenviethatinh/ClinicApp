import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
} from '@material-ui/core';

import moment from 'moment';
import { Table } from '../../../components/Table';
import { Status } from '../../../components/Status';
import { Snackbar } from '../../../components/Snackbar';
import clsx from 'clsx';
import {
    GetPatientInQueueUrl, GetPrescriptionsInQueueUrl,
} from '../../../config';
import Axios, {
    axiosConfig,
} from '../../../common';
import {
    ExpiredSessionMsg,
    Gender,
    PatientStatus,
    PrescriptionStatus,
} from '../../../constants';

const useStyles = makeStyles(theme => ({
    card: {},
    content: {
        padding: theme.spacing(0),
    },
    actions: {
        justifyContent: 'flex-end',
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fullHeight: {
        height: '100%',
    }
}));

const patientQueueColumns = [
    {
        title: 'Họ & Tên', field: 'fullName',
    },
    {
        title: 'Năm sinh', field: 'dateOfBirth', type: 'date',
        render: rowData => moment(rowData.dateOfBirth).year(),
    },
    {
        title: 'Giới tính', field: 'gender', type: 'numeric',
        render: rowData => [Gender.None, Gender.Male, Gender.Female][rowData.gender],
    },
    {
        title: 'Bác sĩ khám', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            let status = [
                PatientStatus.IsNew,
                PatientStatus.IsAppointed,
                PatientStatus.IsChecking,
                PatientStatus.IsChecked,
                PatientStatus.IsRechecking][rowData.status];
            if (moment(rowData.appointmentDate).isValid()) {
                status = PatientStatus.IsAppointed;
            }
            return <Status status={status} />
        },
    },
];

const prescriptionColumns = [
    {
        title: 'Mã ĐT', field: 'id',
        render: rowData => <Link to={`/prescription/${rowData.id}`} children={`${rowData.id}`} />,
    },
    {
        title: 'Bác sĩ kê đơn', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
    },
    {
        title: 'Bệnh nhân', field: 'patientId',
        render: rowData => rowData.patient.fullName,
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            const status = [
                PrescriptionStatus.IsNew,
                PrescriptionStatus.IsPending,
                PrescriptionStatus.IsPrinted][rowData.status]
            return <Status status={status} />
        },
    },
];

const getPatientLogMsgHeader = '[Get Patients Error]';
const getPrescriptionLogMsgHeader = '[Get Prescriptions Error]';

const ReceptionistView = () => {
    const classes = useStyles();
    let patientTableRef = React.createRef();
    let prescriptionTableRef = React.createRef();

    const refreshData = () => {
        patientTableRef.current && patientTableRef.current.onQueryChange();
        prescriptionTableRef.current && prescriptionTableRef.current.onQueryChange();
    };

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const [snackbarOption, setSnackbarOption] = React.useState({
        variant: 'success',
        message: '',
    });
    const handleSnackbarOption = (variant, message) => {
        setSnackbarOption({
            variant,
            message,
        });
        setOpenSnackbar(true);
    };

    const handleError = (reason, logMsgHeader) => {
        if (reason.response) {
            const { status } = reason.response;
            if (status === 401) {
                handleSnackbarOption('error', ExpiredSessionMsg);
            }
        }
        console.log(`${logMsgHeader}`, reason);
    };

    const getPatientsInQueue = (resolve, reject, query) => {
        Axios.get(GetPatientInQueueUrl, axiosConfig()).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const page = query.page;
                const totalCount = data.length;
                resolve({
                    data,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            handleError(reason, getPatientLogMsgHeader);
        });
    };

    const getPrescriptionsInQueue = (resolve, reject, query) => {
        Axios.get(GetPrescriptionsInQueueUrl, axiosConfig()).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const page = query.page;
                const totalCount = data.length;
                resolve({
                    data,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            handleError(reason, getPrescriptionLogMsgHeader);
        });
    };

    React.useEffect(() => {
        console.log('ref: ', patientTableRef);
        console.log('current: ', patientTableRef.current);
    });

    return (
        <Grid
            container
            spacing={3}
            className={classes.fullHeight} >
            <Grid
                item
                xs={12} sm={12} md={6} lg={6} xl={6}
                className={classes.fullHeight}>
                <Card
                    className={clsx(classes.card, classes.fullHeight)}
                >
                    <CardHeader
                        title="HÀNG CHỜ BỆNH NHÂN"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={patientTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={patientQueueColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPatientsInQueue(resolve, reject, query);
                                })
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                item
                xs={12} sm={12} md={6} lg={6} xl={6}
                className={classes.fullHeight} >
                <Card
                    className={clsx(classes.card, classes.fullHeight)}
                >
                    <CardHeader
                        title="DANH SÁCH ĐƠN THUỐC MỚI"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={prescriptionTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={prescriptionColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPrescriptionsInQueue(resolve, reject, query);
                                })
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Snackbar
                vertical="bottom"
                horizontal="right"
                variant={snackbarOption.variant}
                message={snackbarOption.message}
                open={openSnackbar}
                handleClose={handleSnackbarClose}
            />
        </Grid>
    );
}

export default ReceptionistView;
