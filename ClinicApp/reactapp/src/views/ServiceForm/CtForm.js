import React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
} from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';

import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select';
import { Snackbar } from '../../components/Snackbar';
import { Button, FabButton } from '../../components/Button';
import { Autocomplete } from '../../components/Autocomplete';
import { DatePicker } from '../../components/DatePicker';
import { CheckBox } from '../../components/CheckBox';

import Axios, {
    axiosRequestConfig,
} from '../../common';

import {
    PrescriptionStatusEnum,
    PrescriptionStatus,
    ExpiredSessionMsg,
    NotFoundMsg,
    Gender,
    PatientStatusEnum,
    PatientStatus,
    RouteConstants,
    SnackbarMessage,
    takePeriodValue,
    FormMode,
} from '../../constants';

import {
    GetMedicineNameOptionsUrl,
    GetDiagnosisNameOptionsUrl,
    GetIngredientOptionsUrl,
    GetUnitNameOptionsUrl,
    GetCurrentPatientUrl,
    AddPrescriptionsUrl,
    GetPrescriptionUrl,
    UpdatePrescriptionsUrl,
    AddMedicinesUrl,
    UpdatePatientHistoryUrl,
    UpdateMedicinesUrl,
    UpdateMedicinesQuantityUrl,
    RestoreMedicinesQuantityUrl,
    GetMedicineListUrl,
    GetPatientOptionsUrl,
    GetCtFormUrl,
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
}));

import {
    CtFormModel,
    CtFormAddModel,
    CtFormUpdateModel,
    CtFormViewModel,
} from '../../models';

const getPatientErrorMsg = '[Get Patient Error] ';
const getCtFormErrorMsg = '[Get CtForm Error] ';
const updatePatientHistoryErrorMsg = '[Update Patient Error] ';
const updateMedicinesQuantityErrorMsg = '[Update Medicines Error] ';
const restoreMedicinesQuantityErrorMsg = '[Restore Medicines Error] ';
const getMedicineErrorMsg = '[Get Medicines Error] ';
const getPatientsErrorMsg = '[Get Patients Error] ';
const getPrescriptionErrorMsg = '[Get Prescription Error] ';
const addPrescriptionErrorMsg = '[Add Prescription Error] ';
const updatePrescriptionErrorMsg = '[Update Prescription Error] ';
const addMedicineErrorMsg = '[Add Medicines Error] ';
const updateMedicineErrorMsg = '[Update Medicines Error] ';
const getDiagnosesErrMsg = '[Get Diagnoses Error] ';
const getUnitsErrorMsg = '[Get Units Error] ';
const getIngredientsErrorMsg = '[Get Ingredients Error] ';
const getMedicineListErrorMsg = '[Get Medicine List Error] ';

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

    const { mode, formId } = useParams();

    const [stopLoadingPatientName, setStopLoadingPatientName] = React.useState(false);
    const [stopLoadingDiagnosisName, setStopLoadingDiagnosisName] = React.useState(false);

    const [disabled, setDisabled] = React.useState(false);
    const [loadingDone, setLoadingDone] = React.useState(false);

    const [addMode, setAddMode] = React.useState(false);
    const [updateMode, setUpdateMode] = React.useState(false);
    const [viewMode, setViewMode] = React.useState(false);

    const [ctFormModel, setCtFormModel] = React.useState(CtFormModel);
    const [ctFormAddModel, setCtFormAddModel] = React.useState(CtFormAddModel);
    const [ctFormUpdateModel, setCtFormUpdateModel] = React.useState(CtFormUpdateModel);
    const [ctFormViewModel, setCtFormViewModel] = React.useState(CtFormViewModel);

    const [patient, setPatient] = React.useState({
        Id: '',
        IdCode: '',
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
        Axios.get(GetPatientOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                setPatientNameOptions(data);
                setStopLoadingPatientName(true);
            }
        }).catch((reason) => {
            handleError(reason, getPatientsErrorMsg);
        });
    };

    const [diagnosisOptions, setDiagnosisOptions] = React.useState([{
        id: '',
        name: '',
    }]);
    const getDiagnosisOptions = () => {
        Axios.get(GetDiagnosisNameOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [];
                data.map(({ id, name }) => options.push({
                    id,
                    name,
                }));
                setDiagnosisOptions(options);
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
                const {
                    id,
                    idCode,
                    age,
                    gender,
                    address,
                    phoneNumber,
                } = data[0].patient;

                const nameValue = patientNameOptions.find(p => p.id === id);
                setPatientNameValue(nameValue);
                setPatient({
                    Id: id,
                    IdCode: idCode,
                    Age: age,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                });
                if (addMode) {
                    const currentHistoryId =
                        (data[0].history && data[0].history.id) ?
                            data[0].history.id : null;
                    setCtFormAddModel({
                        ...ctFormAddModel,
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

    const getCtForm = (id) => {
        setDisabled(true);

        const url = `${GetCtFormUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {

            }
        }).catch((reason) => {
            handleError(reason, getCtFormErrorMsg);
            setDisabled(false);
        });
    };

    const handleReset = () => {

    };

    const handleDone = () => {

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
        getPatientNameOptions();
        getDiagnosisOptions();
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
        if (viewMode) {
            getCtForm(formId);
        }
    }, [viewMode]);

    return (
        <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
        >
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
                        <Paper elevation={0} className={classes.paper}>
                            <Grid
                                container
                                justify="center"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <Autocomplete
                                            fullWidth
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
                                            value={patient.Address}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                        <TextField
                                            id="Age"
                                            label="Tuổi"
                                            value={patient.Age}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                        <TextField
                                            id="Gender"
                                            label="Giới tính"
                                            value={patient.Gender}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                        <TextField
                                            id="PhoneNumber"
                                            label="Số điện thoại"
                                            value={patient.PhoneNumber}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                        <TextField
                                            id="IdCode"
                                            label="Mã đơn"
                                            value={ctFormModel.IdCode}
                                            onChange={handlePrescriptionChange('IdCode')}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <DatePicker
                                            fullWidth
                                            margin="dense"
                                            id="DateCreated"
                                            label="Ngày kê đơn"
                                            value={ctFormModel.DateCreated}
                                            onChange={(date) => handleDateCreatedChange(date)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <Autocomplete
                                            fullWidth
                                            margin="dense"
                                            id="Diagnosis"
                                            label="Chẩn đoán"
                                            options={diagnosisOptions}
                                            getOptionLabel={option => getOptionLabel(option)}
                                            value={diagnosisValue}
                                            onChange={handleDiagnosisValueChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                justify="center"
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
