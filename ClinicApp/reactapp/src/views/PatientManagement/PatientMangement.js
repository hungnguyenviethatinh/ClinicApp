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
import { SearchInput } from '../../components/SearchInput';

import _ from 'lodash';
import moment from 'moment';

import Axios, {
    axiosRequestConfig,
} from '../../common';
import {
    PatientStatus,
    GenderEnum,
    Gender,
    PatientStatusEnum,
    IdPrefix,
    ExpiredSessionMsg,
    DataDateTimeFormat,
    AddressSeperator,
} from '../../constants';
import {
    GetDoctorsUrl,
    AddPatientUrl,
    AddHistoryUrl,
    AddXrayUrl,
    GetPatientUrl,
    UpdatePatientUrl,
    UpdateHistoryUrl,
    DeletePatientUrl,
    UpdateXRayUrl,
} from '../../config';
import { encodeId, decodeId } from '../../utils';

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
        title: 'Mã BN', field: 'id', defaultSort: 'asc',
        render: rowData => encodeId(rowData.id, IdPrefix.Patient),
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
        title: 'Số ĐT', field: 'phoneNumber',
    },
    {
        title: 'Địa chỉ', field: 'address',
        render: rowData => _.last(rowData.address.split(AddressSeperator)),
    },
];

const PatientManagement = () => {

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
        Height: '',
        Weight: '',
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
        if (!moment(values.DateOfBirth).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày tháng năm sinh!');
            return;
        }
        if (values.AppointmentDate && !moment(values.AppointmentDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày giờ hẹn hợp lệ (không có để trống)!');
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

        const DateOfBirth = values.DateOfBirth.format(DataDateTimeFormat);
        const Address = [values.HouseNo, values.Street, values.Ward, values.District, values.City].join(AddressSeperator);
        const AppointmentDate = moment(values.AppointmentDate).isValid() ? values.AppointmentDate.format() : null;
        const Status = PatientStatusEnum[values.Status];

        const patientModel = {
            FullName: values.FullName,
            DateOfBirth,
            Gender: values.Gender,
            Address,
            Job: values.Job,
            PhoneNumber: values.PhoneNumber,
            Email: values.Email,
            AppointmentDate,
            Status,
            DoctorId: values.DoctorId,
        };
        if (!updateMode) {
            addPatient(patientModel);
        } else {
            const { id } = selectedRow;
            updatePatient(id, patientModel);
        }
    };

    const config = axiosRequestConfig();

    const addPatient = (patientModel) => {
        Axios.post(AddPatientUrl, patientModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id } = data;
                handleSnackbarOption('success', 'Bệnh nhân được tạo thành công.');
                handleReset();
                refreshData();
                const historyModel = {
                    Height: values.Height,
                    Weight: values.Weight,
                    BloodPresure: values.BloodPresure,
                    Pulse: values.Pulse,
                    IsChecked: false,
                    DoctorId: values.DoctorId,
                    PatientId: id,
                };
                addHistory(historyModel);
            } else {
                console.log('[Add Patient Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi thêm bệnh nhân.');
            }
        }).catch((reason) => {
            console.log('[Add Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi thêm bệnh nhân.');
        });
    };

    const addHistory = (historyModel) => {
        Axios.post(AddHistoryUrl, historyModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id, patientId } = data;
                handleSnackbarOption('success', 'Hồ sơ bệnh nhân được tạo thành công.');
                if (!_.isEmpty(values.XRayImages)) {
                    const xRayModels = [];
                    values.XRayImages.map((xRayImage) => xRayModels.push({
                        Name: xRayImage.name,
                        Data: xRayImage.data,
                        LastModifiedDate: xRayImage.lastModifiedDate,
                        HistoryId: id,
                        PatientId: patientId,
                    }));
                    addXrays(xRayModels);
                }
            } else {
                console.log('[Add History Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi tạo hồ sơ cho bệnh nhân.');
            }
        }).catch((reason) => {
            console.log('[Add History Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi tạo hồ sơ cho bệnh nhân.');
        });
    };

    const addXrays = (xRayModels) => {
        Axios.post(AddXrayUrl, xRayModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Lưu trữ XQ của bệnh nhân thành công.');
            } else {
                console.log('[Add XRays Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi lưu trữ XQ của bệnh nhân.');
            }
        }).catch((reason) => {
            console.log('[Add XRays Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi lưu trữ XQ của bệnh nhân.');
        });
    };

    const updatePatient = (id, patientModel) => {
        Axios.put(`${UpdatePatientUrl}/${id}`, patientModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật thông tin của bệnh nhân thành công.');
                refreshData();
                const historyModel = {
                    Height: values.Height,
                    Weight: values.Weight,
                    BloodPresure: values.BloodPresure,
                    Pulse: values.Pulse,
                    IsChecked: false,
                    DoctorId: values.DoctorId,
                    PatientId: id,
                };
                updateHistory(id, historyModel);
            } else {
                console.log('[Update Patient Reponse] ', reason);
                handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin của bệnh nhân.');
            }
        }).catch((reason) => {
            console.log('[Update Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin của bệnh nhân.');
        });
    };

    const updateHistory = (patientId, historyModel) => {
        Axios.put(`${UpdateHistoryUrl}/${patientId}`, historyModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id, patientId } = data;
                handleSnackbarOption('success', 'Cập nhật hồ sơ bệnh nhân thành công.');
                if (!_.isEmpty(values.XRayImages)) {
                    const xRayModels = [];
                    values.XRayImages.map((xRayImage) => xRayModels.push({
                        Name: xRayImage.name,
                        Data: xRayImage.data,
                        LastModifiedDate: xRayImage.lastModifiedDate,
                        HistoryId: id,
                        PatientId: patientId,
                    }));
                    updateXRays(id, xRayModels);
                }
            } else {
                console.log('[Update History Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi cập nhật hồ sơ của bệnh nhân.');
            }
        }).catch((reason) => {
            console.log('[Update History Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật hồ sơ của bệnh nhân.');
        });
    };

    const updateXRays = (historyId, xRayModels) => {
        Axios.put(`${UpdateXRayUrl}/${historyId}`, xRayModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật XQ của bệnh nhân thành công.');
            } else {
                console.log('[Update XRays Response] ', response);
                handleSnackbarOption('error', 'Cập khi lưu trữ XQ của bệnh nhân.');
            }
        }).catch((reason) => {
            console.log('[Update XRays Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật XQ của bệnh nhân.');
        });
    };

    const handleDelete = () => {
        const { id } = selectedRow;
        deletePatient(id);
    };

    const deletePatient = (id) => {
        Axios.delete(`${DeletePatientUrl}/${id}`, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa bệnh nhân thành công.');
                handleReset();
                setSelectedRow(null);
                setUpdateMode(false);
                refreshData();
            }
        }).catch((reason) => {
            console.log('[Delete Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi xóa bệnh nhân.');
        });
    };

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
            Height: '',
            Weight: '',
            BloodPresure: '',
            Pulse: '',
            DoctorId: '',
        });
        setHasXRay(false);
    };

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value.trim());
    };
    const handleSearch = event => {
        event.preventDefault();
        refreshData();
    };

    const [updateMode, setUpdateMode] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setUpdateMode(true);
            getPatient(rowData.id);
        } else {
            setSelectedRow(null);
            setUpdateMode(false);
            handleReset();
        }
    };

    const [doctorOptions, setDoctorOptions] = React.useState([{
        label: '',
        value: '',
    }]);
    const getDoctorOptions = () => {
        Axios.get(GetDoctorsUrl, config).then((response) => {
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
            console.log('[Get Doctor Options Error] ', reason);
        });
    };

    const getPatient = (id) => {
        const url = `${GetPatientUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    fullName,
                    dateOfBirth,
                    gender,
                    address,
                    job,
                    phoneNumber,
                    email,
                    appointmentDate,
                    status,
                    doctorId
                } = data[0];

                const AppointmentDate = moment(appointmentDate).isValid() ? moment(appointmentDate) : null;
                const DateOfBirth = moment(dateOfBirth).isValid() ? moment(dateOfBirth) : null;
                const Status = [
                    PatientStatus.IsNew,
                    PatientStatus.IsAppointed,
                    PatientStatus.IsChecking,
                    PatientStatus.IsChecked,
                    PatientStatus.IsRechecking][status];
                const Address = address.split(AddressSeperator);

                setValues({
                    FullName: fullName,
                    DateOfBirth,
                    Gender: gender,
                    HouseNo: Address[0],
                    Street: Address[1],
                    Ward: Address[2],
                    District: Address[3],
                    City: Address[4],
                    Job: job,
                    PhoneNumber: phoneNumber,
                    Email: email,
                    AppointmentDate,
                    Status,
                    DoctorId: doctorId,
                    XRayImages: [],
                    Height: '',
                    Weight: '',
                    BloodPresure: '',
                    Pulse: '',
                });
            }
        }).catch((reason) => {
            if (reason.response) {
                const { status } = reason.response;
                if (status === 401) {
                    handleSnackbarOption('error', ExpiredSessionMsg);
                } else if (status === 404) {
                    handleSnackbarOption('error', NotFoundMsg);
                }
            }
            console.log('[Get Patient By Id Error] ', reason);
        });
    };

    const getPatients = (resolve, reject, query) => {
        let value = searchValue.toLowerCase();
        const prefix = IdPrefix.Patient.toLowerCase();
        if (value.startsWith(prefix)) {
            value = decodeId(value, prefix);
        }

        Axios.get(GetPatientUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: value,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { page } = query;
                const { patients, totalCount } = data[0];
                resolve({
                    data: patients,
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
            console.log('[Get Patients Error] ', reason);
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
                    style={{ height: '100%' }}
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
                                        disablePast
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
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        fullWidth
                                        id="Height"
                                        label="Chiều cao"
                                        value={values.Height}
                                        onChange={handleValueChange('Height')}
                                        placeholder=".......cm"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        fullWidth
                                        id="Weight"
                                        label="Cân nặng"
                                        value={values.Weight}
                                        onChange={handleValueChange('Weight')}
                                        placeholder=".......kg"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        fullWidth
                                        id="BloodPresure"
                                        label="Huyết áp"
                                        value={values.BloodPresure}
                                        onChange={handleValueChange('BloodPresure')}
                                        placeholder=".../...mmHg"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
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
                                {
                                    selectedRow &&
                                    <React.Fragment>
                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Button
                                                fullWidth
                                                color="danger"
                                                children="Xóa"
                                                iconName="delete"
                                                onClick={handleDelete}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Button
                                                fullWidth
                                                color="success"
                                                children="Lưu"
                                                iconName="save"
                                                onClick={handleDone}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                }
                                {
                                    !selectedRow &&
                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Button
                                            fullWidth
                                            color="success"
                                            children="Hoàn tất"
                                            iconName="done"
                                            onClick={handleDone}
                                        />
                                    </Grid>
                                }
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
                            tableRef={tableRef}
                            columns={patientColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPatients(resolve, reject, query);
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

export default PatientManagement;
