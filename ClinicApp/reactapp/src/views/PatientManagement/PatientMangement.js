import React from 'react';
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
import PerfectScrollbar from 'react-perfect-scrollbar';
import BlockUi from 'react-block-ui';
import _ from 'lodash';
import moment from 'moment';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select';
import { Snackbar } from '../../components/Snackbar';
import { DropZone } from '../../components/DropZone';
import { Button } from '../../components/Button';
import { DatePicker } from '../../components/DatePicker';
import { DateTimePicker } from '../../components/DateTimePicker';
import { CheckBox } from '../../components/CheckBox';
import { Label } from '../../components/Label';

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


const genderListOptions = [
    { label: 'Nam', value: 0 },
    { label: 'Nữ', value: 1 },
    { label: 'Khác', value: 2 },
];

const statusListOptions = [
    { label: 'Mới', value: 0 },
    { label: 'Tái khám', value: 1 },
    { label: 'Khám', value: 2 },
];

const doctorListOptions = [
    { label: 'Nguyễn A', value: 'DKC-BS01' },
    { label: 'Nguyễn B', value: 'DKC-BS02' },
    { label: 'Nguyễn C', value: 'DKC-BS03' },
];


let imageList = [];

const patientColumns = [
    {
        title: 'Mã BN', field: 'ID',
    },
    {
        title: 'Họ & Tên', field: 'FullName',
    },
    {
        title: 'Năm sinh', field: 'YearOfBirth', type: 'numeric',
    },
    {
        title: 'Giới tính', field: 'Gender', type: 'numeric',
        cellStyle: { minWidth: 100 },
        filterCellStyle: { marginTop: 0 },
        lookup: { 0: 'Nam', 1: 'Nữ', 2: 'Khác' },
    },
    {
        title: 'Số ĐT', field: 'PhoneNumber',
    },
    {
        title: 'Địa chỉ', field: 'Address',
    },
    {
        title: 'Nghề nghiệp', field: 'Job',
    },
    {
        title: 'Bác sĩ khám', field: 'DoctorID',
        hidden: true,
    },
    {
        title: 'Trạng thái', field: 'StatusID', type: 'numeric',
        hidden: true,
    },
];

