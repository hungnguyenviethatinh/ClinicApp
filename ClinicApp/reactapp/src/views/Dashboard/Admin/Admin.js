import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';

import moment from 'moment';

import { Table } from '../../../components/Table';
import { DrugStatusIcon, Status } from '../../../components/Status';
import { Snackbar } from '../../../components/Snackbar';
import { SearchInput } from '../../../components/SearchInput';

import Axios, {
    axiosRequestConfig,
} from '../../../common';
import {
    GetAllPatientsUrl,
    GetAllEmployeesUrl,
    GetAllPrescriptionsUrl,
    GetAllMedicinesUrl,
} from '../../../config';
import {
    Gender,
    PatientStatus,
    PrescriptionStatus,
    UserStatus,
    DrugStatus,
    RouteConstants,
    DisplayDateFormat,
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
}));

const patientQueueColumns = [
    {
        title: 'Mã BN', field: 'id',
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
        title: 'Tuổi', field: 'age', type: 'numeric',
    },
    {
        title: 'Giới tính', field: 'gender', type: 'numeric',
        render: rowData => [Gender.None, Gender.Male, Gender.Female][rowData.gender],
    },
    {
        title: 'Số ĐT', field: 'phoneNumber',
    },
    {
        title: 'Địa chỉ', field: 'address',
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
                PatientStatus.IsToAddDocs,][rowData.status];
            if (moment(rowData.appointmentDate).isValid()) {
                if (status !== PatientStatus.IsChecked && status !== PatientStatus.IsChecking) {
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
                to={`${RouteConstants.PrescriptionDetailView.replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
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
        title: 'Ngày kê đơn', field: 'dateCreated', type: 'date',
        render: rowData => moment(rowData.dateCreated).format(DisplayDateFormat),
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

const employeeColumns = [
    {
        title: 'Họ & Tên', field: 'fullName',
    },
    {
        title: 'Chức vụ', field: 'roleName',
    },
    {
        title: 'Số ĐT', field: 'phoneNumber',
    },
    {
        title: 'Thông tin khác', field: 'additionalInfo',
    },
    {
        title: 'Trạng thái', field: 'isActive',
        render: rowData => {
            const status = rowData.isActive ? UserStatus.Active : UserStatus.Inactive;
            return <Status status={status} />
        },
    },
];

const medicineColumns = [
    {
        title: 'Mã thuốc', field: 'idCode',
    },
    {
        title: 'Tên thuốc', field: 'name',
    },
    {
        title: 'Biệt dược', field: 'ingredient',
    },
    {
        title: 'Hảm lượng', field: 'netWeight',
    },
    {
        title: 'HSD', field: 'expiredDate',
    },
    {
        title: 'Số lượng', field: 'quantity', type: 'numeric',
    },
    {
        title: 'Đơn vị', field: 'unit',
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            const status = [
                DrugStatus.No,
                DrugStatus.Yes][rowData.status]
            return <DrugStatusIcon status={status} />
        },
    },
];

const getPatientLogMsgHeader = '[Get Patients Error]';
const getPrescriptionLogMsgHeader = '[Get Prescriptions Error]';
const getMedicineLogMsfHeader = '[Get Medicines Error]';
const getEmployeeLogMsfHeader = '[Get Employees Error]';

const AdminView = () => {
    const classes = useStyles();
    const config = axiosRequestConfig();

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

    const patientTableRef = React.useRef(null);
    const prescriptionTableRef = React.useRef(null);
    const employeeTableRef = React.useRef(null);
    const medicineTableRef = React.useRef(null);

    const refreshPatientData = () => {
        patientTableRef.current && patientTableRef.current.onQueryChange();
    };
    const refreshPrescriptionData = () => {
        prescriptionTableRef.current && prescriptionTableRef.current.onQueryChange();
    };
    const refreshEmployeeData = () => {
        employeeTableRef.current && employeeTableRef.current.onQueryChange();
    };
    const refreshMedicineData = () => {
        medicineTableRef.current && medicineTableRef.current.onQueryChange();
    };

    const [patientSearchValue, setPatientSearchValue] = React.useState('');
    const [prescriptionSearchValue, setPrescriptionSearchValue] = React.useState('');
    const [employeeSearchValue, setEmployeeSearchValue] = React.useState('');
    const [medicineSearchValue, setMedicineSearchValue] = React.useState('');
    const handlePatientSearchChange = event => {
        setPatientSearchValue(event.target.value);
    };
    const handlePatientSearch = event => {
        event.preventDefault();
        refreshPatientData();
    };
    const handlePrescriptionSearchChange = event => {
        setPrescriptionSearchValue(event.target.value);
    };
    const handlePrescriptionSearch = event => {
        event.preventDefault();
        refreshPrescriptionData();
    };
    const handleEmployeeSearchChange = event => {
        setEmployeeSearchValue(event.target.value);
    };
    const handleEmployeeSearch = event => {
        event.preventDefault();
        refreshEmployeeData();
    };
    const handleMedicineSearchChange = event => {
        setMedicineSearchValue(event.target.value);
    };
    const handleMedicineSearch = () => {
        event.preventDefault();
        refreshMedicineData();
    };

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const getPatients = (resolve, reject, query) => {
        Axios.get(GetAllPatientsUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: patientSearchValue,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, patients } = data[0];
                const { page } = query;

                resolve({
                    data: patients,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            handleError(reason, getPatientLogMsgHeader);
        });
    };

    const getPrescriptions = (resolve, reject, query) => {
        Axios.get(GetAllPrescriptionsUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: prescriptionSearchValue,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, prescriptions } = data[0];
                const { page } = query;

                resolve({
                    data: prescriptions,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            handleError(reason, getPrescriptionLogMsgHeader);
        });
    };

    const getEmployees = (resolve, reject, query) => {
        Axios.get(GetAllEmployeesUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: employeeSearchValue,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, employees } = data[0];
                const { page } = query;

                resolve({
                    data: employees,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            handleError(reason, getEmployeeLogMsfHeader);
        });
    };

    const getMedicines = (resolve, reject, query) => {
        Axios.get(GetAllMedicinesUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: medicineSearchValue,
                findBy: null,
                startDate: null,
                endDate: null,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, medicines } = data[0];
                const { page } = query;

                resolve({
                    data: medicines,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            handleError(reason, getMedicineLogMsfHeader);
        });
    };

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="DANH SÁCH BỆNH NHÂN"
                        subheader="Tất cả bệnh nhân có hồ sơ trên hệ thống"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper
                            elevation={0}
                            className={classes.paper}
                            style={{ paddingBottom: 10 }}
                        >
                            <Typography
                                variant="caption"
                                component="p"
                                children="TÌM KIẾM BỆNH NHÂN"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <SearchInput
                                        placeholder="Nhập mã số, tên hoặc sđt của bệnh nhân"
                                        value={patientSearchValue}
                                        onChange={handlePatientSearchChange}
                                        onSearch={handlePatientSearch}
                                        id="patientSearchInput"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={patientTableRef}
                            columns={patientQueueColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPatients(resolve, reject, query);
                                })
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="DANH SÁCH ĐƠN THUỐC"
                        subheader="Tất cả đơn thuốc đã được kê và lưu trữ trên hệ thống"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper
                            elevation={0}
                            className={classes.paper}
                            style={{ paddingBottom: 10 }}
                        >
                            <Typography
                                variant="caption"
                                component="p"
                                children="TÌM KIẾM ĐƠN THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <SearchInput
                                        placeholder="Nhập mã đt, tên bác sĩ hoặc tên bệnh nhân để tìm đơn thuốc"
                                        value={prescriptionSearchValue}
                                        onChange={handlePrescriptionSearchChange}
                                        onSearch={handlePrescriptionSearch}
                                        id="prescriptionSearchInput"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={prescriptionTableRef}
                            columns={prescriptionColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPrescriptions(resolve, reject, query);
                                })
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="DANH SÁCH NHÂN VIÊN"
                        subheader="Tất cả tài khoản của nhân viên có trên hệ thống"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper
                            elevation={0}
                            className={classes.paper}
                            style={{ paddingBottom: 10 }}
                        >
                            <Typography
                                variant="caption"
                                component="p"
                                children="TÌM KIẾM NHÂN VIÊN"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <SearchInput
                                        placeholder="Nhập tên tài khoản, tên, số điện thoại"
                                        value={employeeSearchValue}
                                        onChange={handleEmployeeSearchChange}
                                        onSearch={handleEmployeeSearch}
                                        id="employeeSearchInput"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={employeeTableRef}
                            columns={employeeColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getEmployees(resolve, reject, query);
                                })
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="DANH SÁCH THUỐC"
                        subheader="Thuốc hiện có trong hệ thống"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper
                            elevation={0}
                            className={classes.paper}
                            style={{ paddingBottom: 10 }}
                        >
                            <Typography
                                variant="caption"
                                component="p"
                                children="TÌM KIẾM THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <SearchInput
                                        placeholder="Nhập mã thuốc, tên thuốc"
                                        value={medicineSearchValue}
                                        onChange={handleMedicineSearchChange}
                                        onSearch={handleMedicineSearch}
                                        id="medicineSearchInput"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={medicineTableRef}
                            columns={medicineColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getMedicines(resolve, reject, query);
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

export default AdminView;
