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
import { ActionOption } from '../../components/ActionOption';

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
        title: 'Thông tin khác', field: 'additionalInfo',
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
    // [Start] Common
    const classes = useStyles();
    const config = axiosRequestConfig();

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

    // [End] Common.

    // [Start] State declaration and event handlers
    const [disabled, setDisabled] = React.useState(false);
    const [loadingDone, setLoadingDone] = React.useState(false);

    const tableRef = React.useRef(null);
    const refreshData = () => {
        tableRef.current && tableRef.current.onQueryChange();
    };

    const [updateMode, setUpdateMode] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setOpenActionOption(true);
        } else {
            setSelectedRow(null);
            handleReset();
            setUpdateMode(false);
        }
    };

    const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
    const [openActionOption, setOpenActionOption] = React.useState(false);
    const onOpenDeleteConfirm = () => {
        setOpenActionOption(false);
        setOpenDeleteConfirm(true);
    };
    const handleCloseDeleteConfirm = () => {
        setSelectedRow(null);
        setOpenDeleteConfirm(false);
    };
    const handleCloseActionOption = () => {
        setSelectedRow(null);
        setOpenActionOption(false);
    };

    const [values, setValues] = React.useState({
        UserName: '',
        Password: '',
        FullName: '',
        RoleName: '',
        PhoneNumber: '',
        AdditionalInfo: '',
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
        setSearchValue(event.target.value);
    };
    const handleSearch = event => {
        event.preventDefault();
        refreshData();
    };

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

        setDisabled(true);
        setLoadingDone(true);

        if (!updateMode) {
            addUser(values)
        } else {
            const { id } = selectedRow;
            updateUser(id, values);
        }
    };

    const handleUpdate = () => {
        const { id } = selectedRow;
        getEmployee(id);
        setUpdateMode(true);
        setOpenActionOption(false);
    };

    const handleDelete = () => {
        const { id } = selectedRow;
        setDisabled(true);
        deleteUser(id);
        setOpenDeleteConfirm(false);
    };

    const handleReset = () => {
        setValues({
            UserName: '',
            Password: '',
            FullName: '',
            RoleName: '',
            PhoneNumber: '',
            AdditionalInfo: '',
        });
    };

    // [End] State declaration and event handlers.

    // [Start] Api handlers
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
        }).catch((reason) => {
            handleError(reason, deleteEmployeeLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa người dùng!');
            setDisabled(false);
        });
    };

    const getEmployee = (id) => {
        setDisabled(true);
        const url = `${GetEmployeeUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { userName, fullName, roleName, phoneNumber, additionalInfo } = data[0];
                setValues({
                    ...values,
                    UserName: userName,
                    Password: '',
                    FullName: fullName,
                    RoleName: roleName,
                    PhoneNumber: phoneNumber,
                    AdditionalInfo: additionalInfo,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getEmployeeLogMsfHeader);
            setDisabled(false);
        });
    };

    const getEmployees = (resolve, reject, query) => {
        setDisabled(true);

        Axios.get(GetAllEmployeesUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: searchValue,
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

    // [End] Api handlers.

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
                                children="BIỂU MẪU THÊM/SỬA NHÂN VIÊN"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="UserName"
                                        label="Tên tài khoản (*)"
                                        value={values.UserName}
                                        onChange={handleValueChange('UserName')}
                                        onKeyPress={handleKeyPress}
                                        readOnly={updateMode}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="FullName (*)"
                                        label="Họ & Tên"
                                        value={values.FullName}
                                        onChange={handleValueChange('FullName')}
                                        onKeyPress={handleKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Select
                                        fullWidth
                                        id="RoleName"
                                        label="Chức vụ (*)"
                                        value={values.RoleName}
                                        options={roleOptions}
                                        onChange={handleValueChange('RoleName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="AdditionalInfo"
                                        label="Thông tin khác"
                                        value={values.AdditionalInfo}
                                        onChange={handleValueChange('AdditionalInfo')}
                                        onKeyPress={handleKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="Password"
                                        type="password"
                                        label="Mật khẩu"
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
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        color="warning"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
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
                                        placeholder="Nhập tên tài khoản, tên, số điện thoại"
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
                handleClose={handleCloseDeleteConfirm}
                handleDelete={handleDelete}
            />
            <ActionOption
                open={openActionOption}
                handleUpdate={handleUpdate}
                handleDelete={onOpenDeleteConfirm}
                handleClose={handleCloseActionOption}
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
