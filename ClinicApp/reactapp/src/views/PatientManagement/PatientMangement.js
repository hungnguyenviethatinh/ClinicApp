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
import { PatientStatus, GenderEnum, Gender } from '../../constants';
import { SearchInput } from '../../components/SearchInput';
import Axios from '../../common';
import { GetDoctorsUrl } from '../../config';

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


const genderOptions = [
    { label: Gender.Male, value: GenderEnum[Gender.Male] },
    { label: Gender.Female, value: GenderEnum[Gender.Female] },
    { label: Gender.None, value: GenderEnum[Gender.None] },
];

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
        message: '',
    });
    const handleSnackbarOption = (variant, message) => {
        setSnackbarOption({
            variant,
            message,
        });
        setOpenSnackbar(true);
    };

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
        Status: PatientStatus.IsNew,
        XRayImages: [],
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
    const handleUploadXRayImage = images => {
        setValues({
            ...values,
            XRayImages: [...images],
        });
    };

    const handleStatusChange = event => {
        setValues({
            ...values,
            Status: event.target.value,
        });
    };

    const [hasXRay, setHasXRay] = React.useState(false);
    const handleHasXRayChange = event => {
        setHasXRay(!hasXRay);
        if (event.target.value === 'No') {
            setValues({
                ...values,
                XRayImages: [],
            });
        }
    };

    const handleDone = () => {
        if (!values.FullName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập họ tên!');
            return;
        }
        if (!moment(values.DateOfBirth).isValid) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày tháng năm sinh!');
            return;
        }
        if (!values.Gender.toString().trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập giới tính!');
            return;
        }
        if (!values.City.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập thành phố (tỉnh)!');
            return;
        }
        if (!_.isFinite(_.toNumber(values.PhoneNumber))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số điện thoại (hợp lệ)!');
            return;
        }
        if (hasXRay && _.isEmpty(values.XRayImages)) {
            handleSnackbarOption('error', 'Yêu cầu nhập cung cấp XQ!');
            return;
        }
        if (!values.DoctorId.trim()) {
            handleSnackbarOption('error', 'Yêu cầu chọn bác sĩ phụ trách khám!');
            return;
        }

        console.log('values: ', values);
    };

    const [patientData, setPatientData] = React.useState([]);

    const handleReset = () => {
        setValues({
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
            Status: PatientStatus.IsNew,
            XRayImages: [],
            HeartBeat: '',
            BloodPresure: '',
            Pulse: '',
            DoctorId: '',
        });
        setHasXRay(false);
    };

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    };
    const handleSearch = event => {
        event.preventDefault();
        console.log('Search: ', searchValue);
    }

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setValues({
                ...rowData,
            });
        } else {
            setSelectedRow(null);
            handleReset();
        }
    };

    const [doctorOptions, setDoctorOptions] = React.useState([{
        label: '',
        value: '',
    }]);
    const getDoctorOptions = () => {
        Axios.get(GetDoctorsUrl).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [];
                data.map(({ fullName, id }) => options.push({
                    label: fullName,
                    value: id,
                }));
                setDoctorOptions(options);
            }
        }).catch((reason) => {
            console.log(reason);
        });
    };

    React.useEffect(() => {
        getDoctorOptions();
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="PHIẾU GHI THÔNG TIN BỆNH NHÂN"
                        subheader="Tiếp nhận bệnh nhân mới hoặc lấy bệnh nhân từ DANH SÁCH BỆNH NHÂN"
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
                                        options={genderOptions}
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
                                        checked={values.Status === PatientStatus.IsNew}
                                        disabled={values.Status !== PatientStatus.IsNew}
                                        value={PatientStatus.IsNew}
                                        onChange={handleStatusChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <CheckBox
                                        label="Tái khám"
                                        checked={values.Status !== PatientStatus.IsNew}
                                        disabled={values.Status === PatientStatus.IsNew}
                                        value={PatientStatus.IsRechecking}
                                        onChange={handleStatusChange}
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
                                        checked={hasXRay}
                                        value="Yes"
                                        onChange={handleHasXRayChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <CheckBox
                                        label="Không"
                                        checked={!hasXRay}
                                        value="No"
                                        onChange={handleHasXRayChange}
                                    />
                                </Grid>
                                {
                                    hasXRay &&
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <DropZone onDropFile={handleUploadXRayImage} />
                                    </Grid>
                                }
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
                                        label="Bác sĩ phụ trách khám"
                                        value={values.DoctorId}
                                        options={doctorOptions}
                                        onChange={handleValueChange('DoctorId')}
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
                >
                    <CardHeader
                        title="DANH SÁCH BỆNH NHÂN"
                        subheader="Danh sách bệnh nhân đã có dữ liệu trên hệ thống"
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
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        onSearch={handleSearch}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            columns={patientColumns}
                            data={patientData}
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

export default PatientManagement;
