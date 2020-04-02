import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';

import { Table } from '../../../components/Table';
import { Status } from '../../../components/Status';
import { Snackbar } from '../../../components/Snackbar';

import {
    GetPatientInQueueUrl,
    GetPrescriptionsInQueueUrl,
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
    // IdPrefix,
    RefreshDataTimer,
    RouteConstants,
    AddressSeperator,
    DisplayDateTimeFormat,
} from '../../../constants';
// import { encodeId } from '../../../utils';

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
        title: 'STT', field: 'orderNumber', type: 'numeric',
    },
    {
        title: 'Ngày khám', field: 'updatedDate', type: 'date',
        render: rowData => {
            if (rowData.appointmentDate) {
                return moment(rowData.appointmentDate).format(DisplayDateTimeFormat);
            }

            return moment(rowData.updatedDate).format(DisplayDateTimeFormat);
        },
    },
    {
        title: 'Mã BN', field: 'id',
        // render: rowData =>
        //     <Link
        //         to={`${RouteConstants.PatientDetailView.replace(':id', rowData.id)}`}
        //         children={
        //             encodeId(rowData.id, IdPrefix.Patient)
        //         } />,
        render: rowData =>
            <Link
                to={`${RouteConstants.PatientDetailView.replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`}
            />,
    },
    {
        title: 'Họ & Tên', field: 'fullName',
    },
    {
        // title: 'Năm sinh', field: 'dateOfBirth', type: 'date',
        // render: rowData => moment(rowData.dateOfBirth).year(),
        title: 'Tuổi', field: 'age', type: 'numeric',
    },
    {
        title: 'Giới tính', field: 'gender', type: 'numeric',
        render: rowData => [Gender.None, Gender.Male, Gender.Female][rowData.gender],
    },
    // {
    //     title: 'Bác sĩ khám', field: 'doctorId',
    //     render: rowData => rowData.doctor.fullName,
    // },
    {
        title: 'Số ĐT', field: 'phoneNumber',
    },
    {
        title: 'Địa chỉ', field: 'address',
        render: rowData => _.last(rowData.address.split(AddressSeperator)),
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            let status = [
                PatientStatus.IsNew,
                PatientStatus.IsAppointed,
                PatientStatus.IsChecking,
                PatientStatus.IsChecked,
                PatientStatus.IsRechecking,
                PatientStatus.IsToAddDocs][rowData.status];
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
        // render: rowData =>
        //     <Link
        //         to={`${RouteConstants.PrescriptionDetailView.replace(':id', rowData.id)}`}
        //         children={
        //             encodeId(rowData.patientId, `${IdPrefix.Prescription}${IdPrefix.Patient}`)
        //         } />,
        render: rowData =>
            <Link
                to={`${RouteConstants.PrescriptionDetailView.replace(':id', rowData.id)}`}
                children={`${rowData.patient.idCode}${rowData.patient.id}${rowData.idCode}${rowData.id}`} />,
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
        Axios.get(GetPatientInQueueUrl, config).then((response) => {
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
        }).catch((reason) => {
            handleError(reason, getPatientLogMsgHeader);
            setCountPatientTable(1);
        });
    };

    const getPrescriptionsInQueue = (resolve, reject, query) => {
        Axios.get(GetPrescriptionsInQueueUrl, config).then((response) => {
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

    const getPatientDetailPanel = (rowData) => {
        return (
            <div style={{ padding: 10 }}>
                <Typography
                    variant="caption"
                    component="p"
                    children="CÁC BÁC SĨ HỘI CHUẨN KHÁM"
                />
                {
                    !_.isEmpty(rowData.doctors) &&
                    rowData.doctors.map(({ doctor }) => (
                        <Typography
                            key={doctor.id}
                            variant="h6"
                            component="h6"
                            children={`${doctor.fullName}`}
                            style={{ fontWeight: 600 }}
                        />
                    ))
                }
            </div>
        );
    };

    return (
        <Grid
            container
            spacing={3}
            className={classes.fullHeight} >
            <Grid
                item
                xs={12} sm={12} md={12} lg={12} xl={12}
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
                            detailPanel={getPatientDetailPanel}
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
                xs={12} sm={12} md={12} lg={12} xl={12}
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
