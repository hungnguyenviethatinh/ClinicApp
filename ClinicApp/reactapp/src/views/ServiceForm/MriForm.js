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
    RouteConstants,
    RoleConstants,
    AccessTokenKey,
} from '../../constants';

import {
    GetDiagnosisNameOptionsUrl,
    GetCurrentPatientUrl,
    GetPatientOptionsUrl,
    GetMriFormUrl,
    AddMriFormUrl,
    UpdateMriFormUrl,
    GetPatientNamesUrl,
    GetDiagnosisNamesUrl,
    MriFormPrintUrl,
    UpdateStatusMriFormUrl,
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

import { MriFormModel } from '../../models';

const getPatientErrorMsg = '[Get Patient Error] ';
const getMriFormErrorMsg = '[Get MriForm Error] ';
const getPatientsErrorMsg = '[Get Patients Error] ';
const addMriFormErrorMsg = '[Add MriForm Error] ';
const updateMriFormErrorMsg = '[Update MriForm Error] ';
const getDiagnosesErrMsg = '[Get Diagnoses Error] ';

const MriForm = () => {
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

    const [mriForm, setMriForm] = React.useState(MriFormModel);
    const handleMriFormChange = prop => event => {
        const value = event.target.value;
        if (value === 'Yes') {
            setMriForm({
                ...mriForm,
                [prop]: true,
            });
        } else if (value === 'No') {
            setMriForm({
                ...mriForm,
                [prop]: false,
            });
        } else {
            setMriForm({
                ...mriForm,
                [prop]: value,
            });
        }
    };
    const handleMriFormCheck = prop => event => {
        setMriForm({
            ...mriForm,
            [prop]: event.target.checked,
        });
    };
    const handleDateCreatedChange = (date) => {
        setMriForm({
            ...mriForm,
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
            setMriForm({
                ...mriForm,
                DiagnosisName: value.name,
            });
        }
        setDiagnosisNameValue(value);
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
                const { patient, history } = data[0];
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
                    const currentHistoryId =
                        (history && history.id) ?
                            history.id : null;
                    if ((!history || !history.id)) {
                        handleSnackbarOption('error', `Bệnh nhân này đã được khám xong.
                                ${' '}Vui lòng chọn bệnh nhân khác!`);
                    }
                    setMriForm({
                        ...mriForm,
                        PatientId: id,
                        HistoryId: currentHistoryId,
                    });
                }
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getPatientErrorMsg);
            setDisabled(false);
        });
    };

    const getMriForm = (id) => {
        setDisabled(true);

        const url = `${GetMriFormUrl}/${id}`;
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
                const diagnosisNameValue = diagnosisNameOptions.find(p => p.name === data[0].diagnosisName);
                setDiagnosisNameValue(diagnosisNameValue);
                setMriForm({
                    IdCode: data[0].idCode,
                    DiagnosisName: data[0].diagnosisName,
                    DateCreated: moment(data[0].dateCreated),
                    Status: data[0].status,
                    IsSkull: data[0].isSkull,
                    IsHeadNeck: data[0].isHeadNeck,
                    IsChest: data[0].isChest,
                    IsStomachGroin: data[0].isStomachGroin,
                    IsLimbs: data[0].isLimbs,
                    IsNeckSpine: data[0].isNeckSpine,
                    IsChestSpine: data[0].isChestSpine,
                    IsPelvisSpine: data[0].isPelvisSpine,
                    IsBloodVessel: data[0].isBloodVessel,
                    IsOther: data[0].isOther,
                    Other: data[0].other,
                    IsContrastAgent: data[0].isContrastAgent,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getMriFormErrorMsg);
            setDisabled(false);
        });
    };

    const addMriForm = (mriFormModel) => {
        Axios.post(AddMriFormUrl, mriFormModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Tạo phiếu chỉ chụp cộng hưởng từ (MRI) thành công!');
                const { id } = data;
                setTimeout(() => {
                    browserHistory.push(RouteConstants.MriFormView.replace(':mode', FormMode.View).replace(':formId', id));
                }, 1000);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi tạo phiếu chỉ chụp cộng hưởng từ (MRI). Vui lòng thử lại sau!');
                handleError(response, addMriFormErrorMsg);
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi tạo phiếu chỉ chụp cộng hưởng từ (MRI). Vui lòng thử lại sau!');
            handleError(reason, addMriFormErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateMriForm = (mriFormModel) => {
        const url = `${UpdateMriFormUrl}/${formId}`;
        Axios.put(url, mriFormModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật phiếu chỉ chụp cộng hưởng từ (MRI) thành công!');
                const { id } = data;
                setTimeout(() => {
                    browserHistory.push(RouteConstants.MriFormView.replace(':mode', FormMode.View).replace(':formId', id));
                }, 1000);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật phiếu chỉ chụp cộng hưởng từ (MRI). Vui lòng thử lại sau!');
                handleError(response, updateMriFormErrorMsg);
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi cập nhật phiếu chỉ chụp cộng hưởng từ (MRI). Vui lòng thử lại sau!');
            handleError(reason, updateMriFormErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const handleReset = () => {
        setMriForm(MriFormModel);
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

    const updateMriFormStatus = () => {
        const url = `${UpdateStatusMriFormUrl}/${formId}`;
        Axios.patch(url, null, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Update MriForm Status Success', response);
            } else {
                console.log('[Update MriForm Status Error]', response);
            }
        }).catch((reason) => {
            console.log('[Update MriForm Status Error]', reason);
        });
    };

    const handlePrint = () => {
        const data = JSON.stringify({
            ...mriForm,
            Doctor: currentDoctor,
            Patient: currentPatient,
        });

        console.log(JSON.parse(data));

        setDisabled(true);
        setLoadingDone(true);

        ChromeLyService.post(MriFormPrintUrl, null, data, response => {
            const { ResponseText } = response;
            const { ReadyState, Status, Data } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                const { Message } = Data;
                console.log(Message);
                updateMriFormStatus();
                handleSnackbarOption('success', 'In phiếu chỉ định thành công.');
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in!');
                console.log('[Print MriForm Error] - An error occurs during message routing. With url: '
                    + MriFormPrintUrl
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
        if (!mriForm.DiagnosisName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập chẩn đoán!');
            return;
        }
        if (!mriForm.IdCode.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập mã đơn!');
            return;
        }
        if (!mriForm.DateCreated) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn!');
            return;
        }
        if (mriForm.DateCreated && !moment(mriForm.DateCreated).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn hợp lệ!');
            return;
        }

        setDisabled(true);
        setLoadingDone(true);

        const Other = mriForm.IsOther ? mriForm.Other : '';
        const DateCreated = mriForm.DateCreated.format();
        const mriFormModel = {
            ...mriForm,
            DateCreated,
            Other,
        };
        if (addMode) {
            addMriForm(mriFormModel);
            return;
        }
        if (updateMode) {
            updateMriForm(mriFormModel);
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
            getMriForm(formId);
        }
    }, [stopLoadingPatientName,
        stopLoadingDiagnosisName,
        updateMode]);

    React.useEffect(() => {
        if (stopLoadingPatientName &&
            stopLoadingDiagnosisName &&
            viewMode) {
            getMriForm(formId);
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
                        title="PHIẾU CHỈ ĐỊNH CHỤP CỘNG HƯỞNG TỪ (MRI)"
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
                                        value={mriForm.IdCode}
                                        onChange={handleMriFormChange('IdCode')}
                                        fullWidth
                                        readOnly={viewMode}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <DatePicker
                                        fullWidth
                                        disabled={viewMode}
                                        margin="dense"
                                        id="DateCreated"
                                        label="Ngày kê đơn"
                                        value={mriForm.DateCreated}
                                        onChange={(date) => handleDateCreatedChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <Autocomplete
                                        fullWidth
                                        disabled={viewMode}
                                        margin="dense"
                                        id="Diagnosis"
                                        label="Chẩn đoán lâm sàng"
                                        options={diagnosisNameOptions}
                                        getOptionLabel={option => getDiagnosisOptionLabel(option)}
                                        value={diagnosisNameValue}
                                        onChange={handleDiagnosisNameValueChange}
                                    />
                                </Grid>
                            </Grid>
                            <Typography
                                align="left"
                                variant="h5"
                                component="h5"
                                children="Vùng cơ thể chỉ định chụp:"
                                style={{ padding: '8px 5px ' }}
                            />
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                                spacing={2}
                                style={{
                                    marginBottom: 24,
                                }}
                            >
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsSkull"
                                                label="Sọ não"
                                                labelPlacement="end"
                                                checked={mriForm.IsSkull}
                                                disabled={viewMode}
                                                onChange={handleMriFormCheck('IsSkull')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsHeadNeck"
                                                label="Phần mềm đầu & cổ"
                                                labelPlacement="end"
                                                checked={mriForm.IsHeadNeck}
                                                disabled={viewMode}
                                                onChange={handleMriFormCheck('IsHeadNeck')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsChest"
                                                label="Ngực (tim mạch)"
                                                labelPlacement="end"
                                                checked={mriForm.IsChest}
                                                disabled={viewMode}
                                                onChange={handleMriFormCheck('IsChest')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsStomachGroin"
                                                label="Bụng và chậu"
                                                labelPlacement="end"
                                                checked={mriForm.IsStomachGroin}
                                                disabled={viewMode}
                                                onChange={handleMriFormCheck('IsStomachGroin')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsLimbs"
                                                label="Chi (khớp, phần mềm)"
                                                labelPlacement="end"
                                                checked={mriForm.IsLimbs}
                                                disabled={viewMode}
                                                onChange={handleMriFormCheck('IsLimbs')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Grid
                                        container
                                        justify="center"
                                    >
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Typography
                                                align="right"
                                                variant="h6"
                                                component="h6"
                                                children="*Cột sống:"
                                                style={{ padding: '8px 5px ' }}
                                            />
                                        </Grid>
                                        <Grid container item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <CheckBox
                                                    id="IsNeckSpine"
                                                    label="đoạn cổ"
                                                    labelPlacement="end"
                                                    checked={mriForm.IsNeckSpine}
                                                    disabled={viewMode}
                                                    onChange={handleMriFormCheck('IsNeckSpine')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <CheckBox
                                                    id="IsChestSpine"
                                                    label="đoạn ngực"
                                                    labelPlacement="end"
                                                    checked={mriForm.IsChestSpine}
                                                    disabled={viewMode}
                                                    onChange={handleMriFormCheck('IsChestSpine')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <CheckBox
                                                    id="IsPelvisSpine"
                                                    label="đoạn thắt lưng"
                                                    labelPlacement="end"
                                                    checked={mriForm.IsPelvisSpine}
                                                    disabled={viewMode}
                                                    onChange={handleMriFormCheck('IsPelvisSpine')}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsBloodVessel"
                                                label="Mạch máu (não, cánh, bụng, chi)"
                                                labelPlacement="end"
                                                checked={mriForm.IsBloodVessel}
                                                disabled={viewMode}
                                                onChange={handleMriFormCheck('IsBloodVessel')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsOther"
                                                label="Các yêu cầu khác (xin nghi rõ)"
                                                labelPlacement="end"
                                                checked={mriForm.IsOther}
                                                disabled={viewMode}
                                                onChange={handleMriFormCheck('IsOther')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        id="Other"
                                        rows={3}
                                        style={{ marginTop: 0 }}
                                        readOnly={!mriForm.IsOther || viewMode}
                                        label="Xét nghiệm khác"
                                        value={mriForm.Other}
                                        onChange={handleMriFormChange('Other')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Typography
                                        align="left"
                                        variant="h5"
                                        component="h5"
                                        children="Dùng chất đối quang:"
                                        style={{ padding: '8px 5px ' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsContrastAgent"
                                        label="Có"
                                        labelPlacement="end"
                                        checked={mriForm.IsContrastAgent}
                                        disabled={viewMode}
                                        value="Yes"
                                        onChange={handleMriFormChange('IsContrastAgent')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <CheckBox
                                        id="IsNotContrastAgent"
                                        label="No"
                                        labelPlacement="end"
                                        checked={!mriForm.IsContrastAgent}
                                        disabled={viewMode}
                                        value="No"
                                        onChange={handleMriFormChange('IsContrastAgent')}
                                    />
                                </Grid>
                            </Grid>
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

export default MriForm;
