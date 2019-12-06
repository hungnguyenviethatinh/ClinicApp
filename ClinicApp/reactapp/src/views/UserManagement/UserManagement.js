import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography
} from '@material-ui/core';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select';
import { Snackbar } from '../../components/Snackbar';
import { Button } from '../../components/Button';
import { SearchInput } from '../../components/SearchInput';

import { 
    GetAllEmployeesUrl,
    GetEmployeeUrl,
    AddEmployeeUrl,
    UpdateEmployeeUrl,
} from '../../config';
import Axios, { 
    axiosConfig,
    axiosConfigJson,
} from '../../common';
import { 
    RoleConstants, 
} from '../../constants';

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

const roleOptions = [
    { label: RoleConstants.AdministratorRoleName, value: RoleConstants.AdministratorRoleName },
    { label: RoleConstants.DoctorRoleName, value: RoleConstants.DoctorRoleName },
    { label: RoleConstants.ReceptionistRoleName, value: RoleConstants.ReceptionistRoleName },
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
];

const getEmployeeLogMsfHeader = '[Get Employee Error]';
const getEmployeesLogMsfHeader = '[Get Employees Error]';
const addEmployeeLogMsfHeader = '[Add Employee Error]';
const updateEmployeeLogMsfHeader = '[Update Employee Error]';

const UserManagement = () => {

    const classes = useStyles();

    const tableRef = React.useRef(null);
    const refreshData = () => {
        tableRef.current && tableRef.current.onQueryChange();
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
            } else {
                if (status === 404) {
                    handleSnackbarOption('error', NotFoundMsg);
                }
            }
        }
        console.log(`${logMsgHeader}`, reason);
    };

    const [values, setValues] = React.useState({
        UserName: '',
        Password: '',
        FullName: '',
        RoleName: '',
        PhoneNumber: '',
        Email: '',
    });
    const handleValueChange = prop => event => {
        setValues({
            ...values,
            [prop]: event.target.value,
        })
    };

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value.trim());
    };
    const handleSearch = event => {
        event.preventDefault();
        refreshData();
    };

    const handleReset = () => {
        setValues({
            UserName: '',
            Password: '',
            FullName: '',
            RoleName: '',
            PhoneNumber: '',
            Email: '',
        });
    };

    const handleDone = () => {
        if (!values.UserName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên tài khoản!');
            return;
        }
        if (!updateMode && !values.Password.trim()){
            handleSnackbarOption('error', 'Yêu cầu nhập mật khẩu!');
            return;
        }
        if (!values.FullName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập họ tên!');
            return;
        }
        if (!values.RoleName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu chọn chức vụ!');
            return;
        }
        if (!values.Email.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập email!');
            return;
        }
        if (!values.PhoneNumber.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập số điện thoại!');
            return;
        }

        if (!updateMode) {
            addUser(values)
        } else {
            const { id } = selectedRow;
            updateUser(id, values);
        }
    };

    const addUser = (userModel) => {
        Axios.post(AddEmployeeUrl, userModel, axiosConfigJson()).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Tạo người dùng mới thành công!');
                handleReset();
                refreshData();
            }
        }).catch((reason) => {
            handleError(reason, addEmployeeLogMsfHeader);
        });
    };

    const updateUser = (id, userModel) => {
        const url = `${UpdateEmployeeUrl}/${id}`;
        Axios.put(url, userModel, axiosConfigJson()).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật người dùng thành công!');
                handleReset();
                refreshData();
            }
        }).catch((reason) => {
            handleError(reason, updateEmployeeLogMsfHeader);
        });
    };

    const [updateMode, setUpdateMode] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            const { id } = rowData;
            getEmployee(id);
            setUpdateMode(true);
        } else {
            setSelectedRow(null);
            handleReset();
            setUpdateMode(false);
        }
    };

    const getEmployee = (id) => {
        const url = `${GetEmployeeUrl}/${id}`;
        Axios.get(url, axiosConfig()).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { userName, fullName, roleName, phoneNumber, email } = data;
                setValues({
                    ...values,
                    UserName: userName,
                    FullName: fullName,
                    RoleName: roleName,
                    PhoneNumber: phoneNumber,
                    Email: email,
                });
            }
        }).catch((reason) => {
            handleError(reason, getEmployeeLogMsfHeader);
        });
    };

    const getEmployees = (resolve, reject, query) => {
        let value = searchValue;
        const config = axiosConfig();
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
                const { totalCount, employees } = data;
                const page = query.page;

                resolve({
                    data: employees,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            handleError(reason, getEmployeesLogMsfHeader);
        });
    };

    return (
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="QUẢN LÍ NHÂN VIÊN"
                        subheader="Thêm, xóa, cập nhật thông tin nhân viên"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography
                                variant="caption"
                                component="p"
                                children="FORM QUẢN LÍ NHÂN VIÊN"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="UserName"
                                        label="Tên tài khoản"
                                        value={values.UserName}
                                        onChange={handleValueChange('UserName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="FullName"
                                        label="Họ & Tên"
                                        value={values.FullName}
                                        onChange={handleValueChange('FullName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Select
                                        fullWidth
                                        id="RoleName"
                                        label="Chức vụ"
                                        value={values.RoleName}
                                        options={roleOptions}
                                        onChange={handleValueChange('RoleName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="Email"
                                        label="Email"
                                        value={values.Email}
                                        onChange={handleValueChange('Email')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="PhoneNumber"
                                        label="Số điện thoại"
                                        value={values.PhoneNumber}
                                        onChange={handleValueChange('PhoneNumber')}
                                        maxLength={10}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="Password"
                                        type="password"
                                        label="Mật khẩu"
                                        value={values.Password}
                                        onChange={handleValueChange('Password')}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                justify="flex-end"
                                style={{ marginTop: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        color="info"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        color="success"
                                        children="Hoàn tất"
                                        iconName="done"
                                        onClick={handleDone}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
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
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        onSearch={handleSearch}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={tableRef}
                            columns={employeeColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getEmployees(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectRow}
                            selectedRow={selectedRow}
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

export default UserManagement;
