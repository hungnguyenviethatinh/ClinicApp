import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
} from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';

import { Table } from '../../../components/Table';
import { Status } from '../../../components/Status';
import { Snackbar } from '../../../components/Snackbar';
import { Button } from '../../../components/Button';

import {
    GetPatientInQueueByDoctorUrl,
    GetPrescriptionsInQueueByDoctorUrl,
    UpdatePatientStatusUrl,
} from '../../../config';
import Axios, {
    axiosRequestConfig,
    useInterval,
} from '../../../common';
import {
    ExpiredSessionMsg,
    Gender,
    PatientStatus,
    PrescriptionStatus,
    RefreshDataTimer,
    PatientStatusEnum,
    RouteConstants,
    IdPrefix,
} from '../../../constants';
import { encodeId } from '../../../utils';

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
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            let status = [
                PatientStatus.IsNew,
                PatientStatus.IsAppointed,
                PatientStatus.IsChecking,
                PatientStatus.IsChecked,
                PatientStatus.IsRechecking][rowData.status];
            if (moment(rowData.appointmentDate).isValid()) {
                if (status !== PatientStatus.IsChecking) {
                    status = PatientStatus.IsAppointed;
                }
            }
            return <Status status={status} />
        },
    },
];

const prescriptionColumns = [
    {
        title: 'Mã ĐT', field: 'id',
        render: rowData =>
            <Link
                to={`/prescription/${rowData.id}`}
                children={
                    encodeId(rowData.patientId, `${IdPrefix.Prescription}${IdPrefix.Patient}`)
                } />,
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
const updatePatientLogMsgHeader = '[Update Patient Error]';

const DoctorView = () => {
    const classes = useStyles();
    const history = useHistory();
    let patientTableRef = React.createRef();
    let prescriptionTableRef = React.createRef();

    const refreshPatientData = () => {
        patientTableRef.current && patientTableRef.current.onQueryChange();
    };
    const refreshPrescriptionData = () => {
        prescriptionTableRef.current && prescriptionTableRef.current.onQueryChange();
    };

    const [countPatientTable, setCountPatientTable] = React.useState(0);
    const [countPrescriptionTable, setCountPrescriptionTable] = React.useState(0);
    useInterval(() => {
        if (countPatientTable > 0 && countPatientTable < RefreshDataTimer) {
            setCountPatientTable(countPatientTable + 1);
        } else {
            refreshPatientData();
        }
        if (countPrescriptionTable > 0 && countPrescriptionTable < RefreshDataTimer) {
            setCountPrescriptionTable(countPrescriptionTable + 1);
        } else {
            refreshPrescriptionData();
        }
    }, 1000);

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

    const config = axiosRequestConfig();

    const getPatientsInQueue = (resolve, reject, query) => {
        Axios.get(GetPatientInQueueByDoctorUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { page } = query;
                const totalCount = data.length;
                resolve({
                    data,
                    page,
                    totalCount,
                });
            }
            setCountPatientTable(1);
            setSelectedRow(null);
        }).catch((reason) => {
            handleError(reason, getPatientLogMsgHeader);
            setCountPatientTable(1);
        });
    };

    const getPrescriptionsInQueue = (resolve, reject, query) => {
        Axios.get(GetPrescriptionsInQueueByDoctorUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { page } = query;
                const totalCount = data.length;
                resolve({
                    data,
                    page,
                    totalCount,
                });
            }
            setCountPrescriptionTable(1);
        }).catch((reason) => {
            handleError(reason, getPrescriptionLogMsgHeader);
            setCountPrescriptionTable(1);
        });
    };

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
        } else {
            setSelectedRow(null);
        }
    };

    const patientPreviousStatus = 'patientPreviousStatus';

    const handleCancel = () => {
        const { id } = selectedRow;
        const status = localStorage.getItem(patientPreviousStatus) || PatientStatusEnum[PatientStatus.IsNew];
        const url = `${UpdatePatientStatusUrl}/${id}/${status}`;
        Axios.get(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Hủy kê đơn thành công!');
                setSelectedRow(null);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xử lý. Vui lòng thử lại sau!');
            }
        }).catch((reason) => {
            handleError(reason, updatePatientLogMsgHeader);
            handleSnackbarOption('error', 'Có lỗi khi xử lý. Vui lòng thử lại sau!');
        });
    };

    const handleUpdate = () => {
        const { id, status } = selectedRow;
        localStorage.setItem(patientPreviousStatus, `${status}`);
        const url = `${UpdatePatientStatusUrl}/${id}/${PatientStatusEnum[PatientStatus.IsChecking]}`;
        Axios.get(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                history.push(RouteConstants.PrescriptionManagementView);
            } else {
                handleSnackbarOption('error', 'Đang kê đơn cho bệnh nhân khác!');
            }
        }).catch((reason) => {
            handleError(reason, updatePatientLogMsgHeader);
            handleSnackbarOption('error', 'Có lỗi khi xử lý. Vui lòng thử lại sau!');
        });
    };

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
                        action={
                            <React.Fragment>
                                {
                                    selectedRow &&
                                    <Grid
                                        container
                                        spacing={3}
                                        justify="flex-end"
                                        alignItems="center"
                                    >
                                        {
                                            (selectedRow.status === PatientStatusEnum[PatientStatus.IsChecking]) ?
                                                <Grid item>
                                                    <Button
                                                        fullWidth
                                                        color="danger"
                                                        children="Hủy kê đơn"
                                                        iconName="cancel"
                                                        onClick={handleCancel}
                                                    />
                                                </Grid>
                                                :
                                                <Grid item>
                                                    <Button
                                                        fullWidth
                                                        color="success"
                                                        children="Kê đơn"
                                                        iconName="pen"
                                                        onClick={handleUpdate}
                                                    />
                                                </Grid>
                                        }
                                    </Grid>
                                }
                            </React.Fragment>
                        }
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
                            onRowClick={handleSelectRow}
                            selectedRow={selectedRow}
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

export default DoctorView;