const PatientManagement = () => {

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

    const [images, setImages] = React.useState([]);
    const handleFiles = (files) => {
        setImages(files);
    }

    const [values, setValues] = React.useState({
        FullName: '',
        DateOfBirth: null,
        Gender: '',
        HouseNo: '',
        Street: '',
        Ward: '',
        District: '',
        City: '',
        Job: '',
        PhoneNumber: '',
        Email: '',
        AppointmentDate: null,

        HeartBeat: '',
        BloodPresure: '',
        Pulse: '',
        DoctorId: '',
    });
    const handleValueChange = prop => event => {
        setValues({
            ...values,
            [prop]: event.target.value,
        })
    };
    const handleDateoBirthChange = date => {
        setValues({
            ...values,
            DateOfBirth: date,
        });
    };
    const handleAppointmentDateChange = date => {
        setValues({
            ...values,
            AppointmentDate: date,
        });
    };
    const handleAddValue = () => {
        setValues({
            ID: `DKC-BN${moment().format('YYMMDDHHmmss')}`,
            Gender: 0,
            StatusID: 0,
        })
    };

    const [patientData, setPatientData] = React.useState([]);
    const handleSaveValue = () => {
        if (
            !values.ID.trim() || !values.FullName.trim() || !values.YearOfBirth.trim() ||
            !values.PhoneNumber.trim() || !values.Address.trim() || !values.Job.trim() || 
            !values.DoctorID.trim()
        ) {
            handleSnackbarOption('error', 'Vui lòng nhập đầy đủ thông tin vào các ô trên!');
            return;
        }

        if (!_.isNumber(parseInt(values.YearOfBirth)) || !_.isNumber(parseInt(values.PhoneNumber))) {
            handleSnackbarOption('error', 'Vui lòng nhập Số với ô Năm sinh và Số điện thoại!');
            return;
        }

        if (patientData.findIndex(p => p.ID === values.ID) === -1) {
            setPatientData([...patientData, values]);
            handleSnackbarOption('success', 'Thêm mới bệnh nhân thành công!');
        } else {
            patientData.map(p => {
                p.ID === values.ID && Object.assign(p, values)
            });
            setPatientData([ ...patientData ]);
            handleSnackbarOption('info', 'Cập nhật thông tin bệnh nhân thành công!');
        }
    };

    const handleResetValue = () => {
        setValues({
            ID: '',
            FullName: '',
            YearOfBirth: '',
            Gender: 0,
            PhoneNumber: '',
            Address: '',
            Job: '',
            DoctorID: '',
            StatusID: 0,
        });
    };

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setValues({
                ...rowData,
            });
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
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THÔNG TIN BỆNH NHÂN"
                        subheader="Thêm, xóa, cập nhật thông tin bệnh nhân"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography 
                                variant="caption" 
                                component="p" 
                                children="THÔNG TIN BỆNH NHÂN (*)" 
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="FullName"
                                        label="Họ tên BN"
                                        value={values.FullName}
                                        onChange={handleValueChange('FullName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                    <DatePicker
                                        fullWidth
                                        id="DateOfBirth"
                                        label="Ngày, tháng, năm sinh"
                                        value={values.DateOfBirth}
                                        onChange={(date) => handleDateoBirthChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Select
                                        fullWidth
                                        id="Gender"
                                        label="Giới tính"
                                        value={values.Gender}
                                        onChange={handleValueChange('Gender')}
                                        options={genderListOptions}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Typography
                                        variant="caption"
                                        component="p"
                                        children="Địa chỉ: (Ghi theo hộ khẩu thường trú)"
                                    />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                            <TextField
                                                fullWidth
                                                id="HouseNo"
                                                label="Số nhà"
                                                value={values.HouseNo}
                                                onChange={handleValueChange('HouseNo')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                            <TextField
                                                fullWidth
                                                id="Street"
                                                label="Đường/ Ấp (Thôn)"
                                                value={values.Street}
                                                onChange={handleValueChange('Street')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <TextField
                                                fullWidth
                                                id="Ward"
                                                label="Phường (Xã)"
                                                value={values.Ward}
                                                onChange={handleValueChange('Ward')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <TextField
                                                fullWidth
                                                id="District"
                                                label="Quận (Huyện)"
                                                value={values.District}
                                                onChange={handleValueChange('District')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <TextField
                                                fullWidth
                                                id="City"
                                                label="Thành phố (Tỉnh)"
                                                value={values.City}
                                                onChange={handleValueChange('City')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="Job"
                                        label="Nghề nghiệp"
                                        value={values.Job}
                                        onChange={handleValueChange('Job')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="PhoneNumber"
                                        label="Điện thoại"
                                        value={values.PhoneNumber}
                                        onChange={handleValueChange('PhoneNumber')}
                                        maxLength={10}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="Email"
                                        label="Email"
                                        value={values.Email}
                                        onChange={handleValueChange('Email')}
                                    />
                                </Grid>
                            </Grid>
                            <Typography 
                                variant="caption" 
                                component="p" 
                                children="ĐĂNG KÍ KHÁM BỆNH (*)" 
                            />
                            <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <DateTimePicker 
                                        fullWidth
                                        id="AppointmentDate"
                                        label="Ngày giờ hẹn (nếu có)"
                                        value={values.AppointmentDate}
                                        onChange={(date) => handleAppointmentDateChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <CheckBox
                                        label="Khám lần đầu"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <CheckBox
                                        label="Tái khám"
                                    />
                                </Grid>
                                <Grid 
                                    container 
                                    item 
                                    alignItems="center" 
                                    xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <Label label="Cung cấp XQ vùng bệnh:" />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <CheckBox
                                        label="Có"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <CheckBox
                                        label="Không"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <DropZone onDropFile={handleFiles} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    
                                </Grid>
                            </Grid>
                            <Typography 
                                variant="caption" 
                                component="p" 
                                children="* Thực hiện các bước cận lâm sàng:" 
                            />
                            <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <TextField
                                        fullWidth
                                        id="HeartBeat"
                                        label="Nhịp tim"
                                        value={values.HeartBeat}
                                        onChange={handleValueChange('HeartBeat')}
                                        placeholder=".......lần/phút"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <TextField
                                        fullWidth
                                        id="BloodPresure"
                                        label="Huyết áp"
                                        value={values.BloodPresure}
                                        onChange={handleValueChange('BloodPresure')}
                                        placeholder=".../...mmHg"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <TextField
                                        fullWidth
                                        id="Pulse"
                                        label="Mạch"
                                        value={values.Pulse}
                                        onChange={handleValueChange('Pulse')}
                                        placeholder=".......lần/phút"
                                    />
                                </Grid>
                            </Grid>
                            <Typography 
                                variant="caption" 
                                component="p" 
                                children="* Nhân viên hướng dẫn, kiểm tra, tiếp nhận Bệnh" 
                            />
                            <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <Select
                                        fullWidth
                                        id="DoctorId"
                                        label="Bác sĩ khám"
                                        value={values.DoctorId}
                                        options={doctorListOptions}
                                        onChange={handleValueChange('DoctorId')}
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
                                    />
                                </Grid>
                            </Grid>
                        }
                        title="DANH SÁCH BỆNH NHÂN"
                        subheader="Tìm kiếm bệnh nhân"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                customOptions={{
                                    filtering: true,
                                }}
                                columns={patientColumns}
                                data={patientData}
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

export default PatientManagement;
