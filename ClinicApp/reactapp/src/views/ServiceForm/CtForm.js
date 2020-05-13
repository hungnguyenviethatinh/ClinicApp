import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import clsx from 'clsx';

import _ from 'lodash';
import moment from 'moment';

import { TextField } from '../../components/TextField';
import { Snackbar } from '../../components/Snackbar';
import { Button, HistoryButton as Back } from '../../components/Button';
import { Autocomplete } from '../../components/Autocomplete';
import { DatePicker } from '../../components/DatePicker';
import { CheckBox } from '../../components/CheckBox';

import Axios, {
    axiosRequestConfig,
    verifyJWT,
    ChromeLyService,
} from '../../common';

import {
    ExpiredSessionMsg,
    NotFoundMsg,
    Gender,
    FormMode,
    CtRequestType,
    CtRequestTypeEnum,
    RouteConstants,
    RoleConstants,
    AccessTokenKey,
} from '../../constants';

import {
    GetDiagnosisNameOptionsUrl,
    GetCurrentPatientUrl,
    GetPatientOptionsUrl,
    GetCtFormUrl,
    AddCtFormUrl,
    UpdateCtFormUrl,
    GetPatientNamesUrl,
    GetDiagnosisNamesUrl,
    CtFormPrintUrl,
    UpdateStatusCtFormUrl,
} from '../../config';

