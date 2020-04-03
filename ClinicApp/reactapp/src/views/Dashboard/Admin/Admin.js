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
import { Status } from '../../../components/Status';
import { Snackbar } from '../../../components/Snackbar';
import { SearchInput } from '../../../components/SearchInput';

import Axios, {
    axiosRequestConfig,
    // useInterval,
} from '../../../common';
import {
    GetAllPatientsUrl,
    GetAllEmployeesUrl,
    GetAllPrescriptionsUrl,
    GetAllMedicinesUrl,
} from '../../../config';
import {
    IdPrefix,
    Gender,
    PatientStatus,
    PrescriptionStatus,
    UserStatus,
    DrugStatus,
    // RefreshDataTimer,
    AddressSeperator,
    RouteConstants,
} from '../../../constants';
import { encodeId, decodeId } from '../../../utils';

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
    {
        title: 'Số ĐT', field: 'phoneNumber',
    },
    {
        title: 'Email', field: 'email',
    },
    {
        title: 'Địa chỉ', field: 'address',
        render: rowData => _.last(rowData.address.split(AddressSeperator)),
    },
    {
        title: 'Nghề nghiệp', field: 'job',
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
                PatientStatus.IsToAddDocs, ][rowData.status];
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
        title: 'Email', field: 'email',
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
        title: 'Tên thuốc', field: 'name',
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
            return <Status status={status} />
        },
    },
];

const getPatientLogMsgHeader = '[Get Patients Error]';
const getPrescriptionLogMsgHeader = '[Get Prescriptions Error]';
const getMedicineLogMsfHeader = '[Get Medicines Error]';
const getEmployeeLogMsfHeader = '[Get Employees Error]';

const AdminView = () => {
    const classes = useStyles();

    let patientTableRef = React.createRef();
    let prescriptionTableRef = React.createRef();
    let employeeTableRef = React.createRef();
    let medicineTableRef = React.createRef();

    const refreshPatientData = () => {
        patientTableRef.current && patientTableRef.current.onQueryChange();
    };
    const refreshPrescriptionData = () => {
        prescriptionTableRef.current && prescriptionTableRef.current.onQueryChange();
    };
    const refreshEmployeeData = () => {
        employeeTableRef.current && employeeTableRef.current.onQueryChange();
    };
    // const refreshMedicineData = () => {
    //     medicineTableRef.current && medicineTableRef.current.onQueryChange();
    // };

    // const [countPatientTable, setCountPatientTable] = React.useState(0);
    // const [countPrescriptionTable, setCountPrescriptionTable] = React.useState(0);
    // const [countEmployeeTable, setCountEmployeeTable] = React.useState(0);
    // const [countMedicineTable, setCountMedicineTable] = React.useState(0);
    // useInterval(() => {
    //     if (countPatientTable > 0 && countPatientTable < RefreshDataTimer) {
    //         setCountPatientTable(countPatientTable + 1);
    //     } else {
    //         refreshPatientData();
    //     }
    //     if (countPrescriptionTable > 0 && countPrescriptionTable < RefreshDataTimer) {
    //         setCountPrescriptionTable(countPrescriptionTable + 1);
    //     } else {
    //         refreshPrescriptionData();
    //     }
    //     if (countEmployeeTable > 0 && countEmployeeTable < RefreshDataTimer) {
    //         setCountEmployeeTable(countEmployeeTable + 1);
    //     } else {
    //         refreshEmployeeData();
    //     }
    //     if (countMedicineTable > 0 && countMedicineTable < RefreshDataTimer) {
    //         setCountMedicineTable(countMedicineTable + 1);
    //     } else {
    //         refreshMedicineData();
    //     }
    // }, 1000);

    const [patientSearchValue, setPatientSearchValue] = React.useState('');
    const [prescriptionSearchValue, setPrescriptionSearchValue] = React.useState('');
    const [employeeSearchValue, setEmployeeSearchValue] = React.useState('');
    const handlePatientSearchChange = event => {
        setPatientSearchValue(event.target.value.trim());
    };
    const handlePatientSearch = event => {
        event.preventDefault();
        refreshPatientData();
    };
    const handlePrescriptionSearchChange = event => {
        setPrescriptionSearchValue(event.target.value.trim());
    };
    const handlePrescriptionSearch = event => {
        event.preventDefault();
        refreshPrescriptionData();
    };
    const handleEmployeeSearchChange = event => {
        setEmployeeSearchValue(event.target.value.trim());
    };
    const handleEmployeeSearch = event => {
        event.preventDefault();
        refreshEmployeeData();
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

    const config = axiosRequestConfig();

    const getPatients = (resolve, reject, query) => {
        // let value = patientSearchValue.toLowerCase();
        // const prefix = IdPrefix.Patient.toLowerCase();
        // if (value.startsWith(prefix)) {
        //     value = decodeId(value, prefix);
        // }
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
            // setCountPatientTable(1);
        }).catch((reason) => {
            handleError(reason, getPatientLogMsgHeader);
            // setCountPatientTable(1);
        });
    };

    const getPrescriptions = (resolve, reject, query) => {
        // let value = prescriptionSearchValue.toLowerCase();
        // const prefix = `${IdPrefix.Prescription}${IdPrefix.Patient}`.toLowerCase();
        // if (value.startsWith(prefix)) {
        //     value = decodeId(value, prefix);
        // }
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
            // setCountPrescriptionTable(1);
        }).catch((reason) => {
            handleError(reason, getPrescriptionLogMsgHeader);
            // setCountPrescriptionTable(1);
        });
    };

    const getEmployees = (resolve, reject, query) => {
        let value = employeeSearchValue;
        Axios.get(GetAllEmployeesUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: value,
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
            // setCountEmployeeTable(1);
        }).catch((reason) => {
            handleError(reason, getEmployeeLogMsfHeader);
            // setCountEmployeeTable(1);
        });
    };

    const getMedicines = (resolve, reject, query) => {
        Axios.get(GetAllMedicinesUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
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
            // setCountMedicineTable(1);
        }).catch((reason) => {
            handleError(reason, getMedicineLogMsfHeader);
            // setCountMedicineTable(1);
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
                                        placeholder="Nhập tên tài khoản, tên, số dt hoặc email"
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
