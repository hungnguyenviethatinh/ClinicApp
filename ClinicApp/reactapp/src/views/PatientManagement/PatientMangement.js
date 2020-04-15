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
import { DeleteConfirm } from '../../components/DeleteConfirm';
import { Autocomplete } from '../../components/Autocomplete';
import { ActionOption } from '../../components/ActionOption';

import PatientPreview from './PatientPreview';

import _ from 'lodash';
import moment from 'moment';

import Axios, { axiosRequestConfig, chromely } from '../../common';
import {
    PatientStatus,
    GenderEnum,
    Gender,
    PatientStatusEnum,
    IdPrefix,
    ExpiredSessionMsg,
    // DataDateTimeFormat,
    AddressSeperator,
    RouteConstants,
    DisplayDateTimeFormat,
} from '../../constants';
import {
    GetDoctorsUrl,
    AddPatientUrl,
    AddHistoryUrl,
    AddXRayUrl,
    GetPatientUrl,
    UpdatePatientUrl,
    UpdateHistoryUrl,
    DeletePatientUrl,
    UpdateXRayUrl,
    AddDoctorsUrl,
    UpdateDoctorsUrl,
    PatientPrintUrl,
} from '../../config';
// import { encodeId, decodeId } from '../../utils';

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
        // render: rowData => encodeId(rowData.id, IdPrefix.Patient),
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
        title: 'Địa chỉ', field: 'address',
        // render: rowData => _.last(rowData.address.split(AddressSeperator)),
    },
];

