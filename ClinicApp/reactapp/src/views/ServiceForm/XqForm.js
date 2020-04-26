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
} from '@material-ui/core';
import clsx from 'clsx';

import _ from 'lodash';
import moment from 'moment';

import { TextField } from '../../components/TextField';
import { Snackbar } from '../../components/Snackbar';
import { Button, HistoryButton as Back } from '../../components/Button';
import { Autocomplete } from '../../components/Autocomplete';
import { DatePicker } from '../../components/DatePicker'

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
    GetXqFormUrl,
    AddXqFormUrl,
    UpdateXqFormUrl,
    GetPatientNamesUrl,
    GetDiagnosisNamesUrl,
    XqFormPrintUrl,
    UpdateStatusXqFormUrl,
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

import { XqFormModel } from '../../models';

const getPatientErrorMsg = '[Get Patient Error] ';
const getXqFormErrorMsg = '[Get XqForm Error] ';
const getPatientsErrorMsg = '[Get Patients Error] ';
const addXqFormErrorMsg = '[Add XqForm Error] ';
const updateXqFormErrorMsg = '[Update XqForm Error] ';
const getDiagnosesErrMsg = '[Get Diagnoses Error] ';

const XqForm = () => {
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

    const [xqForm, setXqForm] = React.useState(XqFormModel);
    const handleXqFormChange = prop => event => {
        setXqForm({
            ...xqForm,
            [prop]: event.target.value,
        });
    };
    const handleDateCreatedChange = (date) => {
        setXqForm({
            ...xqForm,
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
            setXqForm({
                ...xqForm,
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
                    setXqForm({
                        ...xqForm,
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

    const getXqForm = (id) => {
        setDisabled(true);

        const url = `${GetXqFormUrl}/${id}`;
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
                setXqForm({
                    IdCode: data[0].idCode,
                    DiagnosisName: data[0].diagnosisName,
                    DateCreated: moment(data[0].dateCreated),
                    Status: data[0].status,
                    Request: data[0].request,
                    Note: data[0].note,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getXqFormErrorMsg);
            setDisabled(false);
        });
    };

    const addXqForm = (xqFormModel) => {
        Axios.post(AddXqFormUrl, xqFormModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Tạo phiếu chỉ định chẩn đoán hình ảnh thành công!');
                const { id } = data;
                setTimeout(() => {
                    browserHistory.push(RouteConstants.XqFormView.replace(':mode', FormMode.View).replace(':formId', id));
                }, 1000);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi tạo phiếu chỉ định chẩn đoán hình ảnh. Vui lòng thử lại sau!');
                handleError(response, addXqFormErrorMsg);
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi tạo phiếu chỉ định chẩn đoán hình ảnh. Vui lòng thử lại sau!');
            handleError(reason, addXqFormErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateXqForm = (xqFormModel) => {
        const url = `${UpdateXqFormUrl}/${formId}`;
        Axios.put(url, xqFormModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật phiếu chỉ định chẩn đoán hình ảnh thành công!');
                const { id } = data;
                setTimeout(() => {
                    browserHistory.push(RouteConstants.XqFormView.replace(':mode', FormMode.View).replace(':formId', id));
                }, 1000);
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật phiếu chỉ định chẩn đoán hình ảnh. Vui lòng thử lại sau!');
                handleError(response, updateXqFormErrorMsg);
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi cập nhật phiếu chỉ định chẩn đoán hình ảnh. Vui lòng thử lại sau!');
            handleError(reason, updateXqFormErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const handleReset = () => {
        setXqForm(XqFormModel);
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

    const updateXqFormStatus = () => {
        const url = `${UpdateStatusXqFormUrl}/${formId}`;
        Axios.patch(url, null, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Update XqForm Status Success', response);
            } else {
                console.log('[Update XqForm Status Error]', response);
            }
        }).catch((reason) => {
            console.log('[Update XqForm Status Error]', reason);
        });
    };

    const handlePrint = () => {
        const data = JSON.stringify({
            ...xqForm,
            Doctor: currentDoctor,
            Patient: currentPatient,
        });

        console.log(JSON.parse(data));

        setDisabled(true);
        setLoadingDone(true);

        ChromeLyService.post(XqFormPrintUrl, null, data, response => {
            const { ResponseText } = response;
            const { ReadyState, Status, Data } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                const { Message } = Data;
                console.log(Message);
                updateXqFormStatus();
                handleSnackbarOption('success', 'In phiếu chỉ định thành công.');
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in!');
                console.log('[Print XqForm Error] - An error occurs during message routing. With url: '
                    + XqFormPrintUrl
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
        if (!xqForm.DiagnosisName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập chẩn đoán!');
            return;
        }
        if (!xqForm.IdCode.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập mã đơn!');
            return;
        }
        if (!xqForm.DateCreated) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn!');
            return;
        }
        if (xqForm.DateCreated && !moment(xqForm.DateCreated).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn hợp lệ!');
            return;
        }

        setDisabled(true);
        setLoadingDone(true);

        const DateCreated = xqForm.DateCreated.format();
        const xqFormModel = {
            ...xqForm,
            DateCreated,
        };
        if (addMode) {
            addXqForm(xqFormModel);
            return;
        }
        if (updateMode) {
            updateXqForm(xqFormModel);
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
            getXqForm(formId);
        }
    }, [stopLoadingPatientName,
        stopLoadingDiagnosisName,
        updateMode]);

    React.useEffect(() => {
        if (stopLoadingPatientName &&
            stopLoadingDiagnosisName &&
            viewMode) {
            getXqForm(formId);
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
                        title="PHIẾU CHỈ ĐỊNH CHẨN ĐOÁN HÌNH ẢNH"
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
                                        value={xqForm.IdCode}
                                        onChange={handleXqFormChange('IdCode')}
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
                                        value={xqForm.DateCreated}
                                        onChange={(date) => handleDateCreatedChange(date)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <Autocomplete
                                        fullWidth
                                        disabled={viewMode}
                                        margin="dense"
                                        id="Diagnosis"
                                        label="Chẩn đoán"
                                        options={diagnosisNameOptions}
                                        getOptionLabel={option => getDiagnosisOptionLabel(option)}
                                        value={diagnosisNameValue}
                                        onChange={handleDiagnosisNameValueChange}
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
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        id="OtherTest"
                                        rows={5}
                                        style={{ marginTop: 0 }}
                                        readOnly={viewMode}
                                        label="Yêu cầu chẩn đoán hình ảnh"
                                        value={xqForm.Request}
                                        onChange={handleXqFormChange('Request')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        id="Note"
                                        rows={3}
                                        style={{ marginTop: 0 }}
                                        readOnly={viewMode}
                                        label="Ghi chú"
                                        value={xqForm.Note}
                                        onChange={handleXqFormChange('Note')}
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

export default XqForm;