const useStyles = makeStyles(theme => ({
    card: {},
    content: {
        padding: theme.spacing(0),
    },
    action: {
        marginRight: 0,
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
    typography: {
        padding: '8px 10px',
    },
}));

import { CtFormModel } from '../../models';

const getPatientErrorMsg = '[Get Patient Error] ';
const getCtFormErrorMsg = '[Get CtForm Error] ';
const getPatientsErrorMsg = '[Get Patients Error] ';
const addCtFormErrorMsg = '[Add CtForm Error] ';
const updateCtFormErrorMsg = '[Update CtForm Error] ';
const getDiagnosesErrMsg = '[Get Diagnoses Error] ';

const CtForm = () => {
    // [Start] Common
    const classes = useStyles();
    const browserHistory = useHistory();
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

    const [isDoctor, setIsDoctor] = React.useState(false);
    const checkDoctorRole = () => {
        const token = localStorage.getItem(AccessTokenKey);
        verifyJWT(token, RoleConstants.DoctorRoleName) && setIsDoctor(true);
    };

    const { mode, formId } = useParams();

    const [stopLoadingPatientName, setStopLoadingPatientName] = React.useState(false);
    const [stopLoadingDiagnosisName, setStopLoadingDiagnosisName] = React.useState(false);

    const [disabled, setDisabled] = React.useState(false);
    const [loadingDone, setLoadingDone] = React.useState(false);

    const [addMode, setAddMode] = React.useState(false);
    const [updateMode, setUpdateMode] = React.useState(false);
    const [viewMode, setViewMode] = React.useState(false);

    const [ctForm, setCtForm] = React.useState(CtFormModel);
    const handleCtFormChange = prop => event => {
        // const value = event.target.value;
        // if (value === 'Yes') {
        //     setCtForm({
        //         ...ctForm,
        //         [prop]: true,
        //     });
        // } else if (value === 'No') {
        //     setCtForm({
        //         ...ctForm,
        //         [prop]: false,
        //     });
        // } else {
        //     setCtForm({
        //         ...ctForm,
        //         [prop]: value,
        //     });
        // }

        setCtForm({
            ...ctForm,
            [prop]: event.target.value,
        });
    };
    const handleCtFormCheck = prop => event => {
        const checked = event.target.checked;

        if (prop === 'IsContrastMedicine') {
            setCtForm({
                ...ctForm,
                IsContrastMedicine: checked,
                IsNotContrastMedicine: false,
            });
        } else if (prop === 'IsNotContrastMedicine') {
            setCtForm({
                ...ctForm,
                IsContrastMedicine: false,
                IsNotContrastMedicine: checked,
            });
        } else {
            setCtForm({
                ...ctForm,
                [prop]: checked,
            });
        }
    };
    const handleDateCreatedChange = (date) => {
        setCtForm({
            ...ctForm,
            DateCreated: date,
        });
    };

    const [currentDoctor, setCurrentDoctor] = React.useState({
        FullName: '',
    });

    const [currentPatient, setCurrentPatient] = React.useState({
        Id: '',
        IdCode: '',
        FullName: '',
        OrderNumber: '',
        Age: '',
        Gender: '',
        Address: '',
        PhoneNumber: '',
    });
    const [patientNameValue, setPatientNameValue] = React.useState(null);
    const handlePatientNameChange = (event, value) => {
        if (value && value.id) {
            getPatient(value.id);
        }
    };

    const [patientNameOptions, setPatientNameOptions] = React.useState([{
        id: '',
        idCode: '',
        fullName: '',
    }]);
    const getPatientOptionLabel = (option) => `${option.idCode}${option.id} - ${option.fullName}`;
    const getPatientNameOptions = () => {
        const url = isDoctor ? GetPatientOptionsUrl : GetPatientNamesUrl;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                setPatientNameOptions(data);
                setStopLoadingPatientName(true);
            }
        }).catch((reason) => {
            handleError(reason, getPatientsErrorMsg);
        });
    };

    const [diagnosisNameValue, setDiagnosisNameValue] = React.useState(null);
    const handleDiagnosisNameValueChange = (event, value) => {
        if (value && value.name) {
            setCtForm({
                ...ctForm,
                DiagnosisName: value.name,
            });
        }
        setDiagnosisNameValue(value);
    };
    const handleDiagnosisNameValueBlur = (event) => {
        setCtForm({
            ...ctForm,
            DiagnosisName: event.target.value,
        });
    };
    const [diagnosisNameOptions, setDiagnosisNameOptions] = React.useState([{
        id: '',
        name: '',
    }]);
    const getDiagnosisOptionLabel = (option) => option.name;
    const getDiagnosisNameOptions = () => {
        const url = isDoctor ? GetDiagnosisNameOptionsUrl : GetDiagnosisNamesUrl;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [];
                data.map(({ id, name }) => options.push({
                    id,
                    name,
                }));
                setDiagnosisNameOptions(options);
                setStopLoadingDiagnosisName(true);
            }
        }).catch((reason) => {
            handleError(reason, getDiagnosesErrMsg);
        });
    };

    const getPatient = (patientId) => {
        setDisabled(true);

        const url = `${GetCurrentPatientUrl}/${patientId}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { patient } = data[0];
                const {
                    id,
                    idCode,
                    fullName,
                    orderNumber,
                    age,
                    gender,
                    address,
                    phoneNumber,
                } = patient;

                const nameValue = patientNameOptions.find(p => p.id === id);
                setPatientNameValue(nameValue);
                setCurrentPatient({
                    Id: id,
                    IdCode: idCode,
                    FullName: fullName,
                    OrderNumber: orderNumber,
                    Age: age,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                });
                if (addMode) {
                    setCtForm({
                        ...ctForm,
                        IdCode: idCode,
                        PatientId: id,
                    });
                }
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getPatientErrorMsg);
            setDisabled(false);
        });
    };

    const getCtForm = (id) => {
        setDisabled(true);

        const url = `${GetCtFormUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { doctor, patient } = data[0];
                const {
                    id,
                    idCode,
                    fullName,
                    orderNumber,
                    age,
                    gender,
                    address,
                    phoneNumber,
                } = patient;

                setCurrentDoctor({
                    FullName: doctor.fullName,
                });
                const nameValue = patientNameOptions.find(p => p.id === id);
                setPatientNameValue(nameValue);
                setCurrentPatient({
                    Id: id,
                    IdCode: idCode,
                    FullName: fullName,
                    OrderNumber: orderNumber,
                    Age: age,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                });
                const diagnosisNameValue = diagnosisNameOptions
                    .find(p => p.name === data[0].diagnosisName) || {
                    id: '',
                    name: data[0].diagnosisName,
                };
                setDiagnosisNameValue(diagnosisNameValue);
                setCtForm({
                    IdCode: data[0].idCode,
                    DiagnosisName: data[0].diagnosisName,
                    DateCreated: moment(data[0].dateCreated),
                    Status: data[0].status,
                    Type: [CtRequestType.Normal, CtRequestType.Urgent, CtRequestType.Emergency, CtRequestType.None][data[0].type],
                    IsContrastMedicine: data[0].isContrastMedicine,
                    IsNotContrastMedicine: data[0].isNotContrastMedicine,
                    IsSkull: data[0].isSkull,
                    IsEarNoseThroat: data[0].isEarNoseThroat,
                    IsCsNeck: data[0].isCsNeck,
                    IsCsChest: data[0].isCsChest,
                    IsCsWaist: data[0].isCsWaist,
                    IsShoulder: data[0].isShoulder,
                    IsElbow: data[0].isElbow,
                    IsWrist: data[0].isWrist,
                    IsSinus: data[0].isSinus,
                    IsGroin: data[0].isGroin,
                    IsKnee: data[0].isKnee,
                    IsAnkle: data[0].isAnkle,
                    IsNeck: data[0].isNeck,
                    IsFoot: data[0].isFoot,
                    IsPelvis: data[0].isPelvis,
                    IsChest: data[0].isChest,
                    IsStomach: data[0].isStomach,
                    IsUrinary: data[0].isUrinary,
                    IsUpperVein: data[0].isUpperVein,
                    UpperVein: data[0].upperVein,
                    IsLowerVein: data[0].isLowerVein,
                    LowerVein: data[0].lowerVein,
                    IsOther: data[0].isOther,
                    Other: data[0].other,
                    IsPregnant: data[0].isPregnant,
                    IsAllergy: data[0].isAllergy,
                    IsHeartDisease: data[0].isHeartDisease,
                    IsBloodDisease: data[0].isBloodDisease,
                    IsKidneyFailure: data[0].isKidneyFailure,
                    IsDiabetesMellitus: data[0].isDiabetesMellitus,
                    IsCoagulopathy: data[0].isCoagulopathy,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getCtFormErrorMsg);
            setDisabled(false);
        });
    };

    const addCtForm = (ctFormModel) => {
        Axios.post(AddCtFormUrl, ctFormModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Tạo phiếu chỉ định chụp CT thành công!');
                const { id } = data;
                setTimeout(() => {
                    browserHistory.push(RouteConstants.CtFormView.replace(':mode', FormMode.View).replace(':formId', id));
                }, 1000);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi tạo phiếu chỉ định chụp CT. Vui lòng thử lại sau!');
                handleError(response, addCtFormErrorMsg);
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi tạo phiếu chỉ định chụp CT. Vui lòng thử lại sau!');
            handleError(reason, addCtFormErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateCtForm = (ctFormModel) => {
        const url = `${UpdateCtFormUrl}/${formId}`;
        Axios.put(url, ctFormModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật phiếu chỉ định chụp CT thành công!');
                const { id } = data;
                setTimeout(() => {
                    browserHistory.push(RouteConstants.CtFormView.replace(':mode', FormMode.View).replace(':formId', id));
                }, 1000);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật phiếu chỉ định chụp CT. Vui lòng thử lại sau!');
                handleError(response, updateCtFormErrorMsg);
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi cập nhật phiếu chỉ định chụp CT. Vui lòng thử lại sau!');
            handleError(reason, updateCtFormErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const handleEdit = () => {
        browserHistory.push(RouteConstants.CtFormView.replace(':mode', FormMode.Update).replace(':formId', formId));
    };

    const handleReset = () => {
        setCtForm({
            ...CtFormModel,
            IdCode: currentPatient.IdCode,
        });
        setDiagnosisNameValue(null);
        if (addMode) {
            setCurrentPatient({
                Id: '',
                IdCode: '',
                FullName: '',
                OrderNumber: '',
                Age: '',
                Gender: '',
                Address: '',
                PhoneNumber: '',
            });
            setPatientNameValue(null);
        }
    };

    const updateCtFormStatus = () => {
        const url = `${UpdateStatusCtFormUrl}/${formId}`;
        Axios.patch(url, null, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Update CtForm Status Success', response);
            } else {
                console.log('[Update CtForm Status Error]', response);
            }
        }).catch((reason) => {
            console.log('[Update CtForm Status Error]', reason);
        });
    };

    const handlePrint = () => {
        const data = JSON.stringify({
            ...ctForm,
            Doctor: currentDoctor,
            Patient: currentPatient,
        });

        console.log(JSON.parse(data));

        setDisabled(true);
        setLoadingDone(true);

        ChromeLyService.post(CtFormPrintUrl, null, data, response => {
            const { ResponseText } = response;
            const { ReadyState, Status, Data } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                const { Message } = Data;
                console.log(Message);
                updateCtFormStatus();
                handleSnackbarOption('success', 'In phiếu chỉ định thành công.');
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in!');
                console.log('[Print CtForm Error] - An error occurs during message routing. With url: '
                    + CtFormPrintUrl
                    + '. Response received: ', response);
            }
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const handleDone = () => {
        if (!patientNameValue) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên bệnh nhân!');
            return;
        }
        if (!ctForm.DateCreated) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn!');
            return;
        }
        if (ctForm.DateCreated && !moment(ctForm.DateCreated).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn hợp lệ!');
            return;
        }

        setDisabled(true);
        setLoadingDone(true);

        const IdCode = currentPatient.IdCode;
        const DateCreated = ctForm.DateCreated.format();
        const Type = CtRequestTypeEnum[ctForm.Type];
        const UpperVein = ctForm.IsUpperVein ? ctForm.UpperVein : '';
        const LowerVein = ctForm.IsLowerVein ? ctForm.LowerVein : '';
        const Other = ctForm.IsOther ? ctForm.Other : '';
        const ctFormModel = {
            ...ctForm,
            IdCode,
            DateCreated,
            Type,
            UpperVein,
            LowerVein,
            Other,
        };
        if (addMode) {
            addCtForm(ctFormModel);
            return;
        }
        if (updateMode) {
            updateCtForm(ctFormModel);
            return;
        }
    };

    const getFormMode = () => {
        if (mode === FormMode.Add) {
            setAddMode(true);
        } else if (mode === FormMode.Update) {
            setUpdateMode(true);
        } else {
            setViewMode(true);
        }
    };

    React.useEffect(() => {
        checkDoctorRole();
        getPatientNameOptions();
        getDiagnosisNameOptions();
        getFormMode();
    }, []);

    React.useEffect(() => {
        if (stopLoadingPatientName &&
            stopLoadingDiagnosisName &&
            updateMode) {
            getCtForm(formId);
        }
    }, [stopLoadingPatientName,
        stopLoadingDiagnosisName,
        updateMode]);

    React.useEffect(() => {
        if (stopLoadingPatientName &&
            stopLoadingDiagnosisName &&
            viewMode) {
            getCtForm(formId);
        }
    }, [stopLoadingPatientName,
        stopLoadingDiagnosisName,
        viewMode]);

    return (
        <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Back />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        classes={{
                            action: classes.action,
                        }}
                        title="PHIẾU CHỈ ĐỊNH CHỤP CT"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper
                            elevation={0}
                            className={clsx({ [classes.paper]: true, })}
                        >
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                                spacing={2}
                                style={{ marginBottom: 24 }}
                            >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <Autocomplete
                                        fullWidth
                                        disabled={updateMode || viewMode}
                                        id="FullName"
                                        label="Họ và tên Bệnh nhân"
                                        options={patientNameOptions}
                                        getOptionLabel={getPatientOptionLabel}
                                        value={patientNameValue}
                                        onChange={handlePatientNameChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <TextField
                                        id="Address"
                                        label="Địa chỉ"
                                        value={currentPatient.Address}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        id="Age"
                                        label="Tuổi"
                                        value={currentPatient.Age}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        id="Gender"
                                        label="Giới tính"
                                        value={currentPatient.Gender}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <TextField
                                        id="PhoneNumber"
                                        label="Số điện thoại"
                                        value={currentPatient.PhoneNumber}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <TextField
                                        id="IdCode"
                                        label="Mã đơn"
                                        value={ctForm.IdCode}
                                        onChange={handleCtFormChange('IdCode')}
                                        fullWidth
                                        readOnly
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <DatePicker
                                        fullWidth
                                        disabled={viewMode}
                                        margin="dense"
                                        id="DateCreated"
                                        label="Ngày kê đơn"
                                        value={ctForm.DateCreated}
                                        onChange={(date) => handleDateCreatedChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <Autocomplete
                                        fullWidth
                                        freeSolo
                                        disabled={viewMode}
                                        margin="dense"
                                        id="Diagnosis"
                                        label="Chẩn đoán"
                                        options={diagnosisNameOptions}
                                        getOptionLabel={option => getDiagnosisOptionLabel(option)}
                                        value={diagnosisNameValue}
                                        onChange={handleDiagnosisNameValueChange}
                                        onBlur={handleDiagnosisNameValueBlur}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                                spacing={2}
                                style={{
                                    marginBottom: 24,
                                }}
                            >
                                <Grid
                                    container
                                    item
                                    xs={12} sm={12} md={12} lg={12} xl={12}
                                    spacing={2}
                                >
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Typography
                                            align="left"
                                            variant="h5"
                                            component="h5"
                                            children="YÊU CẦU"
                                            style={{ padding: '8px 5px ' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <CheckBox
                                            id="TypeNormal"
                                            label="Thường"
                                            labelPlacement="end"
                                            checked={ctForm.Type === CtRequestType.Normal}
                                            disabled={viewMode}
                                            value={CtRequestType.Normal}
                                            onChange={handleCtFormChange('Type')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <CheckBox
                                            id="TypeUrgent"
                                            label="Khẩn"
                                            labelPlacement="end"
                                            checked={ctForm.Type === CtRequestType.Urgent}
                                            disabled={viewMode}
                                            value={CtRequestType.Urgent}
                                            onChange={handleCtFormChange('Type')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <CheckBox
                                            id="TypeEmergency"
                                            label="Cấp cứu"
                                            labelPlacement="end"
                                            checked={ctForm.Type === CtRequestType.Emergency}
                                            disabled={viewMode}
                                            value={CtRequestType.Emergency}
                                            onChange={handleCtFormChange('Type')}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    xs={12} sm={12} md={12} lg={12} xl={12}
                                    spacing={2}
                                >
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Typography
                                            align="left"
                                            variant="h5"
                                            component="h5"
                                            children="CT"
                                            style={{ padding: '8px 5px ' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Typography
                                            align="left"
                                            variant="h5"
                                            component="h5"
                                            children="Thuốc cản quang"
                                            style={{ padding: '8px 0px' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <CheckBox
                                            id="IsContrastMedicine"
                                            label="Có"
                                            labelPlacement="end"
                                            checked={ctForm.IsContrastMedicine}
                                            disabled={viewMode}
                                            onChange={handleCtFormCheck('IsContrastMedicine')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <CheckBox
                                            id="IsNotContrastMedicine"
                                            label="Không"
                                            labelPlacement="end"
                                            checked={ctForm.IsNotContrastMedicine}
                                            disabled={viewMode}
                                            onChange={handleCtFormCheck('IsNotContrastMedicine')}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12} sm={12} md={3} lg={3} xl={3}
                                >
                                    <CheckBox
                                        id="IsSkull"
                                        label="Sọ não"
                                        labelPlacement="end"
                                        checked={ctForm.IsSkull}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsSkull')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsCsNeck"
                                        label="CS Cổ"
                                        labelPlacement="end"
                                        checked={ctForm.IsCsNeck}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsCsNeck')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsCsChest"
                                        label="CS Ngực"
                                        labelPlacement="end"
                                        checked={ctForm.IsCsChest}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsCsChest')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsCsWaist"
                                        label="CS Thắt lưng"
                                        labelPlacement="end"
                                        checked={ctForm.IsCsWaist}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsCsWaist')}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12} sm={12} md={3} lg={3} xl={3}
                                >
                                    <CheckBox
                                        id="IsEarNoseThroat"
                                        label="Tai - mũi - họng"
                                        labelPlacement="end"
                                        checked={ctForm.IsEarNoseThroat}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsEarNoseThroat')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsShoulder"
                                        label="Vai"
                                        labelPlacement="end"
                                        checked={ctForm.IsShoulder}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsShoulder')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsElbow"
                                        label="Khuỷu"
                                        labelPlacement="end"
                                        checked={ctForm.IsElbow}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsElbow')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsWrist"
                                        label="Cổ tay"
                                        labelPlacement="end"
                                        checked={ctForm.IsWrist}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsWrist')}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12} sm={12} md={3} lg={3} xl={3}
                                >
                                    <CheckBox
                                        id="IsSinus"
                                        label="Xoang"
                                        labelPlacement="end"
                                        checked={ctForm.IsSinus}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsSinus')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsShouIsGroinlder"
                                        label="Háng"
                                        labelPlacement="end"
                                        checked={ctForm.IsGroin}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsGroin')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsKnee"
                                        label="Gối"
                                        labelPlacement="end"
                                        checked={ctForm.IsKnee}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsKnee')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsAnkle"
                                        label="Cổ chân"
                                        labelPlacement="end"
                                        checked={ctForm.IsAnkle}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsAnkle')}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12} sm={12} md={6} lg={6} xl={6}
                                >
                                    <CheckBox
                                        id="IsNeck"
                                        label="Cổ"
                                        labelPlacement="end"
                                        checked={ctForm.IsNeck}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsNeck')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsFoot"
                                        label="Bàn chân"
                                        labelPlacement="end"
                                        checked={ctForm.IsFoot}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsFoot')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsPelvis"
                                        label="Khung chậu"
                                        labelPlacement="end"
                                        checked={ctForm.IsPelvis}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsPelvis')}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12} sm={12} md={3} lg={3} xl={3}
                                >
                                    <CheckBox
                                        id="IsChest"
                                        label="Ngực"
                                        labelPlacement="end"
                                        checked={ctForm.IsChest}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsChest')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <CheckBox
                                        id="IsUpperVein"
                                        label="Mạch máu chi trên:"
                                        labelPlacement="end"
                                        checked={ctForm.IsUpperVein}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsUpperVein')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                    <TextField
                                        id="UpperVein"
                                        readOnly={!ctForm.IsUpperVein || viewMode}
                                        value={ctForm.UpperVein}
                                        onChange={handleCtFormChange('UpperVein')}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12} sm={12} md={3} lg={3} xl={3}
                                >
                                    <CheckBox
                                        id="IsStomach"
                                        label="Bụng"
                                        labelPlacement="end"
                                        checked={ctForm.IsStomach}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsStomach')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <CheckBox
                                        id="IsLowerVein"
                                        label="Mạch máu chi dưới:"
                                        labelPlacement="end"
                                        checked={ctForm.IsLowerVein}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsLowerVein')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                    <TextField
                                        id="LowerVein"
                                        readOnly={!ctForm.IsLowerVein || viewMode}
                                        value={ctForm.LowerVein}
                                        onChange={handleCtFormChange('LowerVein')}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12} sm={12} md={3} lg={3} xl={3}
                                >
                                    <CheckBox
                                        id="IsUrinary"
                                        label="Hệ niệu"
                                        labelPlacement="end"
                                        checked={ctForm.IsUrinary}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsUrinary')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <CheckBox
                                        id="IsOther"
                                        label="Khác:"
                                        labelPlacement="end"
                                        checked={ctForm.IsOther}
                                        disabled={viewMode}
                                        onChange={handleCtFormCheck('IsOther')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                    <TextField
                                        id="Other"
                                        readOnly={!ctForm.IsOther || viewMode}
                                        value={ctForm.Other}
                                        onChange={handleCtFormChange('Other')}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <div style={{ display: 'none', }}>
                                <Typography
                                    align="center"
                                    variant="h5"
                                    component="h5"
                                    children="THÔNG TIN CẦN THIẾT TRƯỚC KHI CHỤP CT-SCAN CÓ THUỐC CẢN QUANG"
                                />
                                <Typography
                                    align="center"
                                    variant="caption"
                                    component="p"
                                    children="(Bác Sĩ chỉ định đánh dấu vào các mục này)"
                                />
                                <Grid
                                    container
                                    justify="center"
                                    alignItems="center"
                                    spacing={2}
                                    style={{
                                        marginTop: 24,
                                        marginBottom: 24,
                                    }}
                                >
                                    <Grid
                                        item
                                        xs={12} sm={12} md={6} lg={6} xl={6}
                                    >
                                        <Typography
                                            align="center"
                                            variant="h6"
                                            component="h6"
                                            children="Phần chung"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <Typography
                                            align="center"
                                            variant="h6"
                                            component="h6"
                                            children="Có"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <Typography
                                            align="center"
                                            variant="h6"
                                            component="h6"
                                            children="Không"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={6} lg={6} xl={6}
                                    >
                                        <Typography
                                            align="left"
                                            variant="h6"
                                            component="h6"
                                            children="Có thai"
                                            className={classes.typography}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsPregnant"
                                            checked={ctForm.IsPregnant}
                                            disabled={viewMode}
                                            value="Yes"
                                            onChange={handleCtFormChange('IsPregnant')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsNotPregnant"
                                            checked={!ctForm.IsPregnant}
                                            disabled={viewMode}
                                            value="No"
                                            onChange={handleCtFormChange('IsPregnant')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={6} lg={6} xl={6}
                                    >
                                        <Typography
                                            align="left"
                                            variant="h6"
                                            component="h6"
                                            children="Dị ứng"
                                            className={classes.typography}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsAllergy"
                                            checked={ctForm.IsAllergy}
                                            disabled={viewMode}
                                            value="Yes"
                                            onChange={handleCtFormChange('IsAllergy')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsNotAllergy"
                                            checked={!ctForm.IsAllergy}
                                            disabled={viewMode}
                                            value="No"
                                            onChange={handleCtFormChange('IsAllergy')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={6} lg={6} xl={6}
                                    >
                                        <Typography
                                            align="left"
                                            variant="h6"
                                            component="h6"
                                            children="Bệnh lý tim mạch"
                                            className={classes.typography}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsHeartDisease"
                                            checked={ctForm.IsHeartDisease}
                                            disabled={viewMode}
                                            value="Yes"
                                            onChange={handleCtFormChange('IsHeartDisease')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsNotHeartDisease"
                                            checked={!ctForm.IsHeartDisease}
                                            disabled={viewMode}
                                            value="No"
                                            onChange={handleCtFormChange('IsHeartDisease')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={6} lg={6} xl={6}
                                    >
                                        <Typography
                                            align="left"
                                            variant="h6"
                                            component="h6"
                                            children="Bệnh lý mạch máu ngoại biên"
                                            className={classes.typography}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsBloodDisease"
                                            checked={ctForm.IsBloodDisease}
                                            disabled={viewMode}
                                            value="Yes"
                                            onChange={handleCtFormChange('IsBloodDisease')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsNotBloodDisease"
                                            checked={!ctForm.IsBloodDisease}
                                            disabled={viewMode}
                                            value="No"
                                            onChange={handleCtFormChange('IsBloodDisease')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={6} lg={6} xl={6}
                                    >
                                        <Typography
                                            align="left"
                                            variant="h6"
                                            component="h6"
                                            children="Suy thận"
                                            className={classes.typography}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsKidneyFailure"
                                            checked={ctForm.IsKidneyFailure}
                                            disabled={viewMode}
                                            value="Yes"
                                            onChange={handleCtFormChange('IsKidneyFailure')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsNotKidneyFailure"
                                            checked={!ctForm.IsKidneyFailure}
                                            disabled={viewMode}
                                            value="No"
                                            onChange={handleCtFormChange('IsKidneyFailure')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={6} lg={6} xl={6}
                                    >
                                        <Typography
                                            align="left"
                                            variant="h6"
                                            component="h6"
                                            children="Đái tháo đường"
                                            className={classes.typography}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsDiabetesMellitus"
                                            checked={ctForm.IsDiabetesMellitus}
                                            disabled={viewMode}
                                            value="Yes"
                                            onChange={handleCtFormChange('IsDiabetesMellitus')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsNotDiabetesMellitus"
                                            checked={!ctForm.IsDiabetesMellitus}
                                            disabled={viewMode}
                                            value="No"
                                            onChange={handleCtFormChange('IsDiabetesMellitus')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12} sm={12} md={6} lg={6} xl={6}
                                    >
                                        <Typography
                                            align="left"
                                            variant="h6"
                                            component="h6"
                                            children="Rối loạn đông máu"
                                            className={classes.typography}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsCoagulopathy"
                                            checked={ctForm.IsCoagulopathy}
                                            disabled={viewMode}
                                            value="Yes"
                                            onChange={handleCtFormChange('IsCoagulopathy')}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        container
                                        justify="center"
                                        xs={12} sm={12} md={3} lg={3} xl={3}
                                    >
                                        <CheckBox
                                            id="IsNotCoagulopathy"
                                            checked={!ctForm.IsCoagulopathy}
                                            disabled={viewMode}
                                            value="No"
                                            onChange={handleCtFormChange('IsCoagulopathy')}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            {
                                (addMode || updateMode) &&
                                <Grid
                                    container
                                    spacing={2}
                                    justify="flex-end"
                                    style={{ marginTop: 8 }}
                                >
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Button
                                            fullWidth
                                            disabled={disabled}
                                            color="warning"
                                            children="Đặt lại"
                                            iconName="reset"
                                            onClick={handleReset}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Button
                                            fullWidth
                                            disabled={disabled}
                                            loading={loadingDone}
                                            color="success"
                                            children="Hoàn tất"
                                            iconName="done"
                                            onClick={handleDone}
                                        />
                                    </Grid>
                                </Grid>
                            }
                            {
                                viewMode &&
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
                                            color="info"
                                            children="Sửa"
                                            iconName="edit"
                                            onClick={handleEdit}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                        <Button
                                            fullWidth
                                            disabled={disabled}
                                            loading={loadingDone}
                                            color="warning"
                                            children="In"
                                            iconName="print"
                                            onClick={handlePrint}
                                        />
                                    </Grid>
                                </Grid>
                            }
                        </Paper>
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
};

export default CtForm;
