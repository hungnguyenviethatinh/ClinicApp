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
    GetTestFormUrl,
    AddTestFormUrl,
    UpdateTestFormUrl,
    GetPatientNamesUrl,
    GetDiagnosisNamesUrl,
    TestFormPrintUrl,
    UpdateStatusTestFormUrl,
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

import { TestFormModel } from '../../models';

const getPatientErrorMsg = '[Get Patient Error] ';
const getTestFormErrorMsg = '[Get TestForm Error] ';
const getPatientsErrorMsg = '[Get Patients Error] ';
const addTestFormErrorMsg = '[Add TestForm Error] ';
const updateTestFormErrorMsg = '[Update TestForm Error] ';
const getDiagnosesErrMsg = '[Get Diagnoses Error] ';

const TestForm = () => {
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

    const [testForm, setTestForm] = React.useState(TestFormModel);
    const handleTestFormChange = prop => event => {
        setTestForm({
            ...testForm,
            [prop]: event.target.value,
        });
    };
    const handleTestFormCheck = prop => event => {
        setTestForm({
            ...testForm,
            [prop]: event.target.checked,
        });
    };
    const handleDateCreatedChange = (date) => {
        setTestForm({
            ...testForm,
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
            setTestForm({
                ...testForm,
                DiagnosisName: value.name,
            });
        }
        setDiagnosisNameValue(value);
    };
    const handleDiagnosisNameValueBlur = (event) => {
        const diagnosisName = event.target.value;
        setTestForm({
            ...testForm,
            DiagnosisName: diagnosisName,
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
                    setTestForm({
                        ...testForm,
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

    const getTestForm = (id) => {
        setDisabled(true);

        const url = `${GetTestFormUrl}/${id}`;
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
                setTestForm({
                    IdCode: data[0].idCode,
                    DiagnosisName: data[0].diagnosisName,
                    DateCreated: moment(data[0].dateCreated),
                    Status: data[0].status,
                    IsBloodSample: data[0].isBloodSample,
                    IsUrineSample: data[0].isUrineSample,
                    IsPusSample: data[0].isPusSample,
                    IsSputumSample: data[0].isSputumSample,
                    IsShitSample: data[0].isShitSample,
                    HumourSample: data[0].humourSample,
                    IsBloodGroup: data[0].isBloodGroup,
                    IsBlood: data[0].isBlood,
                    IsVS: data[0].isVS,
                    IsFeverTest: data[0].isFeverTest,
                    IsTs: data[0].isTs,
                    IsTc: data[0].isTc,
                    IsPt: data[0].isPt,
                    IsAtpp: data[0].isAtpp,
                    IsFibrinogen: data[0].isFibrinogen,
                    IsDdimer: data[0].isDdimer,
                    IsAso: data[0].isAso,
                    IsCrp: data[0].isCrp,
                    IsRf: data[0].isRf,
                    IsAna: data[0].isAna,
                    IsAntiCcp: data[0].isAntiCcp,
                    IsCortisol: data[0].isCortisol,
                    IsProcal: data[0].isProcal,
                    IsFt4: data[0].isFt4,
                    IsTsh: data[0].isTsh,
                    IsInterlukin6: data[0].isInterlukin6,
                    IsHbsAg: data[0].isHbsAg,
                    IsHbsQgE: data[0].isHbsQgE,
                    IsAntiHiv: data[0].isAntiHiv,
                    IsAnitHivE: data[0].isAnitHivE,
                    IsAntiHcv: data[0].isAntiHcv,
                    IsAntiHcvE: data[0].isAntiHcvE,
                    IsRpr: data[0].isRpr,
                    IsGlucose: data[0].isGlucose,
                    IsHpA1c: data[0].isHpA1c,
                    IsUrea: data[0].isUrea,
                    IsCreatinine: data[0].isCreatinine,
                    IsUricAcid: data[0].isUricAcid,
                    IsAst: data[0].isAst,
                    IsAlt: data[0].isAlt,
                    IsFBilirubin: data[0].isFBilirubin,
                    IsBilirubin: data[0].isBilirubin,
                    IsGgt: data[0].isGgt,
                    IsProtein: data[0].isProtein,
                    IsAlbumin: data[0].isAlbumin,
                    IsTriglycerid: data[0].isTriglycerid,
                    IsCholes: data[0].isCholes,
                    IsHdlCholes: data[0].isHdlCholes,
                    IsLdlCholes: data[0].isLdlCholes,
                    IsElectrolytes: data[0].isElectrolytes,
                    IsCa: data[0].isCa,
                    IsCpk: data[0].isCpk,
                    IsCkMb: data[0].isCkMb,
                    IsTroponin: data[0].isTroponin,
                    IsEthanol: data[0].isEthanol,
                    IsEndoscopy: data[0].isEndoscopy,
                    IsGram: data[0].isGram,
                    IsZiehl: data[0].isZiehl,
                    IsAntibiotic: data[0].isAntibiotic,
                    IsUrine: data[0].isUrine,
                    IsAddis: data[0].isAddis,
                    IsProteinBj: data[0].isProteinBj,
                    IsProtein24h: data[0].isProtein24h,
                    IsUrea24h: data[0].isUrea24h,
                    IsUricAcid24h: data[0].isUricAcid24h,
                    IsCreat24h: data[0].isCreat24h,
                    IsElec24h: data[0].isElec24h,
                    IsCa24h: data[0].isCa24h,
                    IsKstRuot: data[0].isKstRuot,
                    IsKstMau: data[0].isKstMau,
                    IsHcBc: data[0].isHcBc,
                    IsDntProtein: data[0].isDntProtein,
                    IsDntGlucose: data[0].isDntGlucose,
                    IsDntCtbc: data[0].isDntCtbc,
                    IsDntAnti: data[0].isDntAnti,
                    IsDkProtein: data[0].isDkProtein,
                    IsDkGlucose: data[0].isDkGlucose,
                    IsDkCtbc: data[0].isDkCtbc,
                    IsDkAnti: data[0].isDkAnti,
                    IsDpbProtein: data[0].isDpbProtein,
                    IsDpbRivalta: data[0].isDpbRivalta,
                    IsDpbCell: data[0].isDpbCell,
                    IsDpbAnti: data[0].isDpbAnti,
                    OtherTest: data[0].otherTest,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getTestFormErrorMsg);
            setDisabled(false);
        });
    };

    const addTestForm = (testFormModel) => {
        Axios.post(AddTestFormUrl, testFormModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Tạo phiếu yêu cầu xét nghiệm thành công!');
                const { id } = data;
                setTimeout(() => {
                    browserHistory.push(RouteConstants.TestFormView.replace(':mode', FormMode.View).replace(':formId', id));
                }, 1000);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi tạo phiếu yêu cầu xét nghiệm. Vui lòng thử lại sau!');
                handleError(response, addTestFormErrorMsg);
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi tạo phiếu yêu cầu xét nghiệm. Vui lòng thử lại sau!');
            handleError(reason, addTestFormErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateTestForm = (testFormModel) => {
        const url = `${UpdateTestFormUrl}/${formId}`;
        Axios.put(url, testFormModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật phiếu yêu cầu xét nghiệm thành công!');
                const { id } = data;
                setTimeout(() => {
                    browserHistory.push(RouteConstants.TestFormView.replace(':mode', FormMode.View).replace(':formId', id));
                }, 1000);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật phiếu yêu cầu xét nghiệm. Vui lòng thử lại sau!');
                handleError(response, updateTestFormErrorMsg);
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi cập nhật phiếu yêu cầu xét nghiệm. Vui lòng thử lại sau!');
            handleError(reason, updateTestFormErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const handleEdit = () => {
        browserHistory.push(RouteConstants.TestFormView.replace(':mode', FormMode.Update).replace(':formId', formId));
    };

    const handleReset = () => {
        setTestForm({
            ...TestFormModel,
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

    const updateTestFormStatus = () => {
        const url = `${UpdateStatusTestFormUrl}/${formId}`;
        Axios.patch(url, null, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Update TestForm Status Success', response);
            } else {
                console.log('[Update TestForm Status Error]', response);
            }
        }).catch((reason) => {
            console.log('[Update TestForm Status Error]', reason);
        });
    };

    const handlePrint = () => {
        const data = JSON.stringify({
            ...testForm,
            Doctor: currentDoctor,
            Patient: currentPatient,
        });

        console.log(JSON.parse(data));

        setDisabled(true);
        setLoadingDone(true);

        ChromeLyService.post(TestFormPrintUrl, null, data, response => {
            const { ResponseText } = response;
            const { ReadyState, Status, Data } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                const { Message } = Data;
                console.log(Message);
                updateTestFormStatus();
                handleSnackbarOption('success', 'In phiếu chỉ định thành công.');
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in!');
                console.log('[Print TestForm Error] - An error occurs during message routing. With url: '
                    + TestFormPrintUrl
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
        if (!testForm.DateCreated) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn!');
            return;
        }
        if (testForm.DateCreated && !moment(testForm.DateCreated).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn hợp lệ!');
            return;
        }

        setDisabled(true);
        setLoadingDone(true);

        const IdCode = currentPatient.IdCode;
        const DateCreated = testForm.DateCreated.format();
        const testFormModel = {
            ...testForm,
            IdCode,
            DateCreated,
        };
        if (addMode) {
            addTestForm(testFormModel);
            return;
        }
        if (updateMode) {
            updateTestForm(testFormModel);
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
            getTestForm(formId);
        }
    }, [stopLoadingPatientName,
        stopLoadingDiagnosisName,
        updateMode]);

    React.useEffect(() => {
        if (stopLoadingPatientName &&
            stopLoadingDiagnosisName &&
            viewMode) {
            getTestForm(formId);
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
                        title="PHIẾU YÊU CẦU XÉT NGHIỆM"
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
                                        value={testForm.IdCode}
                                        onChange={handleTestFormChange('IdCode')}
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
                                        value={testForm.DateCreated}
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
                                        onBlur={handleDiagnosisNameValueBlur}
                                    />
                                </Grid>
                            </Grid>
                            <Typography
                                align="left"
                                variant="h5"
                                component="h5"
                                children="Bệnh phẩm:"
                            />
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                                spacing={2}
                                style={{ marginBottom: 12 }}
                            >
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <CheckBox
                                        id="IsBloodSample"
                                        label="Máu"
                                        labelPlacement="start"
                                        checked={testForm.IsBloodSample}
                                        disabled={viewMode}
                                        onChange={handleTestFormCheck('IsBloodSample')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <CheckBox
                                        id="IsUrineSample"
                                        label="Nước tiểu"
                                        labelPlacement="start"
                                        checked={testForm.IsUrineSample}
                                        disabled={viewMode}
                                        onChange={handleTestFormCheck('IsUrineSample')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <CheckBox
                                        id="IsPusSample"
                                        label="Mũ"
                                        labelPlacement="start"
                                        checked={testForm.IsPusSample}
                                        disabled={viewMode}
                                        onChange={handleTestFormCheck('IsPusSample')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <CheckBox
                                        id="IsSputumSample"
                                        label="Đàm"
                                        labelPlacement="start"
                                        checked={testForm.IsSputumSample}
                                        disabled={viewMode}
                                        onChange={handleTestFormCheck('IsSputumSample')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <CheckBox
                                        id="IsShitSample"
                                        label="Phân"
                                        labelPlacement="start"
                                        checked={testForm.IsShitSample}
                                        disabled={viewMode}
                                        onChange={handleTestFormCheck('IsShitSample')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        id="HumourSample"
                                        style={{ marginTop: 0 }}
                                        readOnly={viewMode}
                                        label="Dịch"
                                        value={testForm.HumourSample}
                                        onChange={handleTestFormChange('HumourSample')}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                justify="center"
                                spacing={2}
                                style={{
                                    marginBottom: 24,
                                }}
                            >
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Typography
                                        align="center"
                                        variant="h5"
                                        component="h5"
                                        children="HUYẾT HỌC"
                                    />
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsBloodGroup"
                                                label="Nhóm máu"
                                                labelPlacement="end"
                                                checked={testForm.IsBloodGroup}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsBloodGroup')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsBlood"
                                                label="Huyết đồ"
                                                labelPlacement="end"
                                                checked={testForm.IsBlood}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsBlood')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsVS"
                                                label="Tốc độ lắng máu (VS)"
                                                labelPlacement="end"
                                                checked={testForm.IsVS}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsVS')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsFeverTest"
                                                label="KST sốt rét"
                                                labelPlacement="end"
                                                checked={testForm.IsFeverTest}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsFeverTest')}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography
                                        align="center"
                                        variant="h5"
                                        component="h5"
                                        children="ĐÔNG MÁU"
                                    />
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsTs"
                                                label="TS"
                                                labelPlacement="end"
                                                checked={testForm.IsTs}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsTs')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsTc"
                                                label="TC"
                                                labelPlacement="end"
                                                checked={testForm.IsTc}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsTc')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsPt"
                                                label="PT (TQ)"
                                                labelPlacement="end"
                                                checked={testForm.IsPt}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsPt')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAtpp"
                                                label="ATPP (TCK)"
                                                labelPlacement="end"
                                                checked={testForm.IsAtpp}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAtpp')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsFibrinogen"
                                                label="Fibrinogen"
                                                labelPlacement="end"
                                                checked={testForm.IsFibrinogen}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsFibrinogen')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDdimer"
                                                label="D-Dimer"
                                                labelPlacement="end"
                                                checked={testForm.IsDdimer}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDdimer')}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography
                                        align="center"
                                        variant="h5"
                                        component="h5"
                                        children="MIỄN DỊCH"
                                    />
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAso"
                                                label="ASO"
                                                labelPlacement="end"
                                                checked={testForm.IsAso}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAso')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCrp"
                                                label="CRP"
                                                labelPlacement="end"
                                                checked={testForm.IsCrp}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCrp')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsRf"
                                                label="RF"
                                                labelPlacement="end"
                                                checked={testForm.IsRf}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsRf')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAna"
                                                label="ANA"
                                                labelPlacement="end"
                                                checked={testForm.IsAna}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAna')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAntiCcp"
                                                label="Anti CCP"
                                                labelPlacement="end"
                                                checked={testForm.IsAntiCcp}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAntiCcp')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCortisol"
                                                label="Cortisol"
                                                labelPlacement="end"
                                                checked={testForm.IsCortisol}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCortisol')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsProcal"
                                                label="Procalcitonin"
                                                labelPlacement="end"
                                                checked={testForm.IsProcal}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsProcal')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsFt4"
                                                label="FT4 (Free T4)"
                                                labelPlacement="end"
                                                checked={testForm.IsFt4}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsFt4')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsTsh"
                                                label="TSH"
                                                labelPlacement="end"
                                                checked={testForm.IsTsh}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsTsh')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsInterlukin6"
                                                label="Interlukin 6"
                                                labelPlacement="end"
                                                checked={testForm.IsInterlukin6}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsInterlukin6')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsHbsAg"
                                                label="HBsAg (test nhanh)"
                                                labelPlacement="end"
                                                checked={testForm.IsHbsAg}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsHbsAg')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsHbsQgE"
                                                label="HBsAg (Elisa)"
                                                labelPlacement="end"
                                                checked={testForm.IsHbsQgE}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsHbsQgE')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAntiHiv"
                                                label="Anti HIV (test nhanh)"
                                                labelPlacement="end"
                                                checked={testForm.IsAntiHiv}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAntiHiv')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAnitHivE"
                                                label="Anti HIV (Elisa)"
                                                labelPlacement="end"
                                                checked={testForm.IsAnitHivE}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAnitHivE')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAntiHcv"
                                                label="Anti HCV (test nhanh)"
                                                labelPlacement="end"
                                                checked={testForm.IsAntiHcv}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAntiHcv')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAntiHcvE"
                                                label="Anit HCV (Elisa)"
                                                labelPlacement="end"
                                                checked={testForm.IsAntiHcvE}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAntiHcvE')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsRpr"
                                                label="RPR"
                                                labelPlacement="end"
                                                checked={testForm.IsRpr}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsRpr')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Typography
                                        align="center"
                                        variant="h5"
                                        component="h5"
                                        children="SINH HÓA"
                                    />
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsGlucose"
                                                label="Glucose"
                                                labelPlacement="end"
                                                checked={testForm.IsGlucose}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsGlucose')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsHpA1c"
                                                label="HbA1C"
                                                labelPlacement="end"
                                                checked={testForm.IsHpA1c}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsHpA1c')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsUrea"
                                                label="Urea"
                                                labelPlacement="end"
                                                checked={testForm.IsUrea}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsUrea')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCreatinine"
                                                label="Creatinine"
                                                labelPlacement="end"
                                                checked={testForm.IsCreatinine}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCreatinine')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsUricAcid"
                                                label="Uric acid"
                                                labelPlacement="end"
                                                checked={testForm.IsUricAcid}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsUricAcid')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAst"
                                                label="AST (SGOT)"
                                                labelPlacement="end"
                                                checked={testForm.IsAst}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAst')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAlt"
                                                label="ALT (SGPT)"
                                                labelPlacement="end"
                                                checked={testForm.IsAlt}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAlt')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsFBilirubin"
                                                label="Bilirubin toàn phần"
                                                labelPlacement="end"
                                                checked={testForm.IsFBilirubin}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsFBilirubin')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsBilirubin"
                                                label="Bilirubin trực tiếp"
                                                labelPlacement="end"
                                                checked={testForm.IsBilirubin}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsBilirubin')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsGgt"
                                                label="GGT"
                                                labelPlacement="end"
                                                checked={testForm.IsGgt}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsGgt')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsProtein"
                                                label="Protein toàn phần"
                                                labelPlacement="end"
                                                checked={testForm.IsProtein}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsProtein')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAlbumin"
                                                label="Albumin"
                                                labelPlacement="end"
                                                checked={testForm.IsAlbumin}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAlbumin')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsTriglycerid"
                                                label="Triglycerid"
                                                labelPlacement="end"
                                                checked={testForm.IsTriglycerid}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsTriglycerid')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCholes"
                                                label="Cholesterol toàn phần"
                                                labelPlacement="end"
                                                checked={testForm.IsCholes}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCholes')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsHdlCholes"
                                                label="HDL Cholesterol"
                                                labelPlacement="end"
                                                checked={testForm.IsHdlCholes}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsHdlCholes')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsLdlCholes"
                                                label="LDL Cholesterol"
                                                labelPlacement="end"
                                                checked={testForm.IsLdlCholes}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsLdlCholes')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsElectrolytes"
                                                label="Điên giải đồ (Na+, K+, Cl-)"
                                                labelPlacement="end"
                                                checked={testForm.IsElectrolytes}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsElectrolytes')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCa"
                                                label="Ca toàn phần"
                                                labelPlacement="end"
                                                checked={testForm.IsCa}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCa')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCpk"
                                                label="CPK"
                                                labelPlacement="end"
                                                checked={testForm.IsCpk}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCpk')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCkMb"
                                                label="CK MB"
                                                labelPlacement="end"
                                                checked={testForm.IsCkMb}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCkMb')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsTroponin"
                                                label="Troponin"
                                                labelPlacement="end"
                                                checked={testForm.IsTroponin}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsTroponin')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsEthanol"
                                                label="Ethanol (Cồn)"
                                                labelPlacement="end"
                                                checked={testForm.IsEthanol}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsEthanol')}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography
                                        align="center"
                                        variant="h5"
                                        component="h5"
                                        children="VI SINH"
                                    />
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsEndoscopy"
                                                label="Soi trực tiếp"
                                                labelPlacement="end"
                                                checked={testForm.IsEndoscopy}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsEndoscopy')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsGram"
                                                label="Nhuộm Gram"
                                                labelPlacement="end"
                                                checked={testForm.IsGram}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsGram')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsZiehl"
                                                label="Nhuộm Ziehl tim BK"
                                                labelPlacement="end"
                                                checked={testForm.IsZiehl}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsZiehl')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAntibiotic"
                                                label="Cấy - Kháng sinh đồ"
                                                labelPlacement="end"
                                                checked={testForm.IsAntibiotic}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAntibiotic')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Typography
                                        align="center"
                                        variant="h5"
                                        component="h5"
                                        children="NƯỚC TIỂU"
                                    />
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsUrine"
                                                label="Tổng phân tích nước tiểu"
                                                labelPlacement="end"
                                                checked={testForm.IsUrine}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsUrine')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsAddis"
                                                label="Cặn Addis"
                                                labelPlacement="end"
                                                checked={testForm.IsAddis}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsAddis')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsProteinBj"
                                                label="Protein Bence Jones"
                                                labelPlacement="end"
                                                checked={testForm.IsProteinBj}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsProteinBj')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsProtein24h"
                                                label="Protein 24h"
                                                labelPlacement="end"
                                                checked={testForm.IsProtein24h}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsProtein24h')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsUrea24h"
                                                label="Urea 24h"
                                                labelPlacement="end"
                                                checked={testForm.IsUrea24h}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsUrea24h')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsUricAcid24h"
                                                label="Uric acid 24h"
                                                labelPlacement="end"
                                                checked={testForm.IsUricAcid24h}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsUricAcid24h')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCreat24h"
                                                label="Creatinine 24h"
                                                labelPlacement="end"
                                                checked={testForm.IsCreat24h}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCreat24h')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsElec24h"
                                                label="Điện giải đồ (Na+, K+, Cl) 24h"
                                                labelPlacement="end"
                                                checked={testForm.IsElec24h}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsElec24h')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsCa24h"
                                                label="Ca/24h"
                                                labelPlacement="end"
                                                checked={testForm.IsCa24h}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsCa24h')}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography
                                        align="center"
                                        variant="h5"
                                        component="h5"
                                        children="KÝ SINH"
                                    />
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsKstRuot"
                                                label="KST đường ruột"
                                                labelPlacement="end"
                                                checked={testForm.IsKstRuot}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsKstRuot')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsKstMau"
                                                label="Máu ẩn/phân"
                                                labelPlacement="end"
                                                checked={testForm.IsKstMau}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsKstMau')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsHcBc"
                                                label="HC-BC/phân"
                                                labelPlacement="end"
                                                checked={testForm.IsHcBc}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsHcBc')}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography
                                        align="center"
                                        variant="h5"
                                        component="h5"
                                        children="PHÂN TÍCH DỊCH"
                                    />
                                    <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography
                                                align="left"
                                                variant="h6"
                                                component="h6"
                                                children="Dịch não tủy"
                                                style={{ paddingLeft: 10 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDntProtein"
                                                label="Protein"
                                                labelPlacement="end"
                                                checked={testForm.IsDntProtein}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDntProtein')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDntGlucose"
                                                label="Glucose"
                                                labelPlacement="end"
                                                checked={testForm.IsDntGlucose}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDntGlucose')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDntCtbc"
                                                label="Tế bào - CTBC"
                                                labelPlacement="end"
                                                checked={testForm.IsDntCtbc}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDntCtbc')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDntAnti"
                                                label="Cấy + Kháng sinh đồ"
                                                labelPlacement="end"
                                                checked={testForm.IsDntAnti}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDntAnti')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography
                                                align="left"
                                                variant="h6"
                                                component="h6"
                                                children="Dịch khớp"
                                                style={{ paddingLeft: 10 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDkProtein"
                                                label="Protein"
                                                labelPlacement="end"
                                                checked={testForm.IsDkProtein}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDkProtein')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDkGlucose"
                                                label="Glucose"
                                                labelPlacement="end"
                                                checked={testForm.IsDkGlucose}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDkGlucose')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDkCtbc"
                                                label="Tế bào - CTBC"
                                                labelPlacement="end"
                                                checked={testForm.IsDkCtbc}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDkCtbc')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDkAnti"
                                                label="Cấy + Kháng sinh đồ"
                                                labelPlacement="end"
                                                checked={testForm.IsDkAnti}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDkAnti')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography
                                                align="left"
                                                variant="h6"
                                                component="h6"
                                                children="Dịch màng phổi - Màng bụng"
                                                style={{ paddingLeft: 10 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDpbProtein"
                                                label="Protein"
                                                labelPlacement="end"
                                                checked={testForm.IsDpbProtein}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDpbProtein')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDpbRivalta"
                                                label="Rivalta"
                                                labelPlacement="end"
                                                checked={testForm.IsDpbRivalta}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDpbRivalta')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDpbCell"
                                                label="Tế bào"
                                                labelPlacement="end"
                                                checked={testForm.IsDpbCell}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDpbCell')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CheckBox
                                                id="IsDpbAnti"
                                                label="Cấy + Kháng sinh đồ"
                                                labelPlacement="end"
                                                checked={testForm.IsDpbAnti}
                                                disabled={viewMode}
                                                onChange={handleTestFormCheck('IsDpbAnti')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        id="OtherTest"
                                        rows={3}
                                        style={{ marginTop: 0 }}
                                        readOnly={viewMode}
                                        label="Xét nghiệm khác"
                                        value={testForm.OtherTest}
                                        onChange={handleTestFormChange('OtherTest')}
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

export default TestForm;
