import React from 'react';
import { useHistory } from 'react-router-dom';
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
import { PrescriptionListView } from './PrescriptionList';

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

const getPatientErrorMsg = '[Get Patient Error] ';
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

const takePeriodOptions = [
    { label: takePeriodValue.Day, value: takePeriodValue.Day },
    { label: takePeriodValue.Week, value: takePeriodValue.Week },
    { label: takePeriodValue.Month, value: takePeriodValue.Month },
];

const mealTimeOptions = [
    'sau',
    'trước',
    'cùng',
];

const medicineNoteOptions = [
    'sáng',
    'trưa',
    'chiều',
    'tối',
];

const PrescriptionManagement = () => {
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
    const [stopLoadingPatientName, setStopLoadingPatientName] = React.useState(false);
    const [stopLoadingMedicineName, setStopLoadingMedicineName] = React.useState(false);
    const [stopLoadingDiagnosisName, setStopLoadingDiagnosisName] = React.useState(false);
    const [stopLoadingUnitName, setStopLoadingUnitName] = React.useState(false);
    const [stopLoadingIngredientName, setStopLoadingIngredientName] = React.useState(false);

    const [disabled, setDisabled] = React.useState(false);
    const [loadingDone, setLoadingDone] = React.useState(false);
    const [updateMode, setUpdateMode] = React.useState(false);
    const [patientId, setPatientId] = React.useState(null);
    const [prescriptionId, setPrescriptionId] = React.useState(null);
    const [historyId, setHistoryId] = React.useState(null);
    const handleUpdate = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('uId') && urlParams.has('uPId') && urlParams.has('uHId')) {
            const uId = urlParams.get('uId');
            const uPId = urlParams.get('uPId');
            const uHId = urlParams.get('uHId');
            setUpdateMode(true);
            setPrescriptionId(uId);
            setPatientId(uPId)
            setHistoryId(uHId);
        }
    };

    const [appointmentDays, setAppointmentDays] = React.useState('');
    const handleAppointmentDayChange = event => {
        setAppointmentDays(event.target.value);
    };
    const handleAppointmentDayBlur = (event) => {
        calculateAppointmentDate(event.target.value);
    };
    const handleAppointmentDayEnter = (event) => {
        if (event.key === 'Enter') {
            calculateAppointmentDate(event.target.value);
        }
    };
    const calculateAppointmentDate = (days) => {
        const appointmentDate = (_.isFinite(_.toNumber(days)) && _.toNumber(days) > 0) ?
            moment().add(_.toNumber(days), 'days') : null;
        handleAppointmentDateChange(appointmentDate);
    };
    const calculateAppointmentDay = (appointmentDate, dateCreated) => {
        const AppointmentDays = moment(appointmentDate).isValid() ?
            _.round(appointmentDate.diff(dateCreated, 'days', true)) : '';
        setAppointmentDays(AppointmentDays);
    };

    const [patient, setPatient] = React.useState({
        Id: 0,
        Age: '',
        Gender: '',
        Address: '',
        PhoneNumber: '',
        AppointmentDate: null,
    });
    const handleAppointmentDateChange = (date) => {
        const AppointmentDate = moment(date).isValid() ?
            date.format() : null;
        setPatient({
            ...patient,
            AppointmentDate,
        });

        calculateAppointmentDay(date, prescription.DateCreated);

        // medicines.map((medicine) => calculateMedicineQuantity(medicine, date));
        // setMedicines([...medicines]);
    };
    // const calculateMedicineQuantity = (medicine, appointmentDate) => {
    //     const days = moment(appointmentDate).isValid() ?
    //         _.round(appointmentDate.diff(prescription.DateCreated, 'days', true)) : 0;

    //     const takeTimes = _.toNumber(medicine.TakeTimes);
    //     const amountPerTime = _.toNumber(medicine.AmountPerTime);
    //     let quantity = amountPerTime * takeTimes;
    //     if (days > 1) {
    //         if (medicine.TakePeriod === takePeriodValue.Day) {
    //             quantity *= days;
    //         }
    //         if (medicine.TakePeriod === takePeriodValue.Week && days % 7 === 0) {
    //             quantity *= (days / 7);
    //         }
    //         if (medicine.TakePeriod === takePeriodValue.Month && days % 30 === 0) {
    //             quantity *= (days / 30);
    //         }
    //     }

    //     return {
    //         ...medicine,
    //         Quantity: _.toString(quantity),
    //     };
    // };

    const [prescription, setPrescription] = React.useState({
        IdCode: '',
        DateCreated: moment(),
        Diagnosis: '',
        OtherDiagnosis: '',
        Note: '',
        Status: PrescriptionStatusEnum[PrescriptionStatus.IsNew],
        PatientId: '',
        HistoryId: '',
    });
    const handlePrescriptionChange = prop => event => {
        setPrescription({
            ...prescription,
            [prop]: event.target.value,
        });
    };
    const handleDateCreatedChange = (date) => {
        setPrescription({
            ...prescription,
            DateCreated: date,
        });
    };

    const [medicines, setMedicines] = React.useState([{
        PrescriptionId: '',
        MedicineId: '',
        Ingredient: '',
        NetWeight: '',
        Quantity: '',
        Unit: '',
        TakePeriod: takePeriodValue.Day,
        TakeMethod: '',
        TakeTimes: '',
        AmountPerTime: '',
        MealTime: '',
        Note: '',
    }]);
    const handleMedicinesChange = (index, prop) => event => {
        medicines[index][prop] = event.target.value;
        setMedicines([...medicines]);
    };
    // const handleMedicinesBlur = (index, prop) => event => {
    //     medicines[index] = calculateMedicineQuantity(medicines[index], patient.AppointmentDate);
    //     setMedicines([...medicines]);
    // };

    const [medicineNames, setMedicineNames] = React.useState([{
        value: null,
    }]);
    const handleMedicineNameChange = index => (event, value) => {
        const medicineId = value ? value.id : '';
        const unit = value ? value.unit : '';
        const netWeight = value ? value.netWeight : '';

        medicines[index].MedicineId = medicineId;
        medicines[index].NetWeight = netWeight;
        medicines[index].Unit = unit;
        if (unit.toLowerCase() === 'viên') {
            medicines[index].TakeMethod = 'Uống';
        }

        medicineNames[index].value = value;

        setMedicines([...medicines]);
        setMedicineNames([...medicineNames]);
        getIngredientOptions(index, medicineId);
    };

    const handleMedicineMealTimeChange = index => (event, value) => {
        const mealTime = value ? value : '';
        medicines[index].MealTime = mealTime;
        setMedicines([...medicines]);
    };
    const handleMedicineMealTimeBlur = index => event => {
        const mealTime = event.target.value;
        medicines[index].MealTime = mealTime;
        setMedicines([...medicines]);
    };

    const handleMedicineNoteChange = index => (event, value) => {
        const note = value ? value : '';
        medicines[index].Note = note;
        setMedicines([...medicines]);
    };
    const handleMedicineNoteBlur = index => event => {
        const note = event.target.value;
        medicines[index].Note = note;
        setMedicines([...medicines]);
    };

    const [diagnosisValue, setDiagnosisValue] = React.useState(null);
    const handleDiagnosisValueChange = (event, value) => {
        const diagnosis = value ? value.name : '';
        setPrescription({
            ...prescription,
            Diagnosis: diagnosis,
        })
        setDiagnosisValue(value);
    };
    const handleDiagnosisValueBlur = (event) => {
        const diagnosis = event.target.value;
        setPrescription({
            ...prescription,
            Diagnosis: diagnosis,
        });
    };

    const handlePopMedicine = index => event => {
        medicines.splice(index, 1);
        medicineNames.splice(index, 1);
        ingredientOptions.splice(index, 1);
        setMedicines([...medicines]);
        setMedicineNames([...medicineNames]);
        setIngredientOptions([...ingredientOptions]);
    };

    const handlePushMedicine = () => {
        medicines.push({
            PrescriptionId: '',
            MedicineId: '',
            Ingredient: '',
            NetWeight: '',
            Quantity: '',
            Unit: '',
            TakePeriod: takePeriodValue.Day,
            TakeMethod: '',
            TakeTimes: '',
            AmountPerTime: '',
            MealTime: '',
            Note: '',
        });
        medicineNames.push({
            value: null,
        });
        ingredientOptions.push(ingredientOption);
        setMedicines([...medicines]);
        setMedicineNames([...medicineNames]);
        setIngredientOptions([...ingredientOptions]);
    };

    const handleReset = () => {
        setMedicineNames([{
            value: null,
        }]);
        setIngredientOptions([ingredientOption]);
        setDiagnosisValue(null);
        setPatient({
            ...patient,
            AppointmentDate: null,
        })
        setPrescription({
            ...prescription,
            DateCreated: moment(),
            Diagnosis: '',
            OtherDiagnosis: '',
            Note: '',
        });
        setMedicines([{
            PrescriptionId: '',
            MedicineId: '',
            Ingredient: '',
            NetWeight: '',
            Quantity: '',
            Unit: '',
            TakePeriod: takePeriodValue.Day,
            TakeMethod: '',
            TakeTimes: '',
            AmountPerTime: '',
            MealTime: '',
            Note: '',
        }]);
        setAppointmentDays('');
    };

    const handleDone = () => {
        if (!patientNameValue) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên bệnh nhân!');
            return;
        }
        if (patient.AppointmentDate && !moment(patient.AppointmentDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày hẹn tái khám hợp lệ (không có để trống)!');
            return;
        }
        if (!prescription.DateCreated) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn!');
            return;
        }
        if (prescription.DateCreated && !moment(prescription.DateCreated).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn hợp lệ!');
            return;
        }
        for (let medicine of medicines) {
            if (!_.isFinite(medicine.MedicineId)) {
                handleSnackbarOption('error', 'Yêu cầu chọn mặt hàng thuốc!');
                return;
            }
            if (!_.toString(medicine.Quantity).trim() && !_.isFinite(_.toNumber(medicine.Quantity))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Số lượng!');
                return;
            }
            if (!medicine.Unit.trim()) {
                handleSnackbarOption('error', 'Yêu cầu chọn đơn vị thuốc!');
                return;
            }
            if (_.toString(medicine.TakeTimes).trim() && !_.isFinite(_.toNumber(medicine.TakeTimes))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Mỗi ngày!');
                return;
            }
            if (_.toString(medicine.AmountPerTime).trim() && !_.isFinite(_.toNumber(medicine.AmountPerTime))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Mỗi lần dùng!');
                return;
            }
        }

        setDisabled(true);
        setLoadingDone(true);

        const DateCreated =
            moment(prescription.DateCreated).isValid() ?
                prescription.DateCreated.format() : moment().format();
        const prescriptionModel = {
            ...prescription,
            DateCreated,
        };
        if (!updateMode) {
            addPrescription(prescriptionModel);
        } else {
            updatePrescription(prescriptionModel);
        }
    };

    const addPrescription = (prescriptionModel) => {
        Axios.post(AddPrescriptionsUrl, prescriptionModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id } = data;
                if (!_.isEmpty(medicines)) {
                    const medicineModels = [];
                    medicines.map((medicine) => {
                        medicineModels.push({
                            ...medicine,
                            PrescriptionId: id,
                        })
                    });
                    addMedicines(medicineModels);
                }
            } else {
                handleSnackbarOption('error', SnackbarMessage.CreatePrescriptionError);
                setDisabled(false);
                setLoadingDone(false);
            }
        }).catch((reason) => {
            handleError(reason, addPrescriptionErrorMsg);
            handleSnackbarOption('error', SnackbarMessage.CreatePrescriptionError);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const addMedicines = (medicineModels) => {
        Axios.post(AddMedicinesUrl, medicineModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', SnackbarMessage.CreatePrescriptionSuccess);
                updatePatientHistory();
            } else {
                handleSnackbarOption('error', SnackbarMessage.CreatePrescriptionError);
                setDisabled(false);
                setLoadingDone(false);
            }
        }).catch((reason) => {
            handleError(reason, addMedicineErrorMsg);
            handleSnackbarOption('error', SnackbarMessage.CreatePrescriptionError);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updatePatientHistory = () => {
        const url = `${UpdatePatientHistoryUrl}/${patientId}/${historyId}`;

        const updatePatientHistoryModel = {
            AppointmentDate: patient.AppointmentDate,
            Status: PatientStatusEnum[PatientStatus.IsChecked],
        };

        Axios.patch(url, updatePatientHistoryModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                if (!updateMode) {
                    updateMedicinesQuantity();
                } else {
                    restoreMedicinesQuantity();
                }
            } else {
                handleSnackbarOption('error', SnackbarMessage.CreatePrescriptionError);
                setDisabled(false);
                setLoadingDone(false);
            }
        }).catch((reason) => {
            handleError(reason, updatePatientHistoryErrorMsg);
            handleSnackbarOption('error', SnackbarMessage.CreatePrescriptionError);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateMedicinesQuantity = () => {
        const medicineUpdateModels = [];
        medicines.map(({ MedicineId, Quantity }) => medicineUpdateModels.push({
            Id: MedicineId,
            Quantity,
        }));

        Axios.patch(UpdateMedicinesQuantityUrl, medicineUpdateModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Update Medicines Quantity: - OK!');
            } else {
                console.log('[Update Medicines Quantity: - Error!');
                handleError(response, updateMedicinesQuantityErrorMsg);
            }
            handleReset();

            setDisabled(false);
            setLoadingDone(false);
            setTimeout(() => {
                browserHistory.push(RouteConstants.DashboardView);
            }, 1000);
        }).catch((reason) => {
            handleError(reason, updateMedicinesQuantityErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
            setTimeout(() => {
                browserHistory.push(RouteConstants.DashboardView);
            }, 1000);
        });
    };

    const [medicineRestoreModels, setMedicineRestoreModels] = React.useState([{
        Id: '',
        Quantity: '',
    }]);
    const restoreMedicinesQuantity = () => {
        Axios.patch(RestoreMedicinesQuantityUrl, medicineRestoreModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Restore Medicines Quantity: - OK!');
            } else {
                console.log('[Restore Medicines Quantity: - Error!');
                handleError(response, restoreMedicinesQuantityErrorMsg);
            }
            updateMedicinesQuantity();
        }).catch((reason) => {
            handleError(reason, restoreMedicinesQuantityErrorMsg);
            updateMedicinesQuantity();
        });
    };

    const updatePrescription = (prescriptionModel) => {
        const url = `${UpdatePrescriptionsUrl}/${prescriptionId}`;
        Axios.put(url, prescriptionModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                if (!_.isEmpty(medicines)) {
                    const medicineModels = [];
                    medicines.map((medicine) => {
                        medicineModels.push({
                            ...medicine,
                            PrescriptionId: prescriptionId,
                        })
                    });
                    updateMedicines(medicineModels);
                }
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật đơn thuốc. Vui lòng thử lại sau!');
                handleError(response, updatePrescriptionErrorMsg);
                setDisabled(false);
                setLoadingDone(false);
            }
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi cập nhật đơn thuốc. Vui lòng thử lại sau!');
            handleError(reason, updatePrescriptionErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateMedicines = (medicineModels) => {
        const url = `${UpdateMedicinesUrl}/${prescriptionId}`;
        Axios.put(url, medicineModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật đơn thuốc thành công!');
                updatePatientHistory();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật đơn thuốc. Vui lòng thử lại sau!');
                handleError(response, updateMedicineErrorMsg);
                setDisabled(false);
                setLoadingDone(false);
            }
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi cập nhật đơn thuốc. Vui lòng thử lại sau!');
            handleError(reason, updateMedicineErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const getPatient = (selectedPatientId) => {
        setDisabled(true);

        const url = `${GetCurrentPatientUrl}/${selectedPatientId}`;
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
                    appointmentDate,
                } = data[0].patient;

                const nameValue = patientNameOptions.find(p => p.id === id);
                setPatientNameValue(nameValue);
                setPatientId(id);
                setPatient({
                    ...patient,
                    Id: id,
                    Age: age,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                    AppointmentDate: moment(appointmentDate).isValid() ? moment(appointmentDate) : null,
                });
                if (!updateMode) {
                    const currentHistoryId =
                        (data[0].history && data[0].history.id) ?
                            data[0].history.id : null;
                    if ((!data[0].history || !data[0].history.id)) {
                        handleSnackbarOption('error', `Bệnh nhân này đã được khám xong.
                        ${' '}Vui lòng chọn bệnh nhân khác!`);
                    }
                    setHistoryId(currentHistoryId);
                    setPrescription({
                        ...prescription,
                        IdCode: idCode,
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

    const getPrescription = (selectedPrescriptionId) => {
        setDisabled(true);
        const url = `${GetPrescriptionUrl}/${selectedPrescriptionId}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { 0: selectedPrescription } = data;
                onCopyPrescription(selectedPrescription);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getPrescriptionErrorMsg);
            setDisabled(false);
        });
    };

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

    const [medicineNameOptions, setMedicineNameOptions] = React.useState([{
        id: '',
        name: '',
        netWeight: '',
        quantity: '',
        unit: '',
    }]);
    const getOptionLabel = (option) => option.name;
    const getMedicineNameOptions = () => {
        Axios.get(GetMedicineNameOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                setMedicineNameOptions(data);
                setStopLoadingMedicineName(true);
            }
        }).catch((reason) => {
            handleError(reason, getMedicineErrorMsg);
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

    const [unitOptions, setUnitOptions] = React.useState([{
        label: '',
        value: '',
    }]);
    const getUnitOptions = () => {
        Axios.get(GetUnitNameOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [];
                data.map(({ name }) => options.push({
                    label: name,
                    value: name,
                }));
                setUnitOptions(options);
                setStopLoadingUnitName(true);
            }
        }).catch((reason) => {
            handleError(reason, getUnitsErrorMsg);
        });
    };

    const ingredientOption = [{
        label: '',
        value: '',
    }];
    const [ingredientOptions, setIngredientOptions] = React.useState([ingredientOption]);
    const getIngredientOptions = (index, medicineId) => {
        const data = ingredients.filter(i => i.medicineId === medicineId);
        if (!_.isEmpty(data)) {
            const options = [];
            data.map(({ name }) => options.push({
                label: name,
                value: name,
            }));
            ingredientOptions[index] = options;
            setIngredientOptions([...ingredientOptions]);

            const { 0: ingredient } = data;
            medicines[index].Ingredient = ingredient.name;
            setMedicines([...medicines]);
        }
    };

    const [openPrescriptionList, setOpenPrescriptionList] = React.useState(false);
    const onOpenPrescriptionList = () => {
        setOpenPrescriptionList(true);
    };
    const onClosePrescriptionList = () => {
        setOpenPrescriptionList(false);
    };
    const onCopyPrescription = (selectedPrescription) => {
        const { id, idCode, dateCreated, diagnosis, otherDiagnosis, note } = selectedPrescription;
        const value = diagnosisOptions
            .find(d => d.name = diagnosis) || {
            id: '',
            name: diagnosis,
        };
        
        calculateAppointmentDay(patient.AppointmentDate, dateCreated);
        getMedicineList(id);
        setDiagnosisValue(value);
        if (!updateMode) {
            setPrescription({
                ...prescription,
                IdCode: idCode,
                Diagnosis: diagnosis,
                OtherDiagnosis: otherDiagnosis,
                Note: note,
            });
        } else {
            const DateCreated = moment(dateCreated).isValid() ? moment(dateCreated) : moment();
            setPrescription({
                ...prescription,
                IdCode: idCode,
                DateCreated,
                Diagnosis: diagnosis,
                OtherDiagnosis: otherDiagnosis,
                Note: note,
            });
        }
        setOpenPrescriptionList(false);
    };

    const getMedicineList = (id) => {
        const url = `${GetMedicineListUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const ms = [];
                const mns = [];
                const ios = [];
                const rms = [];
                data.map((m) => {
                    const {
                        medicineId,
                        ingredient,
                        netWeight,
                        quantity,
                        unit,
                        takePeriod,
                        takeMethod,
                        takeTimes,
                        amountPerTime,
                        mealTime,
                        note,
                    } = m;

                    ms.push({
                        PrescriptionId: '',
                        MedicineId: medicineId,
                        Ingredient: ingredient,
                        NetWeight: netWeight,
                        Quantity: _.toString(quantity),
                        Unit: unit,
                        TakePeriod: takePeriod,
                        TakeMethod: takeMethod,
                        TakeTimes: _.toString(takeTimes),
                        AmountPerTime: _.toString(amountPerTime),
                        MealTime: mealTime,
                        Note: note,
                    });

                    let value = medicineNameOptions.find(m => m.id === medicineId);
                    mns.push({
                        value,
                    });

                    let data = ingredients.filter(i => i.medicineId === medicineId);
                    let options = [];
                    if (_.isEmpty(data)) {
                        options.push({
                            label: '',
                            name: '',
                        });
                    } else {
                        data.map(({ name }) => options.push({
                            label: name,
                            value: name,
                        }));
                    }
                    ios.push(options);

                    rms.push({
                        Id: medicineId,
                        Quantity: _.toString(quantity),
                    });
                });
                setMedicineNames(mns);
                setIngredientOptions(ios);
                setMedicines(ms);
                setMedicineRestoreModels(rms);
            } else {
                handleSnackbarOption('error', SnackbarMessage.GetMedicineListError);
                handleError(response, getMedicineListErrorMsg);
            }
        }).catch((reason) => {
            handleSnackbarOption('error', SnackbarMessage.GetMedicineListError);
            handleError(reason, getMedicineListErrorMsg);
        });
    };

    const [ingredients, setIngredients] = React.useState([{
        medicineId: '',
        name: '',
    }]);
    const getIngredients = () => {
        Axios.get(GetIngredientOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                setIngredients(data);
                setStopLoadingIngredientName(true);
            }
        }).catch((reason) => {
            handleError(reason, getIngredientsErrorMsg);
        });
    };

    React.useEffect(() => {
        getPatientNameOptions();
        getIngredients();
        getMedicineNameOptions();
        getDiagnosisOptions();
        getUnitOptions();
        handleUpdate();
    }, []);

    React.useEffect(() => {
        if (stopLoadingPatientName &&
            stopLoadingMedicineName &&
            stopLoadingDiagnosisName &&
            stopLoadingUnitName &&
            stopLoadingIngredientName &&
            updateMode) {
            getPatient(patientId);
            getPrescription(prescriptionId);
        }
    }, [stopLoadingPatientName,
        stopLoadingMedicineName,
        stopLoadingDiagnosisName,
        stopLoadingUnitName,
        stopLoadingIngredientName,
        updateMode]);

    return (
        <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        classes={{
                            action: classes.action,
                        }}
                        action={
                            <Button
                                color="info"
                                children="Sao chép"
                                iconName="copy"
                                disabled={disabled}
                                onClick={onOpenPrescriptionList}
                            />
                        }
                        title="PHIẾU KÊ ĐƠN THUỐC"
                        subheader="Kê đơn thuốc mới cho bệnh nhân"
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
                                <Grid container item xs={12} sm={12} md={6} lg={6} xl={6} spacing={1}>
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
                                            label="Mã đơn thuốc"
                                            value={prescription.IdCode}
                                            onChange={handlePrescriptionChange('IdCode')}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <DatePicker
                                            fullWidth
                                            margin="dense"
                                            id="DateCreated"
                                            label="Ngày kê đơn"
                                            value={prescription.DateCreated}
                                            onChange={(date) => handleDateCreatedChange(date)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <Autocomplete
                                            fullWidth
                                            freeSolo
                                            margin="dense"
                                            id="Diagnosis"
                                            label="Chẩn đoán"
                                            options={diagnosisOptions}
                                            getOptionLabel={option => getOptionLabel(option)}
                                            value={diagnosisValue}
                                            onChange={handleDiagnosisValueChange}
                                            onBlur={handleDiagnosisValueBlur}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <TextField
                                            id="OtherDiagnosis"
                                            label="Chẩn đoán khác"
                                            value={prescription.OtherDiagnosis}
                                            onChange={handlePrescriptionChange('OtherDiagnosis')}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            id="Note"
                                            label="Dặn dò"
                                            value={prescription.Note}
                                            onChange={handlePrescriptionChange('Note')}
                                            fullWidth
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <TextField
                                            id="appointmentDays"
                                            label="Tái khám sau"
                                            value={appointmentDays}
                                            onChange={handleAppointmentDayChange}
                                            onBlur={handleAppointmentDayBlur}
                                            onKeyPress={handleAppointmentDayEnter}
                                            fullWidth
                                            style={{
                                                marginTop: 0,
                                                marginBottom: 0,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <DatePicker
                                            fullWidth
                                            id="AppointmentDate"
                                            label="Hẹn tái khám (nếu có)"
                                            value={patient.AppointmentDate}
                                            onChange={(date) => handleAppointmentDateChange(date)}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container item xs={12} sm={12} md={6} lg={6} xl={6} spacing={1}>
                                    {
                                        medicines.map((medicine, index) => (
                                            <React.Fragment key={index}>
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Autocomplete
                                                        fullWidth
                                                        id={`MedicineId${index}`}
                                                        label="Mặt hàng thuốc"
                                                        options={medicineNameOptions}
                                                        getOptionLabel={(option) => getOptionLabel(option)}
                                                        value={medicineNames[index] ? medicineNames[index].value : null}
                                                        onChange={handleMedicineNameChange(index)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Select
                                                        fullWidth
                                                        id={`Ingredient${index}`}
                                                        label="Hoạt chất"
                                                        value={medicine.Ingredient}
                                                        options={ingredientOptions[index]}
                                                        onChange={handleMedicinesChange(index, 'Ingredient')}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                    <TextField
                                                        id={`Quantity${index}`}
                                                        label="Số lượng"
                                                        value={medicine.Quantity}
                                                        onChange={handleMedicinesChange(index, 'Quantity')}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                    <Select
                                                        fullWidth
                                                        id={`Unit${index}`}
                                                        label="Đơn vị"
                                                        value={medicine.Unit}
                                                        options={unitOptions}
                                                        onChange={handleMedicinesChange(index, 'Unit')}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <Select
                                                        fullWidth
                                                        id={`TakePeriod${index}`}
                                                        llabel="Thời gian"
                                                        value={medicine.TakePeriod}
                                                        options={takePeriodOptions}
                                                        onChange={handleMedicinesChange(index, 'TakePeriod')} />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <TextField
                                                        id={`TakeMethod${index}`}
                                                        label="Phương thức"
                                                        value={medicine.TakeMethod}
                                                        onChange={handleMedicinesChange(index, 'TakeMethod')}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <TextField
                                                        id={`TakeTimes${index}`}
                                                        label="Số lần"
                                                        value={medicine.TakeTimes}
                                                        onChange={handleMedicinesChange(index, 'TakeTimes')}
                                                        placeholder="...lần"
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <TextField
                                                        id={`AmountPerTime${index}`}
                                                        label="Mỗi lần dùng"
                                                        value={medicine.AmountPerTime}
                                                        onChange={handleMedicinesChange(index, 'AmountPerTime')}
                                                        // onBlur={handleMedicinesBlur(index, 'AmountPerTime')}
                                                        placeholder={`...${medicine.Unit}`}
                                                        fullWidth
                                                        style={{
                                                            marginTop: 0,
                                                            marginBottom: 0,
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <Autocomplete
                                                        fullWidth
                                                        freeSolo
                                                        id={`MealTime${index}`}
                                                        label="... ăn"
                                                        options={mealTimeOptions}
                                                        getOptionLabel={(option) => option}
                                                        value={medicine.MealTime}
                                                        onChange={handleMedicineMealTimeChange(index)}
                                                        onBlur={handleMedicineMealTimeBlur(index)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}
                                                    style={{
                                                        paddingBottom: 0,
                                                    }}
                                                >
                                                    <Autocomplete
                                                        fullWidth
                                                        freeSolo
                                                        id={`Note${index}`}
                                                        label="Lưu ý"
                                                        options={medicineNoteOptions}
                                                        getOptionLabel={(option) => option}
                                                        value={medicine.Note}
                                                        onChange={handleMedicineNoteChange(index)}
                                                        onBlur={handleMedicineNoteBlur(index)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                                    style={{
                                                        paddingTop: 0,
                                                        paddingBottom: 0,
                                                        borderBottom: '2px solid',
                                                        borderBottomStyle: 'dashed',
                                                    }}
                                                >
                                                    <Grid
                                                        container
                                                        justify="flex-end"
                                                        alignItems="center"
                                                        spacing={2}
                                                        style={{ width: '100%', margin: 0 }}
                                                    >
                                                        {
                                                            medicines.length > 1 &&
                                                            <Grid item>
                                                                <FabButton
                                                                    color="danger"
                                                                    iconName="delete"
                                                                    onClick={handlePopMedicine(index)}
                                                                />
                                                            </Grid>
                                                        }
                                                        {
                                                            index === medicines.length - 1 &&
                                                            <Grid item
                                                                style={{
                                                                    paddingRight: 0,
                                                                }}
                                                            >
                                                                <FabButton
                                                                    color="success"
                                                                    iconName="add"
                                                                    onClick={handlePushMedicine}
                                                                />
                                                            </Grid>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </React.Fragment>
                                        ))
                                    }
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
            <PrescriptionListView
                open={openPrescriptionList}
                patientId={`${patientId}`}
                handleClose={onClosePrescriptionList}
                handleCopy={(selectedPrescription) => onCopyPrescription(selectedPrescription)}
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
};

export default PrescriptionManagement;
