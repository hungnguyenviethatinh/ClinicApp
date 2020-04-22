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
    IconButton,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { Close } from '@material-ui/icons';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select';
import { Snackbar } from '../../components/Snackbar';
import { DropZone } from '../../components/DropZone';
import { Button } from '../../components/Button';
import { DatePicker } from '../../components/DatePicker';
import { CheckBox } from '../../components/CheckBox';
import { Label } from '../../components/Label';
import { SearchInput } from '../../components/SearchInput';
import { DeleteConfirm } from '../../components/DeleteConfirm';
import { Autocomplete } from '../../components/Autocomplete';
import { ActionOption } from '../../components/ActionOption';

import { PatientPreview } from './PatientPreview';

import _ from 'lodash';
import moment from 'moment';

import Axios, { axiosRequestConfig, ChromeLyService } from '../../common';
import {
    PatientStatus,
    GenderEnum,
    Gender,
    PatientStatusEnum,
    ExpiredSessionMsg,
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
    DeleteXRayUrl,
    UpdateXRayUrl,
    AddDoctorsUrl,
    UpdateDoctorsUrl,
    PatientPrintUrl,
    GetHistoryUrl,
    PatientCurrentHistoryUrl,
} from '../../config';

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
    thumbContainer: {
        width: '100%',
        margin: 0,
    },
    thumb: {
        border: '1px solid rgba(63,63,68,0.05)',
    },
    img: {
        width: '100%',
        height: 150,
        objectFit: 'contain',
    },
    clearButton: {
        padding: 0,
    },
}));

const genderOptions = [
    { label: Gender.Male, value: GenderEnum[Gender.Male] },
    { label: Gender.Female, value: GenderEnum[Gender.Female] },
    { label: Gender.None, value: GenderEnum[Gender.None] },
];

