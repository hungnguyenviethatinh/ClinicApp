import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import moment from 'moment';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select';
import { Snackbar } from '../../components/Snackbar';
import { Button } from '../../components/Button';

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

const employeeColumns = [
    { 
        title: 'Mã nhân viên', field: 'ID',
    },
    {
        title: 'Họ và Tên', field: 'FullName',
    },
    {
        title: 'Chức vụ', field: 'Role',
    },
    {
        title: 'Email', field: 'Email',
    },
    {
        title: 'Số điện thoại', field: 'PhoneNumber',
    },
];

const employees = [
    {
        ID: 'DKC-LT191118194200',
        FullName: 'Lễ tân',
        Role: 'Lễ tân',
        Email: 'letan@gmail.com',
        PhoneNumber: '0989898989',
    },
    { 
        ID: 'DKC-BS01',
        FullName: 'Nguyễn A',
        Role: 'Bác sĩ',
        Email: 'nguyena@gmail.com',
        PhoneNumber: '09999999',
    },
    { 
        ID: 'DKC-BS02',
        FullName: 'Nguyễn B',
        Role: 'Bác sĩ',
        Email: 'nguyenb@gmail.com',
        PhoneNumber: '09999999',
    },
    { 
        ID: 'DKC-BS03',
        FullName: 'Nguyễn C',
        Role: 'Bác sĩ',
        Email: 'nguyenc@gmail.com',
        PhoneNumber: '09999999',
    },
];

const roleListOptions = [
    { label: 'Administrator', value: 'Administrator', },
    { label: 'Bác sĩ', value: 'Bác sĩ', },
    { label: 'Lễ tân', value: 'Lễ tân', },
];

const UserManagement = () => {

    const classes = useStyles();

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const handleSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackbar(false);
	};

	const [snackbarOption, setSnackbarOption] = React.useState({
		variant: 'success',
		message: 'Data loaded successfully!',
	});
	const handleSnackbarOption = (variant, message) => {
		setSnackbarOption({
			variant,
			message,
        });
        setOpenSnackbar(true);
	};

    const [values, setValues] = React.useState({
        ID: '',
        FullName: '',
        Role: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
    });
    const handleValueChange = prop => event => {
        setValues({
            ...values,
            [prop]: event.target.value,
        })
    };

    const [addMode, setAddMode] = React.useState(false);

    const handleAddValue = () => {
        setValues({
            ID: `DKC-NV${moment().format('YYMMDDHHmmss')}`,
        });
        setAddMode(true);
    };

    const [employeeData, setEmployeeData] = React.useState([ ...employees ]);
    const handleSaveValue = () => {
        if (
            addMode && (!values.ID.trim() || !values.FullName.trim() || !values.Email
            || !values.Role || !values.PhoneNumber || !values.Password)
        ) {
            handleSnackbarOption('error', 'Vui lòng nhập đầy đủ thông tin vào các ô trên!');
            return;
        }

        if (
            !addMode && (!values.ID.trim() || !values.FullName.trim() || !values.Email
            || !values.Role || !values.PhoneNumber)
        ) {
            handleSnackbarOption('error', 'Vui lòng nhập đầy đủ thông tin vào các ô trên!');
            return;
        }

        if (!_.isNumber(parseInt(values.PhoneNumber))) {
            handleSnackbarOption('error', 'Vui lòng nhập số điện thoại hợp lệ!');
            return;
        }

        if (employeeData.findIndex(p => p.ID === values.ID) === -1) {
            setEmployeeData([...employeeData, values]);
            handleSnackbarOption('success', 'Thêm mới nhân viên thành công!');
        } else {
            employeeData.map(e => {
                e.ID === values.ID && Object.assign(e, values)
            });
            setEmployeeData([ ...employeeData ]);
            handleSnackbarOption('info', 'Cập nhật thông tin nhân viên thành công!');
        }
    };

    const handleDelete = () => {
        setEmployeeData(employeeData.filter(e => e.ID !== selectedRow.ID));
    };

    const handleResetValue = () => {
        setValues({
            ID: '',
            FullName: '',
            Email: '',
            PhoneNumber: '',
            Password: '',
        });
    };

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setValues({
                ...rowData,
            });
            setAddMode(false);
        } else {
            setSelectedRow(null);
            handleResetValue();
        }
    };

    React.useEffect(() => {
        // console.log('values', values);
        // console.log('images', images);
    });

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THÔNG TIN NHÂN VIÊN"
                        subheader="Thêm, xóa, cập nhật thông tin nhân viên"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        id="ID"
                                        label="Mã Nhân Viên"
                                        value={values.ID}
                                        onChange={handleValueChange('ID')}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="FullName"
                                        label="Họ & Tên"
                                        value={values.FullName}
                                        onChange={handleValueChange('FullName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Select
                                        fullWidth
                                        id="Role"
                                        label="Chức vụ"
                                        value={values.Role}
                                        options={roleListOptions}
                                        onChange={handleValueChange('Role')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        id="Email"
                                        label="Email"
                                        value={values.Email}
                                        onChange={handleValueChange('Email')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        id="PhoneNumber"
                                        label="Số điện thoại"
                                        value={values.PhoneNumber}
                                        onChange={handleValueChange('PhoneNumber')}
                                        maxLength={10}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        id="Password"
                                        type="password"
                                        label="Mật khẩu"
                                        value={values.Password}
                                        onChange={handleValueChange('Password')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                    <Grid container justify="flex-end" spacing={2}>
                                        <Grid item>
                                            <Button
                                                color="info"
                                                children="Đặt lại"
                                                iconName="reset"
                                                onClick={handleResetValue}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                color="primary"
                                                children="Lưu"
                                                iconName="save"
                                                onClick={handleSaveValue}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                color="success"
                                                children="Thêm"
                                                iconName="add"
                                                onClick={handleAddValue}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        action={
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Button
                                        color="danger"
                                        children="Xóa"
                                        iconName="delete"
                                        disabled={selectedRow === null}
                                        onClick={handleDelete}
                                    />
                                </Grid>
                            </Grid>
                        }
                        title="DANH SÁCH NHÂN VIÊN"
                        subheader="Tìm kiếm nhân viên"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                customOptions={{
                                    filtering: true,
                                }}
                                columns={employeeColumns}
                                data={employeeData}
                                onRowClick={handleSelectRow}
                                selectedRow={selectedRow}
                            />
                        </PerfectScrollbar>
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