const PatientManagement = () => {
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

    // [End] Common.

    // [Start] State declaration and event handlers
    const [disabled, setDisabled] = React.useState(false);
    // const [loadingDelete, setLoadingDelete] = React.useState(false);
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
            // setUpdateMode(true);
            // getPatient(rowData.id);
        } else {
            setSelectedRow(null);
            setUpdateMode(false);
            handleReset();
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
        FullName: '',
        // DateOfBirth: null,
        Age: '',
        Gender: '',
        // HouseNo: '',
        // Street: '',
        // Ward: '',
        // District: '',
        // City: '',
        // Job: '',
        Address: '',
        PhoneNumber: '',
        RelativePhoneNumber: '',
        // Email: '',
        AppointmentDate: null,
        CheckedDate: moment(),
        Status: PatientStatus.IsNew,
        XRayImages: [],
        Height: '',
        Weight: '',
        BloodPresure: '',
        Pulse: '',
        // DoctorId: '',
        Other: '',
        Note: '',
        Doctors: [],
    });
    const handleValueChange = prop => event => {
        setValues({
            ...values,
            [prop]: event.target.value,
        })
    };
    const handleSelectDoctorChange = (event, newValue) => {
        if (!_.isEmpty(newValue) && newValue.findIndex(value => value.id === 0) > -1) {
            const doctors = doctorOptions.filter(d => d.id !== 0);
            setValues({
                ...values,
                Doctors: doctors,
            });
        } else {
            setValues({
                ...values,
                Doctors: newValue,
            });
        }
    };
    // const handleDateoBirthChange = date => {
    //     setValues({
    //         ...values,
    //         DateOfBirth: date,
    //     });
    // };
    const handleAppointmentDateChange = date => {
        setValues({
            ...values,
            AppointmentDate: date,
        });
    };
    const handleCheckedDateChange = date => {
        setValues({
            ...values,
            CheckedDate: date,
        })
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

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    };
    const handleSearch = event => {
        event.preventDefault();
        refreshData();
    };

    const [patient, setPatient] = React.useState(null);
    const [openPatientPreview, setOpenPatientPreview] = React.useState(false);
    const handleOpenPatientPreview = () => {
        if (!values.FullName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập họ tên!');
            return;
        }
        // if (!moment(values.DateOfBirth).isValid()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập ngày tháng năm sinh!');
        //     return;
        // }
        if (!_.toString(values.Age).trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tuổi!');
            return;
        }
        if (_.toString(values.Age).trim() && !_.isFinite(_.toNumber(values.Age))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số tuổi!');
            return;
        }
        if (values.AppointmentDate && !moment(values.AppointmentDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày hẹn hợp lệ (không hẹn để trống)!');
            return;
        }
        if (values.AppointmentDate && moment(values.AppointmentDate) <= moment()) {
            handleSnackbarOption('error', 'Ngày hẹn phải sau thời gian hiện tại (không hẹn để trống)!');
            return;
        }
        if (values.CheckedDate && !moment(values.CheckedDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày khám hợp lệ!');
            return;
        }
        if (!_.isFinite(values.Gender)) {
            handleSnackbarOption('error', 'Yêu cầu nhập giới tính!');
            return;
        }
        if (!values.Address.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập địa chỉ!');
            return;
        }
        if (!_.isFinite(_.toNumber(values.PhoneNumber))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số điện thoại (hợp lệ)!');
            return;
        }
        if (!updateMode && !values.Status.trim()) {
            handleSnackbarOption('error', 'Yêu cầu chọn trạng thái cho bệnh nhân!');
            return;
        }
        if (hasXRay && _.isEmpty(values.XRayImages)) {
            handleSnackbarOption('error', 'Yêu cầu nhập cung cấp XQ!');
            return;
        }
        // if (!values.DoctorId.trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu chọn bác sĩ phụ trách khám!');
        //     return;
        // }
        if (_.isEmpty(values.Doctors)) {
            handleSnackbarOption('error', 'Yêu cầu chọn bác sĩ phụ trách khám!');
            return;
        }

        setPatient({
            ...values,
        });
        setOpenPatientPreview(true);
    };
    const handleClosePatientPreview = () => {
        setOpenPatientPreview(false);
    };

    const handleDone = () => {
        // if (!values.FullName.trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập họ tên!');
        //     return;
        // }
        // // if (!moment(values.DateOfBirth).isValid()) {
        // //     handleSnackbarOption('error', 'Yêu cầu nhập ngày tháng năm sinh!');
        // //     return;
        // // }
        // if (!_.toString(values.Age).trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập tuổi!');
        //     return;
        // }
        // if (_.toString(values.Age).trim() && !_.isFinite(_.toNumber(values.Age))) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập số tuổi!');
        //     return;
        // }
        // if (values.AppointmentDate && !moment(values.AppointmentDate).isValid()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập ngày giờ hẹn hợp lệ (không hẹn để trống)!');
        //     return;
        // }
        // if (values.AppointmentDate && moment(values.AppointmentDate) <= moment()) {
        //     handleSnackbarOption('error', 'Ngày giờ hẹn phải sau thời gian hiện tại (không hẹn để trống)!');
        //     return;
        // }
        // if (!_.isFinite(values.Gender)) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập giới tính!');
        //     return;
        // }
        // if (!values.City.trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập thành phố (tỉnh)!');
        //     return;
        // }
        // if (!_.isFinite(_.toNumber(values.PhoneNumber))) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập số điện thoại (hợp lệ)!');
        //     return;
        // }
        // if (!updateMode && !values.Status.trim()) {
        //     handleSnackbarOption('error', 'Yêu cầu chọn trạng thái cho bệnh nhân!');
        //     return;
        // }
        // if (hasXRay && _.isEmpty(values.XRayImages)) {
        //     handleSnackbarOption('error', 'Yêu cầu nhập cung cấp XQ!');
        //     return;
        // }
        // // if (!values.DoctorId.trim()) {
        // //     handleSnackbarOption('error', 'Yêu cầu chọn bác sĩ phụ trách khám!');
        // //     return;
        // // }
        // if (_.isEmpty(values.Doctors)) {
        //     handleSnackbarOption('error', 'Yêu cầu chọn bác sĩ phụ trách khám!');
        //     return;
        // }

        setDisabled(true);
        setLoadingDone(true);

        // const DateOfBirth = values.DateOfBirth.format(DataDateTimeFormat);
        // const Address = [values.HouseNo, values.Street, values.Ward, values.District, values.City].join(AddressSeperator);
        const AppointmentDate = moment(values.AppointmentDate).isValid() ? values.AppointmentDate.format() : null;
        const CheckedDate = moment(values.CheckedDate).isValid() ? values.CheckedDate.format() : moment().format();
        // const Status = values.Status === PatientStatus.IsNew ?
        //     PatientStatusEnum[PatientStatus.IsNew] : PatientStatusEnum[PatientStatus.IsRechecking];
        let Status = PatientStatusEnum[values.Status];
        if (updateMode) {
            if (values.Status !== PatientStatus.IsNew &&
                values.Status !== PatientStatus.IsRechecking &&
                values.Status !== PatientStatus.IsToAddDocs &&
                values.Status !== PatientStatus.IsChecking) {
                Status = PatientStatusEnum[PatientStatus.IsChecked];
            }
        }

        // const IdCode = `${IdPrefix.Patient}: ${moment().format('YYYY/MM')}`;
        const patientModel = {
            IdCode: values.IdCode,
            FullName: values.FullName,
            // DateOfBirth,
            Age: values.Age,
            Gender: values.Gender,
            Address: values.Address,
            // Job: values.Job,
            PhoneNumber: values.PhoneNumber,
            RelativePhoneNumber: values.RelativePhoneNumber,
            // Email: values.Email,
            AppointmentDate,
            CheckedDate,
            Status,
            // DoctorId: values.DoctorId,
        };
        if (!updateMode) {
            addPatient(patientModel);
        } else {
            const { id } = selectedRow;
            updatePatient(id, patientModel);
        }
    };

    const handleUpdate = () => {
        const { id } = selectedRow;
        getPatient(id);
        setUpdateMode(true);
        setOpenActionOption(false);
    };

    const handleDelete = () => {
        const { id } = selectedRow;
        setDisabled(true);
        // setLoadingDelete(true);
        deletePatient(id);
        setOpenDeleteConfirm(false);
    };

    const handleReset = () => {
        setValues({
            FullName: '',
            // DateOfBirth: null,
            Age: '',
            Gender: '',
            // HouseNo: '',
            // Street: '',
            // Ward: '',
            // District: '',
            // City: '',
            // Job: '',
            Address: '',
            PhoneNumber: '',
            RelativePhoneNumber: '',
            // Email: '',
            AppointmentDate: null,
            CheckedDate: moment(),
            Status: PatientStatus.IsNew,
            XRayImages: [],
            Height: '',
            Weight: '',
            BloodPresure: '',
            Pulse: '',
            // DoctorId: '',
            Other: '',
            Note: '',
            Doctors: [],
        });
        setHasXRay(false);
    };

    // [End] State declaration and event handlers

    // [Start] Api handlers
    const addPatient = (patientModel) => {
        Axios.post(AddPatientUrl, patientModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id, idCode, orderNumber } = data;
                handleSnackbarOption('success', 'Bệnh nhân được tạo thành công.');
                const patientPrintModel = {
                    ...patient,
                    Id: id,
                    IdCode: idCode,
                    OrderNumber: orderNumber,
                };
                handleReset();
                refreshData();
                const historyModel = {
                    Height: values.Height,
                    Weight: values.Weight,
                    BloodPresure: values.BloodPresure,
                    Pulse: values.Pulse,
                    Other: values.Other,
                    Note: values.Note,
                    IsChecked: false,
                    // DoctorId: values.DoctorId,
                    PatientId: id,
                };
                addHistory(historyModel, patientPrintModel);
            } else {
                console.log('[Add Patient Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi thêm bệnh nhân.');
                setDisabled(false);
                setLoadingDone(false);
                setOpenPatientPreview(false);
            }
            // setDisabled(false);
            // setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Add Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi thêm bệnh nhân.');
            setDisabled(false);
            setLoadingDone(false);
            setOpenPatientPreview(false);
        });
    };

    const addHistory = (historyModel, patientPrintModel) => {
        Axios.post(AddHistoryUrl, historyModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id, patientId } = data;
                handleSnackbarOption('success', 'Hồ sơ bệnh nhân được tạo thành công.');
                if (!_.isEmpty(values.Doctors)) {
                    const doctorModels = [];
                    values.Doctors.map((doctor) => doctorModels.push({
                        HistoryId: id,
                        PatientId: patientId,
                        DoctorId: doctor.id,
                    }));
                    addDoctors(doctorModels, patientPrintModel);
                }
                if (!_.isEmpty(values.XRayImages)) {
                    const xRayModels = [];
                    values.XRayImages.map((xRayImage) => xRayModels.push({
                        Name: xRayImage.name,
                        Data: xRayImage.data,
                        LastModifiedDate: xRayImage.lastModifiedDate,
                        HistoryId: id,
                        PatientId: patientId,
                    }));
                    addXRays(xRayModels);
                }
            } else {
                console.log('[Add History Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi tạo hồ sơ cho bệnh nhân.');
                setDisabled(false);
                setLoadingDone(false);
                setOpenPatientPreview(false);
            }
            // setDisabled(false);
            // setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Add History Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi tạo hồ sơ cho bệnh nhân.');
            setDisabled(false);
            setLoadingDone(false);
            setOpenPatientPreview(false);
        });
    };

    const addDoctors = (doctorModels, patientPrintModel) => {
        Axios.post(AddDoctorsUrl, doctorModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Add Doctors Success] - Ok.');
                handlePrint(patientPrintModel);
            } else {
                console.log('[Add Doctors Error] ', response);
                handleSnackbarOption('error', 'Có lỗi khi chỉ định Các bác sĩ hội chuẩn khám.');
                setDisabled(false);
                setLoadingDone(false);
                setOpenPatientPreview(false);
            }
            // setDisabled(false);
            // setLoadingDone(false);
            // setOpenPatientPreview(false);
        }).catch((reason) => {
            console.log('[Add Doctors Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi chỉ định Các bác sĩ hội chuẩn khám.');
            setDisabled(false);
            setLoadingDone(false);
            setOpenPatientPreview(false);
        });
    };

    const addXRays = (xRayModels) => {
        Axios.post(AddXRayUrl, xRayModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                // handleSnackbarOption('success', 'Lưu trữ XQ của bệnh nhân thành công.');
                console.log('[Add XRays Success] - OK.');
            } else {
                console.log('[Add XRays Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi lưu trữ XQ của bệnh nhân.');
            }
            // setDisabled(false);
            // setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Add XRays Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi lưu trữ XQ của bệnh nhân.');
            // setDisabled(false);
            // setLoadingDone(false);
        });
    };

    const updatePatient = (id, patientModel) => {
        Axios.put(`${UpdatePatientUrl}/${id}`, patientModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { idCode, orderNumber } = data;
                handleSnackbarOption('success', 'Cập nhật thông tin của bệnh nhân thành công.');
                const patientPrintModel = {
                    ...patient,
                    Id: data.id,
                    IdCode: idCode,
                    OrderNumber: orderNumber,
                };
                refreshData();
                const historyModel = {
                    Height: values.Height,
                    Weight: values.Weight,
                    BloodPresure: values.BloodPresure,
                    Pulse: values.Pulse,
                    Other: values.Other,
                    Note: values.Note,
                    IsChecked: false,
                    // DoctorId: values.DoctorId,
                    PatientId: id,
                };
                updateHistory(id, historyModel, patientPrintModel);
            } else {
                console.log('[Update Patient Reponse] ', reason);
                handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin của bệnh nhân.');
                setDisabled(false);
                setLoadingDone(false);
                setOpenPatientPreview(false);
            }
            // setDisabled(false);
            // setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Update Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin của bệnh nhân.');
            setDisabled(false);
            setLoadingDone(false);
            setOpenPatientPreview(false);
        });
    };

    const updateHistory = (patientId, historyModel, patientPrintModel) => {
        Axios.put(`${UpdateHistoryUrl}/${patientId}`, historyModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id, patientId } = data;
                handleSnackbarOption('success', 'Cập nhật hồ sơ bệnh nhân thành công.');
                if (!_.isEmpty(values.Doctors)) {
                    const doctorModels = [];
                    values.Doctors.map((doctor) => doctorModels.push({
                        HistoryId: id,
                        PatientId: patientId,
                        DoctorId: doctor.id,
                    }));
                    updateDoctors(id, doctorModels, patientPrintModel);
                }
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
                setDisabled(false);
                setLoadingDone(false);
                setOpenPatientPreview(false);
            }
            // setDisabled(false);
            // setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Update History Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật hồ sơ của bệnh nhân.');
            setDisabled(false);
            setLoadingDone(false);
            setOpenPatientPreview(false);
        });
    };

    const updateDoctors = (historyId, doctorModels, patientPrintModel) => {
        Axios.put(`${UpdateDoctorsUrl}/${historyId}`, doctorModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Update Doctors Success] - Ok.');
                handlePrint(patientPrintModel);
            } else {
                console.log('[Update Doctors Error] ', reason);
                handleSnackbarOption('error', 'Có lỗi khi chỉ định Các bác sĩ hội chuẩn khám.');
                setDisabled(false);
                setLoadingDone(false);
                setOpenPatientPreview(false);
            }
            // setDisabled(false);
            // setLoadingDone(false);
            // setOpenPatientPreview(false);
        }).catch((reason) => {
            console.log('[Update Doctors Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi chỉ định Các bác sĩ hội chuẩn khám.');
            setDisabled(false);
            setLoadingDone(false);
            setOpenPatientPreview(false);
        });
    };

    const updateXRays = (historyId, xRayModels) => {
        Axios.put(`${UpdateXRayUrl}/${historyId}`, xRayModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                // handleSnackbarOption('success', 'Cập nhật XQ của bệnh nhân thành công.');
                console.log('[Update XRays Success] - OK.');
            } else {
                console.log('[Update XRays Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi cập nhật XQ của bệnh nhân.');
            }
            // setDisabled(false);
            // setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Update XRays Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật XQ của bệnh nhân.');
            // setDisabled(false);
            // setLoadingDone(false);
        });
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
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa bệnh nhân.');
            }
            setDisabled(false);
            // setLoadingDelete(false);
        }).catch((reason) => {
            console.log('[Delete Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi xóa bệnh nhân.');
            setDisabled(false);
            // setLoadingDelete(false);
        });
    };

    // const [doctorOptions, setDoctorOptions] = React.useState([{
    //     label: '',
    //     value: '',
    // }]);
    const [doctorOptions, setDoctorOptions] = React.useState([{
        id: '',
        fullName: '',
    }]);
    const getOptionLabel = (option) => option.fullName;
    const getDoctorOptions = () => {
        setDisabled(true);
        Axios.get(GetDoctorsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [{
                    id: 0,
                    fullName: 'Tất cả bác sĩ',
                }];
                data.map(({ id, fullName }) => options.push({
                    id,
                    fullName,
                }));
                setDoctorOptions(options);
                // setDoctorOptions(data.map(({ id, fullName }) => ({ id, fullName })));
            }
            setDisabled(false);
        }).catch((reason) => {
            console.log('[Get Doctor Options Error] ', reason);
            setDisabled(false);
        });
    };

    const getPatient = (id) => {
        setDisabled(true);
        const url = `${GetPatientUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    fullName,
                    // dateOfBirth,
                    age,
                    gender,
                    address,
                    // job,
                    phoneNumber,
                    relativePhoneNumber,
                    // email,
                    appointmentDate,
                    checkedDate,
                    status,
                    // doctorId
                } = data[0];

                // const AppointmentDate = moment(appointmentDate).isValid() ? moment(appointmentDate) : null;
                // const DateOfBirth = moment(dateOfBirth).isValid() ? moment(dateOfBirth) : null;
                const Status = [
                    PatientStatus.IsNew,
                    PatientStatus.IsAppointed,
                    PatientStatus.IsChecking,
                    PatientStatus.IsChecked,
                    PatientStatus.IsRechecking,
                    PatientStatus.IsToAddDocs,][status];
                // const Address = address.split(AddressSeperator);
                let AppointmentDate = null;
                if (moment(appointmentDate).isValid()) {
                    if (Status !== PatientStatus.IsChecked || moment(appointmentDate) > moment()) {
                        AppointmentDate = moment(appointmentDate);
                    }
                }
                let CheckedDate = null;
                if (moment(checkedDate).isValid()) {
                    CheckedDate = moment(checkedDate);
                }

                setValues({
                    FullName: fullName,
                    // DateOfBirth,
                    Age: age,
                    Gender: gender,
                    // HouseNo: Address[0],
                    // Street: Address[1],
                    // Ward: Address[2],
                    // District: Address[3],
                    // City: Address[4],
                    // Job: job,
                    Address: address,
                    PhoneNumber: phoneNumber,
                    RelativePhoneNumber: relativePhoneNumber,
                    // Email: email,
                    AppointmentDate,
                    CheckedDate,
                    Status,
                    // DoctorId: doctorId,
                    XRayImages: [],
                    Height: '',
                    Weight: '',
                    BloodPresure: '',
                    Pulse: '',
                    Other: '',
                    Note: '',
                    Doctors: [],
                });
            }
            setDisabled(false);
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
            setDisabled(false);
        });
    };

    const getPatients = (resolve, reject, query) => {
        // setDisabled(true);
        // let value = searchValue.toLowerCase();
        // const prefix = IdPrefix.Patient.toLowerCase();
        // if (value.startsWith(prefix)) {
        //     value = decodeId(value, prefix);
        // }

        Axios.get(GetPatientUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                // query: value,
                query: searchValue,
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
            // setDisabled(false);
        }).catch((reason) => {
            if (reason.response) {
                const { status } = reason.response;
                if (status === 401) {
                    handleSnackbarOption('error', ExpiredSessionMsg);
                }
            }
            console.log('[Get Patients Error] ', reason);
            // setDisabled(false);
        });
    };

    // [End] Api handlers.

    // [Start] Print handler
    const handlePrint = (patientPrintModel) => {
        const {
            Id,
            IdCode,
            OrderNumber,
            FullName,
            // DateOfBirth: null,
            Age,
            // Gender,
            // HouseNo,
            // Street,
            // Ward,
            // District,
            // City,
            Address,
            PhoneNumber,
            RelativePhoneNumber,
            Status,
            Height,
            Weight,
            BloodPresure,
            Pulse,
            Other,
            Note,
            // Doctors,
        } = patientPrintModel;

        // const Address = [HouseNo, Street, Ward, District, City].join(`${AddressSeperator} `);
        const AppointmentDate = moment(patient.AppointmentDate).isValid() ? patient.AppointmentDate.format(DisplayDateTimeFormat) : null;
        const Doctors = [];
        if (!_.isEmpty(patient.Doctors)) {
            patient.Doctors.map(({ fullName }) => Doctors.push({
                FullName: fullName,
            }));
        }
        const data = JSON.stringify({
            Id,
            IdCode,
            OrderNumber,
            FullName,
            // DateOfBirth: null,
            Age: _.toNumber(Age),
            Gender: [Gender.None, Gender.Male, Gender.Female][patient.Gender],
            Address,
            PhoneNumber,
            RelativePhoneNumber,
            AppointmentDate,
            Status,
            Height,
            Weight,
            BloodPresure,
            Pulse,
            Other,
            Note,
            Doctors,
        });

        console.log(JSON.parse(data));

        chromely.post(PatientPrintUrl, null, data, response => {
            const { ResponseText } = response;
            const { ReadyState, Status, Data } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                const { Message } = Data;
                console.log(`[Print Patient Success] - ${Message}`);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in phiếu tiếp nhận bệnh nhân!');
                console.log('[Print Patient Error] - An error occurs during message routing. With url: '
                    + PatientPrintUrl
                    + '. Response received: ', response);
            }
            setDisabled(false);
            setLoadingDone(false);
            setOpenPatientPreview(false);
        });
    };

    // [End] Print handler

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
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                alignItems="center"
                                style={{ marginBottom: 8 }}
                            >
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
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    {/* <DatePicker
                                        fullWidth
                                        id="DateOfBirth"
                                        label="Ngày, tháng, năm sinh"
                                        value={values.DateOfBirth}
                                        onChange={(date) => handleDateoBirthChange(date)}
                                    /> */}
                                    <TextField
                                        fullWidth
                                        id="Age"
                                        label="Tuổi"
                                        value={values.Age}
                                        onChange={handleValueChange('Age')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Select
                                        fullWidth
                                        style={{ marginTop: 0, marginBottom: 0 }}
                                        id="Gender"
                                        label="Giới tính"
                                        value={values.Gender}
                                        onChange={handleValueChange('Gender')}
                                        options={genderOptions}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        id="IdCode"
                                        label="Mã BN"
                                        value={values.IdCode}
                                        onChange={handleValueChange('IdCode')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    {/* <DateTimePicker */}
                                    <DatePicker
                                        fullWidth
                                        id="CheckedDate"
                                        label="Ngày khám"
                                        value={values.CheckedDate}
                                        onChange={(date) => handleCheckedDateChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Typography
                                        variant="caption"
                                        component="p"
                                        children="Địa chỉ: (Ghi theo hộ khẩu thường trú)"
                                    />
                                    <Grid container spacing={2}>
                                        {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
                                        </Grid> */}
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <TextField
                                                fullWidth
                                                id="Address"
                                                label="Địa chỉ"
                                                value={values.Address}
                                                onChange={handleValueChange('Address')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="Job"
                                        label="Nghề nghiệp"
                                        value={values.Job}
                                        onChange={handleValueChange('Job')}
                                    />
                                </Grid> */}
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
                                {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="Email"
                                        label="Email"
                                        value={values.Email}
                                        onChange={handleValueChange('Email')}
                                    />
                                </Grid> */}
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="RelativePhoneNumber"
                                        label="Số điện thoại người thân"
                                        value={values.RelativePhoneNumber}
                                        onChange={handleValueChange('RelativePhoneNumber')}
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
                                    {/* <DateTimePicker */}
                                    <DatePicker
                                        fullWidth
                                        id="AppointmentDate"
                                        label="Ngày hẹn (nếu có)"
                                        value={values.AppointmentDate}
                                        onChange={(date) => handleAppointmentDateChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <CheckBox
                                        label="Khám lần đầu"
                                        checked={values.Status === PatientStatus.IsNew}
                                        // disabled={values.Status !== PatientStatus.IsNew}
                                        disabled={values.Status === PatientStatus.IsChecking}
                                        value={PatientStatus.IsNew}
                                        onChange={handleStatusChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <CheckBox
                                        label="Tái khám"
                                        // checked={values.Status !== PatientStatus.IsNew}
                                        checked={values.Status === PatientStatus.IsRechecking}
                                        // disabled={values.Status === PatientStatus.IsNew}
                                        disabled={values.Status === PatientStatus.IsChecking}
                                        value={PatientStatus.IsRechecking}
                                        onChange={handleStatusChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <CheckBox
                                        label="BS Hồ sơ"
                                        checked={values.Status === PatientStatus.IsToAddDocs}
                                        disabled={values.Status === PatientStatus.IsChecking}
                                        value={PatientStatus.IsToAddDocs}
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
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <TextField
                                        fullWidth
                                        id="Other"
                                        label="Thông tin khác"
                                        value={values.Other}
                                        onChange={handleValueChange('Other')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <TextField
                                        fullWidth
                                        id="Note"
                                        label="Ghi chú"
                                        value={values.Note}
                                        onChange={handleValueChange('Note')}
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
                                    {/* <Select
                                        fullWidth
                                        id="DoctorId"
                                        label="Bác sĩ phụ trách khám"
                                        value={values.DoctorId}
                                        options={doctorOptions}
                                        onChange={handleValueChange('DoctorId')}
                                    /> */}
                                    <Autocomplete
                                        fullWidth
                                        multiple
                                        id="Doctors"
                                        label="Các bác sĩ hội chuẩn khám"
                                        options={doctorOptions}
                                        getOptionLabel={getOptionLabel}
                                        value={values.Doctors}
                                        onChange={handleSelectDoctorChange}
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
                                        disabled={disabled}
                                        color="warning"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        loading={loadingDone}
                                        color="success"
                                        children={selectedRow ? 'Lưu' : 'Hoàn tất'}
                                        iconName={selectedRow ? 'save' : 'done'}
                                        // onClick={handleDone}
                                        onClick={handleOpenPatientPreview}
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
                        // action={
                        //     <React.Fragment>
                        //         {
                        //             selectedRow &&
                        //             <Button
                        //                 color="danger"
                        //                 children="Xóa"
                        //                 iconName="delete"
                        //                 onClick={onOpenDeleteConfirm}
                        //                 disabled={disabled}
                        //                 loading={loadingDelete}
                        //             />
                        //         }
                        //     </React.Fragment>
                        // }
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
                                        placeholder="Nhập mã bệnh nhân, tên hoặc sđt của bệnh nhân"
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
            <PatientPreview
                disabled={disabled}
                loading={loadingDone}
                open={openPatientPreview}
                patient={patient}
                handleCancel={handleClosePatientPreview}
                handleSave={handleDone}
            />
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

export default PatientManagement;
