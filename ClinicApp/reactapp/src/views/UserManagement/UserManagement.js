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
import { DeleteConfirm } from '../../components/DeleteConfirm';

import {
    GetAllEmployeesUrl,
    GetEmployeeUrl,
    AddEmployeeUrl,
    UpdateEmployeeUrl,
    DeleteEmployeeUrl,
} from '../../config';
import Axios, {
    axiosRequestConfig,
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
        title: 'Tên tài khoản', field: 'userName',
    },
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
const deleteEmployeeLogMsfHeader = '[Delete Employee Error]';

const validUserNameMessage = 'Tên tài khoản chỉ cho phép chứa các chữ cái a-z A-Z, chữ số 0-9 và kí tự .';
const validPasswordMessage = 'Mật khẩu dài tối thiểu 4 kí tự và không có khoảng trắng';

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

    const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
    const onOpenDeleteConfirm = () => {
        setOpenDeleteConfirm(true);
    };
    const handlCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
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
    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleDone();
        }
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

    const [disabled, setDisabled] = React.useState(false);
    const [loadingDelete, setLoadingDelete] = React.useState(false);
    const [loadingDone, setLoadingDone] = React.useState(false);

    const handleDone = () => {
        if (!values.UserName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên tài khoản!');
            return;
        }
        if (!/^[a-zA-Z0-9\.]+$/.test(values.UserName)) {
            handleSnackbarOption('error', validUserNameMessage);
            return;
        }
        if (!updateMode && !values.Password.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập mật khẩu!');
            return;
        }
        if (values.Password.length > 0 && values.Password.length < 4) {
            handleSnackbarOption('error', 'Độ dài mật khẩu tối thiểu 4 kí tự!');
            return;
        }
        if (values.Password.length > 0 && /\s/.test(values.Password)) {
            handleSnackbarOption('error', 'Mật khẩu không được có khoảng trắng!');
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
        // if (!values.Email.trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập email!');
        //     return;
        // }
        // if (!values.PhoneNumber.trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập số điện thoại!');
        //     return;
        // }

        setDisabled(true);
        setLoadingDone(true);

        if (!updateMode) {
            addUser(values)
        } else {
            const { id } = selectedRow;
            updateUser(id, values);
        }
    };

    const handleDelete = () => {
        const { id } = selectedRow;
        setDisabled(true);
        setLoadingDelete(true);
        deleteUser(id);
        setOpenDeleteConfirm(false);
    };

    const config = axiosRequestConfig();

    const addUser = (userModel) => {
        Axios.post(AddEmployeeUrl, userModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                if (data.message) {
                    handleSnackbarOption('error', `Có lỗi: ${data.message}`);
                }
                else {
                    handleSnackbarOption('success', 'Tạo người dùng mới thành công!');
                    handleReset();
                    refreshData();
                }
            } else {
                handleSnackbarOption('error', 'Có lỗi khi tạo người dùng mới!');
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleError(reason, addEmployeeLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi tạo người dùng mới!');
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateUser = (id, userModel) => {
        const url = `${UpdateEmployeeUrl}/${id}`;
        Axios.put(url, userModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật người dùng thành công!');
                refreshData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật người dùng!');
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleError(reason, updateEmployeeLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật người dùng!');
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const deleteUser = (id) => {
        Axios.delete(`${DeleteEmployeeUrl}/${id}`, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa người dùng thành công!');
                handleReset();
                setSelectedRow(null);
                setUpdateMode(false);
                refreshData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa người dùng!');
            }
            setDisabled(false);
            setLoadingDelete(false);
        }).catch((reason) => {
            handleError(reason, deleteEmployeeLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa người dùng!');
            setDisabled(false);
            setLoadingDelete(false);
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
        setDisabled(true);
        const url = `${GetEmployeeUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { userName, fullName, roleName, phoneNumber, email } = data[0];
                setValues({
                    ...values,
                    UserName: userName,
                    Password: '',
                    FullName: fullName,
                    RoleName: roleName,
                    PhoneNumber: phoneNumber,
                    Email: email,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getEmployeeLogMsfHeader);
            setDisabled(false);
        });
    };

    const getEmployees = (resolve, reject, query) => {
        const value = searchValue;

        setDisabled(true);

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
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getEmployeesLogMsfHeader);
            setDisabled(false);
        });
    };

    return (
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
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
                                        label="Tên tài khoản (*)"
                                        placeholder={validUserNameMessage}
                                        value={values.UserName}
                                        onChange={handleValueChange('UserName')}
                                        onKeyPress={handleKeyPress}
                                        readOnly={updateMode}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="FullName (*)"
                                        label="Họ & Tên"
                                        value={values.FullName}
                                        onChange={handleValueChange('FullName')}
                                        onKeyPress={handleKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Select
                                        fullWidth
                                        id="RoleName"
                                        label="Chức vụ (*)"
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
                                        onKeyPress={handleKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="PhoneNumber"
                                        label="Số điện thoại"
                                        value={values.PhoneNumber}
                                        onChange={handleValueChange('PhoneNumber')}
                                        onKeyPress={handleKeyPress}
                                        maxLength={10}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="Password"
                                        type="password"
                                        label="Mật khẩu"
                                        placeholder={validPasswordMessage}
                                        value={values.Password}
                                        onChange={handleValueChange('Password')}
                                        onKeyPress={handleKeyPress}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                justify="flex-end"
                                style={{ marginTop: 8 }}
                            >
                                {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}> */}
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        color="info"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
                                {
                                    selectedRow &&
                                    // <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                        <Button
                                            fullWidth
                                            disabled={disabled}
                                            loading={loadingDelete}
                                            color="danger"
                                            children="Xóa"
                                            iconName="delete"
                                            onClick={onOpenDeleteConfirm}
                                        />
                                    </Grid>
                                }
                                {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}> */}
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        loading={loadingDone}
                                        color="success"
                                        children={selectedRow ? 'Lưu' : 'Hoàn tất'}
                                        iconName={selectedRow ? 'save' : 'done'}
                                        onClick={handleDone}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
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
            <DeleteConfirm
                open={openDeleteConfirm}
                handleClose={handlCloseDeleteConfirm}
                handleDelete={handleDelete}
            />
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