const patientColumns = [
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
    const [loadingDone, setLoadingDone] = React.useState(false);
    const [disabledPrint, setDisabledPrint] = React.useState(false);
    const [loadingPrint, setLoadingPrint] = React.useState(false);

    const tableRef = React.useRef(null);
    const refreshData = () => {
        tableRef.current && tableRef.current.onQueryChange();
    };

    const [externalUpdateMode, setExternalUpdateMode] = React.useState(false);
    const [_patientId, setPatientId] = React.useState(null);
    const [_historyId, setHistoryId] = React.useState(null);
    const handleUpdatePatientHistory = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('pId') && urlParams.has('hId')) {
            const pId = urlParams.get('pId');
            const hId = urlParams.get('hId');
            setExternalUpdateMode(true);
            setPatientId(pId);
            setHistoryId(hId);
        }
    };

    const [updateMode, setUpdateMode] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setOpenActionOption(true);
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

    const [patient, setPatient] = React.useState({
        IdCode: '',
        FullName: '',
        Age: '',
        Address: '',
        Gender: '',
        PhoneNumber: '',
        RelativePhoneNumber: '',
        AppointmentDate: null,
        CheckedDate: moment(),
        Status: PatientStatus.IsNew,
    });
    const [history, setHistory] = React.useState({
        Height: '',
        Weight: '',
        BloodPressure: '',
        Pulse: '',
        Other: '',
        Note: '',
        CheckedDate: moment(),
        IsChecked: false,
        PatientId: '',
    });
    const [_xRayImages, setXRayImages] = React.useState([]);
    const [_doctors, setDoctors] = React.useState([]);
    const [patientPreview, setPatientPreview] = React.useState({
        ...patient,
        ...history,
        Doctors: _doctors,
        XRayImages: _xRayImages,
    });
    const handlePatientChange = prop => event => {
        setPatient({
            ...patient,
            [prop]: event.target.value,
        });
    };
    const handleHistoryChange = prop => event => {
        setHistory({
            ...history,
            [prop]: event.target.value,
        });
    };
    const handleSelectDoctorChange = (event, newValue) => {
        if (!_.isEmpty(newValue) && newValue.findIndex(value => value.id === 0) > -1) {
            const doctors = doctorOptions.filter(d => d.id !== 0);
            setDoctors(doctors);
        } else {
            setDoctors(newValue);
        }
    };
    const handleAppointmentDateChange = date => {
        setPatient({
            ...patient,
            AppointmentDate: date,
        });
    };
    const handleCheckedDateChange = date => {
        setPatient({
            ...patient,
            CheckedDate: date,
        });
    };

    const handleUploadXRayImage = images => {
        setXRayImages(images);
    };

    const clearXRayImage = (xRayImage) => {
        const restOfFiles = _.remove(_xRayImages, (image) => image.name !== xRayImage.name);
        setXRayImages(restOfFiles);
    };

    const handleStatusChange = event => {
        setPatient({
            ...patient,
            Status: event.target.value,
        });
    };

    const [hasXRay, setHasXRay] = React.useState(false);
    const handleHasXRayChange = event => {
        setHasXRay(!hasXRay);
    };

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    };
    const handleSearch = event => {
        event.preventDefault();
        refreshData();
    };

    const [openPatientPreview, setOpenPatientPreview] = React.useState(false);
    const handleOpenPatientPreview = () => {
        if (!patient.IdCode.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập mã bệnh nhân!');
            return;
        }
        if (!patient.CheckedDate) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày khám!');
            return;
        }
        if (patient.CheckedDate && !moment(patient.CheckedDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày khám hợp lệ!');
            return;
        }
        if (!patient.FullName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập họ tên!');
            return;
        }
        if (!_.toString(patient.Age).trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tuổi!');
            return;
        }
        if (_.toString(patient.Age).trim() && !_.isFinite(_.toNumber(patient.Age))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số tuổi!');
            return;
        }
        if (patient.AppointmentDate && !moment(patient.AppointmentDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày hẹn hợp lệ (không hẹn để trống)!');
            return;
        }
        if (patient.AppointmentDate && moment(patient.AppointmentDate) <= moment()) {
            handleSnackbarOption('error', 'Ngày hẹn phải sau thời gian hiện tại (không hẹn để trống)!');
            return;
        }
        if (patient.CheckedDate && !moment(patient.CheckedDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày khám hợp lệ!');
            return;
        }
        if (!_.isFinite(patient.Gender)) {
            handleSnackbarOption('error', 'Yêu cầu nhập giới tính!');
            return;
        }
        if (!patient.Address.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập địa chỉ!');
            return;
        }
        if (!_.isFinite(_.toNumber(patient.PhoneNumber))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số điện thoại (hợp lệ)!');
            return;
        }
        if (!updateMode && !patient.Status.trim()) {
            handleSnackbarOption('error', 'Yêu cầu chọn trạng thái cho bệnh nhân!');
            return;
        }
        if (hasXRay && _.isEmpty(_xRayImages)) {
            handleSnackbarOption('error', 'Yêu cầu nhập cung cấp XQ!');
            return;
        }
        if (_.isEmpty(_doctors)) {
            handleSnackbarOption('error', 'Yêu cầu chọn bác sĩ phụ trách khám!');
            return;
        }

        setPatientPreview({
            ...patient,
            ...history,
            Doctors: _doctors,
            XRayImages: _xRayImages,
        });
        setDisabledPrint(true);
        setOpenPatientPreview(true);
    };
    const handleClosePatientPreview = () => {
        setOpenPatientPreview(false);
    };

    const handleDone = () => {
        setDisabled(true);
        setLoadingDone(true);

        const AppointmentDate = moment(patient.AppointmentDate).isValid() ? patient.AppointmentDate.format() : null;
        const CheckedDate = moment(patient.CheckedDate).isValid() ? patient.CheckedDate.format() : moment().format();

        let Status = PatientStatusEnum[patient.Status];
        if (updateMode) {
            if (patient.Status !== PatientStatus.IsNew &&
                patient.Status !== PatientStatus.IsRechecking &&
                patient.Status !== PatientStatus.IsToAddDocs &&
                patient.Status !== PatientStatus.IsChecking) {
                Status = PatientStatusEnum[PatientStatus.IsChecked];
            }
        }

        const patientModel = {
            ...patient,
            AppointmentDate,
            CheckedDate,
            Status,
        };

        if (!updateMode && !externalUpdateMode) {
            addPatient(patientModel);
            return;
        }
        if (updateMode) {
            const { id } = selectedRow;
            updatePatient(id, patientModel);
            return;
        }
        if (externalUpdateMode) {
            updatePatient(_patientId, patientModel);
            return;
        }
    };

    const handleUpdate = () => {
        setUpdateMode(true);
        setOpenActionOption(false);

        if (externalUpdateMode) {
            handleReset();
            setExternalUpdateMode(false);
        }
    };

    const handleDelete = () => {
        const { id } = selectedRow;
        deletePatient(id);

        setDisabled(true);
        setOpenDeleteConfirm(false);
    };

    const handleReset = () => {
        setPatient({
            IdCode: '',
            FullName: '',
            Age: '',
            Address: '',
            Gender: '',
            PhoneNumber: '',
            RelativePhoneNumber: '',
            AppointmentDate: null,
            CheckedDate: moment(),
            Status: PatientStatus.IsNew,
        });
        setHistory({
            Height: '',
            Weight: '',
            BloodPressure: '',
            Pulse: '',
            Other: '',
            Note: '',
            CheckedDate: moment(),
            IsChecked: false,
            PatientId: '',
        });
        setXRayImages([]);
        setDoctors([]);
        setHasXRay(false);
    };

    // [End] State declaration and event handlers

    // [Start] Api handlers
    const addPatient = (patientModel) => {
        Axios.post(AddPatientUrl, patientModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id, orderNumber } = data;
                handleSnackbarOption('success', 'Bệnh nhân được tạo thành công.');
                handleReset();
                refreshData();
                setPrintData({
                    ...patient,
                    ...history,
                    Id: id,
                    OrderNumber: orderNumber,
                    Doctors: _doctors,
                });

                const CheckedDate = moment(patient.CheckedDate).isValid() ? patient.CheckedDate.format() : moment().format();
                const historyModel = {
                    ...history,
                    CheckedDate,
                    IsChecked: history.IsChecked,
                    PatientId: id,
                };
                addHistory(historyModel);
            } else {
                console.log('[Add Patient Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi thêm bệnh nhân.');

                setDisabled(false);
                setLoadingDone(false);
            }
        }).catch((reason) => {
            console.log('[Add Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi thêm bệnh nhân.');

            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const addHistory = (historyModel) => {
        Axios.post(AddHistoryUrl, historyModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id, patientId } = data;
                handleSnackbarOption('success', 'Hồ sơ bệnh nhân được tạo thành công.');
                if (!_.isEmpty(_doctors)) {
                    const doctorModels = [];
                    _doctors.map((doctor) => doctorModels.push({
                        HistoryId: id,
                        PatientId: patientId,
                        DoctorId: doctor.id,
                    }));
                    addDoctors(doctorModels);
                }
                if (hasXRay && !_.isEmpty(_xRayImages)) {
                    const xRayModels = [];
                    _xRayImages.map(({ name, data, lastModifiedDate }) => xRayModels.push({
                        Name: name,
                        Data: data,
                        LastModifiedDate: lastModifiedDate,
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
            }
        }).catch((reason) => {
            console.log('[Add History Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi tạo hồ sơ cho bệnh nhân.');
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const addDoctors = (doctorModels) => {
        Axios.post(AddDoctorsUrl, doctorModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Add Doctors Success] - Ok.');
            } else {
                console.log('[Add Doctors Error] ', response);
                handleSnackbarOption('error', 'Có lỗi khi chỉ định Các bác sĩ hội chuẩn khám.');
            }
            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Add Doctors Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi chỉ định Các bác sĩ hội chuẩn khám.');
            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        });
    };

    const addXRays = (xRayModels) => {
        Axios.post(AddXRayUrl, xRayModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Lưu trữ hình ảnh X Quang thành công.');
            } else {
                console.log('[Add XRays Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi lưu trữ hình ảnh X Quang.');
            }
            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Add XRays Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi lưu trữ hình ảnh XQuang.');
            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        });
    };

    const updatePatient = (id, patientModel) => {
        const url = `${UpdatePatientUrl}/${id}`;
        Axios.put(url, patientModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { orderNumber } = data;
                handleSnackbarOption('success', 'Cập nhật thông tin của bệnh nhân thành công.');
                refreshData();
                setPrintData({
                    ...patient,
                    ...history,
                    Id: data.id,
                    OrderNumber: orderNumber,
                    Doctors: _doctors,
                });

                const CheckedDate = moment(patient.CheckedDate).isValid() ? patient.CheckedDate.format() : moment().format();
                const historyModel = {
                    ...history,
                    CheckedDate,
                    IsChecked: history.IsChecked,
                    PatientId: id,
                };
                updateHistory(id, historyModel);
            } else {
                console.log('[Update Patient Reponse] ', response);
                handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin của bệnh nhân.');

                setDisabled(false);
                setLoadingDone(false);
            }
        }).catch((reason) => {
            console.log('[Update Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin của bệnh nhân.');

            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateHistory = (id, historyModel) => {
        const url = `${UpdateHistoryUrl}/${id}`;
        Axios.put(url, historyModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id, patientId } = data;
                handleSnackbarOption('success', 'Cập nhật hồ sơ bệnh nhân thành công.');
                if (!_.isEmpty(_doctors)) {
                    const doctorModels = [];
                    _doctors.map((doctor) => doctorModels.push({
                        HistoryId: id,
                        PatientId: patientId,
                        DoctorId: doctor.id,
                    }));
                    updateDoctors(id, doctorModels);
                }
                if (hasXRay && !_.isEmpty(_xRayImages)) {
                    const xRayModels = [];
                    _xRayImages.map(({ name, data, lastModifiedDate }) => xRayModels.push({
                        Name: name,
                        Data: data,
                        LastModifiedDate: lastModifiedDate,
                        HistoryId: id,
                        PatientId: patientId,
                    }));
                    updateXRays(id, xRayModels);
                } else {
                    deleteXRays(id);
                }
            } else {
                console.log('[Update History Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi cập nhật hồ sơ của bệnh nhân.');
                setDisabled(false);
                setLoadingDone(false);
            }
        }).catch((reason) => {
            console.log('[Update History Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật hồ sơ của bệnh nhân.');
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateDoctors = (historyId, doctorModels) => {
        const url = `${UpdateDoctorsUrl}/${historyId}`;
        Axios.put(url, doctorModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Update Doctors Success] - Ok.');
            } else {
                console.log('[Update Doctors Error] ', response);
                handleSnackbarOption('error', 'Có lỗi khi chỉ định Các bác sĩ hội chuẩn khám.');
            }

            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Update Doctors Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi chỉ định Các bác sĩ hội chuẩn khám.');

            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        });
    };

    const updateXRays = (historyId, xRayModels) => {
        const url = `${UpdateXRayUrl}/${historyId}`;
        Axios.put(url, xRayModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật hình ảnh X Quang thành công.');
                console.log('[Update XRays Success] - OK.');
            } else {
                console.log('[Update XRays Response] ', response);
                handleSnackbarOption('warning', 'Cập nhật hình ảnh X Quang không thành công.');
            }

            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Update XRays Error] ', reason);
            handleSnackbarOption('warning', 'Cập nhật hình ảnh X Quang không thành công.');

            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        });
    };

    const deletePatient = (id) => {
        const url = `${DeletePatientUrl}/${id}`;
        Axios.delete(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa bệnh nhân thành công.');
                handleReset();
                refreshData();

                setSelectedRow(null);
                setUpdateMode(false);
            } else {
                console.log('[Delete Patient Response] ', response);
                handleSnackbarOption('error', 'Có lỗi khi xóa bệnh nhân.');
            }

            setDisabled(false);
        }).catch((reason) => {
            console.log('[Delete Patient Error] ', reason);
            handleSnackbarOption('error', 'Có lỗi khi xóa bệnh nhân.');

            setDisabled(false);
        });
    };

    const deleteXRays = (historyId) => {
        const url = `${DeleteXRayUrl}/${historyId}`;
        Axios.delete(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật hình ảnh X Quang thành công.');
                console.log('[Delete XRays Success] - OK.');
            } else {
                console.log('[Delete XRays Response] ', response);
                handleSnackbarOption('warning', 'Cập nhật hình ảnh X Quang không thành công.');
            }

            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        }).catch((reason) => {
            console.log('[Delete XRays Error] ', reason);
            handleSnackbarOption('warning', 'Cập nhật hình ảnh X Quang không thành công.');

            setDisabled(false);
            setDisabledPrint(false);
            setLoadingDone(false);
        });
    };

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
                    idCode,
                    fullName,
                    age,
                    gender,
                    address,
                    phoneNumber,
                    relativePhoneNumber,
                    appointmentDate,
                    checkedDate,
                    status,
                } = data[0];

                const Status = [
                    PatientStatus.IsNew,
                    PatientStatus.IsAppointed,
                    PatientStatus.IsChecking,
                    PatientStatus.IsChecked,
                    PatientStatus.IsRechecking,
                    PatientStatus.IsToAddDocs][status];
                const AppointmentDate =
                    moment(appointmentDate).isValid() &&
                        (Status !== PatientStatus.IsChecked || moment(appointmentDate) > moment())
                        ? moment(appointmentDate) : null;
                const CheckedDate = moment(checkedDate).isValid() ? moment(checkedDate) : null;

                setPatient({
                    ...patient,
                    IdCode: idCode,
                    FullName: fullName,
                    Age: age,
                    Gender: gender,
                    Address: address,
                    PhoneNumber: phoneNumber,
                    RelativePhoneNumber: relativePhoneNumber,
                    AppointmentDate,
                    CheckedDate,
                    Status,
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

    const getHistory = (historyId) => {
        const url = `${GetHistoryUrl}/${historyId}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    height,
                    weight,
                    bloodPressure,
                    pulse,
                    other,
                    note,
                    doctors,
                    xRayImages,
                } = data[0];
                const Doctors = [];
                if (!_.isEmpty(doctors)) {
                    doctors.map(({ doctor }) => Doctors.push({
                        id: doctor.id,
                        fullName: doctor.fullName,
                    }));
                }
                setDoctors(Doctors);
                const XRayImages = [];
                if (!_.isEmpty(xRayImages)) {
                    xRayImages.map(({ name, data, lastModifiedDate }) => XRayImages.push({
                        name,
                        data,
                        lastModifiedDate,
                    }));
                    setHasXRay(true);
                }
                setXRayImages(XRayImages);
                setHistory({
                    ...history,
                    Height: height,
                    Weight: weight,
                    BloodPressure: bloodPressure,
                    Pulse: pulse,
                    Other: other,
                    Note: note,
                });
            }
        }).catch((reason) => {
            console.log('[Get History Error] ', reason);
        });
    };

    const getCurrentHistory = (id) => {
        const url = `${PatientCurrentHistoryUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    height,
                    weight,
                    bloodPressure,
                    pulse,
                    other,
                    note,
                    doctors,
                    xRayImages,
                } = data[0];
                const Doctors = [];
                if (!_.isEmpty(doctors)) {
                    doctors.map(({ doctor }) => Doctors.push({
                        id: doctor.id,
                        fullName: doctor.fullName,
                    }));
                }
                setDoctors(Doctors);
                const XRayImages = [];
                if (!_.isEmpty(xRayImages)) {
                    xRayImages.map(({ name, data, lastModifiedDate }) => XRayImages.push({
                        name,
                        data,
                        lastModifiedDate,
                    }));
                    setHasXRay(true);
                }
                setXRayImages(XRayImages);
                setHistory({
                    ...history,
                    Id: data[0].id,
                    Height: height,
                    Weight: weight,
                    BloodPressure: bloodPressure,
                    Pulse: pulse,
                    Other: other,
                    Note: note,
                });
            }
        }).catch((reason) => {
            console.log('[Get Current History Error] ', reason);
        });
    };

    const getPatients = (resolve, reject, query) => {
        Axios.get(GetPatientUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
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

    // [End] Api handlers.

    // [Start] Print handler
    const [printData, setPrintData] = React.useState(null);
    const handlePrint = () => {
        const Age = _.toNumber(printData.Age);
        const AppointmentDate =
            moment(printData.AppointmentDate).isValid() ?
                printData.AppointmentDate.format(DisplayDateTimeFormat) : null;
        const Doctors = [];
        if (!_.isEmpty(printData.Doctors)) {
            printData.Doctors.map(({ fullName }) => Doctors.push({
                FullName: fullName,
            }));
        }
        const data = {
            ...printData,
            Age,
            Gender: [Gender.None, Gender.Male, Gender.Female][printData.Gender],
            AppointmentDate,
            Doctors,
        };

        console.log('Print Data: ', data);

        setDisabled(true);
        setDisabledPrint(true);
        setLoadingPrint(true);
        ChromeLyService.post(PatientPrintUrl, null, JSON.stringify(data), response => {
            const { ResponseText } = response;
            const { ReadyState, Status, Data } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                const { Message } = Data;
                console.log(`[Print Patient Success] - ${Message}`);
                handleSnackbarOption('success', 'In phiếu tiếp nhận thành công!');
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in phiếu tiếp nhận bệnh nhân!');
                console.log('[Print Patient Error] - An error occurs during message routing. With url: '
                    + PatientPrintUrl
                    + '. Response received: ', response);
            }
            setDisabled(false);
            setDisabledPrint(false);
            setLoadingPrint(false);
            setOpenPatientPreview(false);
        });
    };

    // [End] Print handler

    // React Lifecycle Handlers

    React.useEffect(() => {
        getDoctorOptions();
        handleUpdatePatientHistory();
    }, []);

    React.useEffect(() => {
        if (externalUpdateMode) {
            getPatient(_patientId);
            if (_historyId === 'current') {
                getCurrentHistory(_patientId);
            } else {
                getHistory(_historyId);
            }
        }
    }, [externalUpdateMode]);

    React.useEffect(() => {
        if (updateMode) {
            const { id } = selectedRow;
            getPatient(id);
            getCurrentHistory(id);
        }
    }, [updateMode, selectedRow]);

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
                                        value={patient.FullName}
                                        onChange={handlePatientChange('FullName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        id="Age"
                                        label="Tuổi"
                                        value={patient.Age}
                                        onChange={handlePatientChange('Age')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Select
                                        fullWidth
                                        style={{ marginTop: 0, marginBottom: 0 }}
                                        id="Gender"
                                        label="Giới tính"
                                        value={patient.Gender}
                                        onChange={handlePatientChange('Gender')}
                                        options={genderOptions}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        id="IdCode"
                                        label="Mã BN"
                                        value={patient.IdCode}
                                        onChange={handlePatientChange('IdCode')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <DatePicker
                                        fullWidth
                                        id="CheckedDate"
                                        label="Ngày khám"
                                        value={patient.CheckedDate}
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
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <TextField
                                                fullWidth
                                                id="Address"
                                                label="Địa chỉ"
                                                value={patient.Address}
                                                onChange={handlePatientChange('Address')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="PhoneNumber"
                                        label="Điện thoại"
                                        value={patient.PhoneNumber}
                                        onChange={handlePatientChange('PhoneNumber')}
                                        maxLength={10}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="RelativePhoneNumber"
                                        label="Số điện thoại người thân"
                                        value={patient.RelativePhoneNumber}
                                        onChange={handlePatientChange('RelativePhoneNumber')}
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
                                    <DatePicker
                                        fullWidth
                                        id="AppointmentDate"
                                        label="Ngày hẹn (nếu có)"
                                        value={patient.AppointmentDate}
                                        onChange={(date) => handleAppointmentDateChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <CheckBox
                                        label="Khám lần đầu"
                                        checked={patient.Status === PatientStatus.IsNew}
                                        disabled={patient.Status === PatientStatus.IsChecking}
                                        value={PatientStatus.IsNew}
                                        onChange={handleStatusChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <CheckBox
                                        label="Tái khám"
                                        checked={patient.Status === PatientStatus.IsRechecking}
                                        disabled={patient.Status === PatientStatus.IsChecking}
                                        value={PatientStatus.IsRechecking}
                                        onChange={handleStatusChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <CheckBox
                                        label="BS Hồ sơ"
                                        checked={patient.Status === PatientStatus.IsToAddDocs}
                                        disabled={patient.Status === PatientStatus.IsChecking}
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
                                        {
                                            !_.isEmpty(_xRayImages) &&
                                            <Paper elevation={0}>
                                                <Typography
                                                    style={{ marginBottom: 16 }}
                                                    component="p"
                                                    variant="caption"
                                                    children="Hình ảnh đã tải lên"
                                                />
                                                <Grid
                                                    className={classes.thumbContainer}
                                                    container
                                                    spacing={2}
                                                >
                                                    {_xRayImages.map((xRayImage, index) => (
                                                        <Grid
                                                            className={classes.thumb}
                                                            key={index}
                                                            item
                                                            xs={12} sm={12} md={4} lg={4} xl={4}
                                                        >
                                                            <div style={{ textAlign: 'right' }}>
                                                                <IconButton
                                                                    className={classes.clearButton}
                                                                    onClick={() => clearXRayImage(xRayImage)}
                                                                >
                                                                    <Close style={{ color: red[800] }} />
                                                                </IconButton>
                                                            </div>
                                                            <img
                                                                className={classes.img}
                                                                src={xRayImage.data}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Paper>
                                        }
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
                                        value={history.Height}
                                        onChange={handleHistoryChange('Height')}
                                        placeholder=".......cm"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        fullWidth
                                        id="Weight"
                                        label="Cân nặng"
                                        value={history.Weight}
                                        onChange={handleHistoryChange('Weight')}
                                        placeholder=".......kg"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        fullWidth
                                        id="BloodPressure"
                                        label="Huyết áp"
                                        value={history.BloodPressure}
                                        onChange={handleHistoryChange('BloodPressure')}
                                        placeholder=".../...mmHg"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        fullWidth
                                        id="Pulse"
                                        label="Mạch"
                                        value={history.Pulse}
                                        onChange={handleHistoryChange('Pulse')}
                                        placeholder=".......lần/phút"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <TextField
                                        fullWidth
                                        id="Other"
                                        label="Thông tin khác"
                                        value={history.Other}
                                        onChange={handleHistoryChange('Other')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <TextField
                                        fullWidth
                                        id="Note"
                                        label="Ghi chú"
                                        value={history.Note}
                                        onChange={handleHistoryChange('Note')}
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
                                    <Autocomplete
                                        fullWidth
                                        multiple
                                        id="Doctors"
                                        label="Các bác sĩ hội chuẩn khám"
                                        options={doctorOptions}
                                        getOptionLabel={getOptionLabel}
                                        value={_doctors}
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
                                        children={(updateMode || externalUpdateMode) ? 'Lưu' : 'Hoàn tất'}
                                        iconName={(updateMode || externalUpdateMode) ? 'save' : 'done'}
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
                disabledPrint={disabledPrint}
                loadingPrint={loadingPrint}
                open={openPatientPreview}
                patient={patientPreview}
                handleCancel={handleClosePatientPreview}
                handlePrint={handlePrint}
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
