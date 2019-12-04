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
    GetPatientInQueueUrl,
} from '../../../config';
import Axios, {
    axiosConfig,
} from '../../../common';
import { 
    ExpiredSessionMsg,
    Gender,
    PatientStatus,
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

const genderList = [
    { name: 'Nam', id: 0 },
    { name: 'Nữ', id: 1 },
    { name: 'Khác', id: 2 },
];

const typeList = [
    { name: 'Đơn thuốc', id: 0 },
    { name: 'Đơn chỉ định', id: 1 },
];

const statusList = [
    { name: 'Mới', id: 0 },
    { name: 'Tái khám', id: 1 },
    { name: 'Khám', id: 2 },
];

const doctorList = [
    { name: 'Nguyễn A', id: 'DKC-BS01' },
    { name: 'Nguyễn B', id: 'DKC-BS02' },
    { name: 'Nguyễn C', id: 'DKC-BS03' },
];

const patientQueueColumns = [
    {
        title: 'STT', field: 'order', type: 'numeric',
    },
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

// const prescriptionColumns = [
//     {
//         title: 'Mã số Đơn thuốc', field: 'ID',
//         render: rowData => <Link to={`/prescription/${rowData.ID}`} children={`${rowData.ID}`} />,
//     },
//     {
//         title: 'Bác sĩ kê đơn', field: 'DoctorID',
//         render: rowData => doctorList.find(d => d.id === rowData.DoctorID).name,
//     },
//     {
//         title: 'Bệnh nhân', field: 'PatientID',
//         render: rowData => patientQueue.find(p => p.ID === rowData.PatientID).FullName,
//     },
//     {
//         title: 'Loại đơn', field: 'TypeID',
//         render: rowData => typeList.find(t => t.id === rowData.TypeID).name,
//     },
//     {
//         title: 'Trạng thái', field: 'StatusID',
//         render: rowData => <Status status={statusList.find(s => s.id === rowData.StatusID).name} />,
//     },
// ];

// const prescriptions = [
//     {
//         ID: 'DKC-DT001',
//         DoctorID: 'DKC-BS01',
//         PatientID: 'DKC-BN191118194219',
//         TypeID: 0,
//         StatusID: 0,
//     },
//     {
//         ID: 'DKC-DT002',
//         DoctorID: 'DKC-BS02',
//         PatientID: 'DKC-BN191118194220',
//         TypeID: 0,
//         StatusID: 0,
//     },
//     {
//         ID: 'DKC-DT003',
//         DoctorID: 'DKC-BS03',
//         PatientID: 'DKC-BN191118194216',
//         TypeID: 0,
//         StatusID: 0,
//     },
//     {
//         ID: 'DKC-DT004',
//         DoctorID: 'DKC-BS01',
//         PatientID: 'DKC-BN191118194217',
//         TypeID: 1,
//         StatusID: 0,
//     },
//     {
//         ID: 'DKC-DT005',
//         DoctorID: 'DKC-BS01',
//         PatientID: 'DKC-BN191118194218',
//         TypeID: 1,
//         StatusID: 0,
//     },
// ];

const ReceptionistView = () => {
    const classes = useStyles();
    let patientTableRef = React.createRef();

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

    const getPatientsInQueue = (resolve, reject, query) => {
        Axios.get(GetPatientInQueueUrl, axiosConfig()).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                data.map((dt, index) => Object.assign(dt, {
                    order: index + 1,
                }));
                const page = query.page;
                const totalCount = data.length;
                resolve({
                    data,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            if (reason.response) {
                const { status } = reason.response;
                if (status === 401) {
                    handleSnackbarOption('error', ExpiredSessionMsg);
                }
            }
            console.log('[Get Latest Patients Queue Error] ', reason);
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
                        {/* <Table
                            customOptions={{
                                paging: false,
                            }}
                            columns={prescriptionColumns}
                            data={[prescriptions]}
                        /> */}
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
