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
import { DateTimePicker } from '../../components/DateTimePicker';
import { PrescriptionListView } from './PrescriptionList';

import Axios, {
    axiosRequestConfig,
} from '../../common';

import {
    PrescriptionStatusEnum,
    PrescriptionStatus,
    ExpiredSessionMsg,
    NotFoundMsg,
    // AddressSeperator,
    Gender,
    PatientStatusEnum,
    PatientStatus,
    RouteConstants,
    SnackbarMessage,
    // IdPrefix,
    takePeriodValue,
    // CurrentCheckingPatientId,
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
    // UpdatePatientStatusUrl,
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

// const appointmentDateOptions = [
//     { label: 'Vui lòng chọn...', value: '' },
//     { label: '1 tuần', value: 7 },
//     { label: '2 tuần', value: 14 },
//     { label: '1 tháng', value: 30 },
// ];

const takePeriodOptions = [
    { label: takePeriodValue.Day, value: takePeriodValue.Day },
    { label: takePeriodValue.Week, value: takePeriodValue.Week },
    { label: takePeriodValue.Month, value: takePeriodValue.Month },
];

const PrescriptionManagement = () => {
    // [Start] Common
    const classes = useStyles();
    const history = useHistory();
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

    // const [appointmentDate, setAppointmentDate] = React.useState('');
    const [patient, setPatient] = React.useState({
        Id: 0,
        // FullName: '',
        // DateOfBirth: '',
        Age: '',
        Gender: '',
        Address: '',
        PhoneNumber: '',
        AppointmentDate: null,
    });
    const handleAppointmentDateChange = (date) => {
        if (moment(date).isValid()) {
            setPatient({
                ...patient,
                AppointmentDate: date.format(),
            });
        } else {
            setPatient({
                ...patient,
                AppointmentDate: null,
            });
        }

        let days = 0;
        const now = moment();
        if (moment(date).isValid()) {
            days = date.diff(now, 'days');
        }
        medicines.map((medicine) => {
            const takeTimes = _.toNumber(medicine.TakeTimes);
            const amountPerTime = _.toNumber(medicine.AmountPerTime);
            const afterBreakfast = _.toNumber(medicine.AfterBreakfast);
            const afterLunch = _.toNumber(medicine.AfterLunch);
            const afterNoon = _.toNumber(medicine.Afternoon);
            const afterDinner = _.toNumber(medicine.AfterDinner);

            let quantity = afterBreakfast + afterLunch + afterNoon + afterDinner;
            if (medicine.TakePeriod !== takePeriodValue.Day) {
                quantity = amountPerTime * takeTimes;
            }

            if (days > 1) {
                if (medicine.TakePeriod === takePeriodValue.Day) {
                    quantity *= days;
                }
                if (medicine.TakePeriod === takePeriodValue.Week && days % 7 === 0) {
                    quantity *= (days / 7);
                }
                if (medicine.TakePeriod === takePeriodValue.Month && days % 30 === 0) {
                    quantity *= (days / 30);
                }
            }
            medicine.Quantity = _.toString(quantity);
        });
        setMedicines([...medicines]);
    };

    const [prescription, setPrescription] = React.useState({
        IdCode: '',
        DateCreated: moment(),
        Diagnosis: '',
        OtherDiagnosis: '',
        Note: '',
        Status: PrescriptionStatusEnum[PrescriptionStatus.IsNew],
        PatientId: '',
        // DoctorId: '',
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
        // Price: '',
        TakePeriod: takePeriodValue.Day,
        TakeMethod: '',
        TakeTimes: '',
        AmountPerTime: '',
        AfterBreakfast: '',
        AfterLunch: '',
        Afternoon: '',
        AfterDinner: '',
        Note: '',
    }]);
    const handleMedicinesChange = (index, prop) => event => {
        medicines[index][prop] = event.target.value;
        setMedicines([...medicines]);
    };
    const handleMedicinesBlur = (index, prop) => event => {
        const medicine = medicines[index];
        const takeTimes = _.toNumber(medicine.TakeTimes);
        const amountPerTime = _.toNumber(medicine.AmountPerTime);
        const afterBreakfast = _.toNumber(medicine.AfterBreakfast);
        const afterLunch = _.toNumber(medicine.AfterLunch);
        const afterNoon = _.toNumber(medicine.Afternoon);
        const afterDinner = _.toNumber(medicine.AfterDinner);

        let days = 0;
        const now = moment();
        if (moment(patient.AppointmentDate).isValid()) {
            days = moment(patient.AppointmentDate).diff(now, 'days');
        }

        let quantity = afterBreakfast + afterLunch + afterNoon + afterDinner;
        if (medicine.TakePeriod !== takePeriodValue.Day) {
            quantity = amountPerTime * takeTimes;
        }

        if (days > 1) {
            if (medicine.TakePeriod === takePeriodValue.Day) {
                quantity *= days;
            }
            if (medicine.TakePeriod === takePeriodValue.Week && days % 7 === 0) {
                quantity *= (days / 7);
            }
            if (medicine.TakePeriod === takePeriodValue.Month && days % 30 === 0) {
                quantity *= (days / 30);
            }
        }

        const maxQuantity = medicineNameOptions.find(m => m.id === medicine.MedicineId).quantity;

        if (quantity > _.toNumber(maxQuantity)) {
            handleSnackbarOption('warning', `Lưu ý số lượng thuốc này còn lại: ${maxQuantity}.`)
        } // else {
        medicines[index].Quantity = _.toString(quantity);
        setMedicines([...medicines]);
        // }
    };

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
        medicineNames[index].value = value;
        setMedicines([...medicines]);
        setMedicineNames([...medicineNames]);
        getIngredientOptions(index, medicineId);
    };

    const [diagnosisValue, setDiagnosisValue] = React.useState(null);
    const handleDiagnosisValueChange = (event, value) => {
        setPrescription({
            ...prescription,
            Diagnosis: value ? value.name : '',
        })
        setDiagnosisValue(value);
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
            // Price: '',
            TakePeriod: takePeriodValue.Day,
            TakeMethod: '',
            TakeTimes: '',
            AmountPerTime: '',
            AfterBreakfast: '',
            AfterLunch: '',
            Afternoon: '',
            AfterDinner: '',
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
        // setAppointmentDate('');
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
            IdCode: '',
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
            // Price: '',
            TakePeriod: takePeriodValue.Day,
            TakeMethod: '',
            TakeTimes: '',
            AmountPerTime: '',
            AfterBreakfast: '',
            AfterLunch: '',
            Afternoon: '',
            AfterDinner: '',
            Note: '',
        }]);
    };

    const handleDone = () => {
        // if (!patient.FullName.trim()) {
        //     handleSnackbarOption('error', 'Chưa chọn bệnh nhân để kê đơn!');
        //     return;
        // }
        if (!patientNameValue) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên bệnh nhân!');
            return;
        }
        if (patient.AppointmentDate && !moment(patient.AppointmentDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày hẹn tái khám hợp lệ (không có để trống)!');
            return;
        }
        if (!prescription.Diagnosis.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập chẩn đoán!');
            return;
        }
        if (!prescription.IdCode.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập mã đơn thuốc!');
            return;
        }
        if (prescription.DateCreated && !moment(prescription.DateCreated).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày kê đơn hợp lệ (không nhập để trống)!');
            return;
        }
        for (let medicine of medicines) {
            if (!_.isFinite(medicine.MedicineId)) {
                handleSnackbarOption('error', 'Yêu cầu nhập mặt hàng thuốc!');
                return;
            }
            if (!_.toString(medicine.Quantity).trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập số lượng!');
                return;
            }
            if (_.toString(medicine.Quantity).trim() && !_.isFinite(_.toNumber(medicine.Quantity))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Số lượng!');
                return;
            }
            if (!medicine.Unit.trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập đơn vị!');
                return;
            }
            if (!_.toString(medicine.TakeTimes).trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập số lần uống Mỗi ngày!');
                return;
            }
            if (_.toString(medicine.TakeTimes).trim() && !_.isFinite(_.toNumber(medicine.TakeTimes))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Mỗi ngày!');
                return;
            }
            if (medicine.TakePeriod === takePeriodValue.Day &&
                _.toNumber(medicine.TakeTimes) !== [
                    medicine.AfterBreakfast,
                    medicine.AfterLunch,
                    medicine.Afternoon,
                    medicine.AfterDinner].filter(value => (_.toString(value).trim() && true)).length) {
                handleSnackbarOption('error', 'Số lần uống mỗi ngày dư hoặc thiếu!');
                return;
            }
            if (_.toString(medicine.AmountPerTime).trim() && !_.isFinite(_.toNumber(medicine.AmountPerTime))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Mỗi lần dùng!');
                return;
            }
            if (_.toString(medicine.AfterBreakfast).trim() && !_.isFinite(_.toNumber(medicine.AfterBreakfast))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Sáng!');
                return;
            }
            if (_.toString(medicine.AfterLunch).trim() && !_.isFinite(_.toNumber(medicine.AfterLunch))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Trưa!');
                return;
            }
            if (_.toString(medicine.Afternoon).trim() && !_.isFinite(_.toNumber(medicine.Afternoon))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Chiều!');
                return;
            }
            if (_.toString(medicine.AfterDinner).trim() && !_.isFinite(_.toNumber(medicine.AfterDinner))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Tối!');
                return;
            }
        }

        // console.log('patient:', patient);
        // console.log('prescription: ', prescription);
        // console.log('medicines: ', medicines);

        setDisabled(true);
        setLoadingDone(true);

        // const IdCode = IdPrefix.Prescription;
        const DateCreated = moment(prescription.DateCreated).isValid() ? prescription.DateCreated.format() : null;
        const prescriptionModel = {
            ...prescription,
            DateCreated,
            // IdCode,
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
                        // const price = medicineNameOptions
                        //     .find(value => value.id === medicine.MedicineId).price * _.toNumber(medicine.Quantity);
                        medicineModels.push({
                            ...medicine,
                            PrescriptionId: id,
                            // Price: price,
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
        const id = patient.Id;
        const url = `${UpdatePatientHistoryUrl}/${id}`;

        // const medicineUpdateModels = [];
        // medicines.map(({ MedicineId, Quantity }) => medicineUpdateModels.push({
        //     Id: MedicineId,
        //     Quantity,
        // }));
        const updatePatientHistoryModel = {
            AppointmentDate: patient.AppointmentDate,
            Status: PatientStatusEnum[PatientStatus.IsChecked],
        };
        // if (patient.AppointmentDate) {
        // Axios.get(`${UpdatePatientHistoryUrl}/${id}`, {
        //     ...config,
        //     params: {
        //         appointmentDate: patient.AppointmentDate,
        //         status: PatientStatusEnum[PatientStatus.IsChecked],
        //     }
        // })

        Axios.patch(url, updatePatientHistoryModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', SnackbarMessage.CreatePrescriptionSuccess);
                handleReset();
                // updateMedicinesQuantity(medicineUpdateModels);
                updateMedicinesQuantity();
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
        // } else {
        //     const url = `${UpdatePatientStatusUrl}/${id}/${PatientStatusEnum[PatientStatus.IsChecked]}`;
        //     Axios.get(url, config).then((response) => {
        //         const { status } = response;
        //         if (status === 200) {
        //             handleSnackbarOption('success', SnackbarMessage.CreatePrescriptionSuccess);
        //             handleReset();
        //             updateMedicinesQuantity(medicineUpdateModels);
        //         } else {
        //             handleSnackbarOption('error', SnackbarMessage.CreatePrescriptionError);
        //             setDisabled(false);
        //             setLoadingDone(false);
        //         }
        //     }).catch((reason) => {
        //         handleError(reason, updatePatientHistoryErrorMsg);
        //         handleSnackbarOption('error', SnackbarMessage.CreatePrescriptionError);
        //         setDisabled(false);
        //         setLoadingDone(false);
        //     });
        // }
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
            setDisabled(false);
            setLoadingDone(false);
            setTimeout(() => {
                history.push(RouteConstants.DashboardView);
            }, 1000);
        }).catch((reason) => {
            handleError(reason, updateMedicinesQuantityErrorMsg);
            setDisabled(false);
            setLoadingDone(false);
            setTimeout(() => {
                history.push(RouteConstants.DashboardView);
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
                        // const price = medicineNameOptions
                        //     .find(value => value.id === medicine.MedicineId).price * _.toNumber(medicine.Quantity);
                        medicineModels.push({
                            ...medicine,
                            PrescriptionId: prescriptionId,
                            // Price: price,
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
                restoreMedicinesQuantity();
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

        // const currentPatientId = localStorage.getItem(CurrentCheckingPatientId) || 0;
        // const url = `${GetCurrentPatientUrl}/${currentPatientId}`;
        const url = `${GetCurrentPatientUrl}/${selectedPatientId}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    id,
                    // doctorId,
                    // fullName,
                    // dateOfBirth,
                    age,
                    gender,
                    address,
                    phoneNumber,
                    appointmentDate,
                } = data[0].patient;

                // const Address = address
                //     .split(AddressSeperator)
                //     .filter(value => (value.trim() && true))
                //     .join(`${AddressSeperator} `);

                const value = patientNameOptions.find(p => p.id === id);
                setPatientNameValue(value);

                setPatient({
                    ...patient,
                    Id: id,
                    // FullName: fullName,
                    // DateOfBirth: moment(dateOfBirth).year(),
                    Age: age,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                    AppointmentDate: moment(appointmentDate).isValid() ? moment(appointmentDate) : null,
                });
                if (!updateMode) {
                    setPrescription({
                        ...prescription,
                        PatientId: id,
                        // DoctorId: doctorId,
                        HistoryId: data[0].history.id,
                    });
                }
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getPatientErrorMsg);
            setDisabled(false);
        });
    };

    const getPrescription = (id) => {
        setDisabled(true);
        const url = `${GetPrescriptionUrl}/${id}`;
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
        const id = value ? value.id : undefined;
        if (id !== undefined) {
            getPatient(id);
        }
        // setPatientNameValue(value);
    };

    const [patientNameOptions, setPatientNameOptions] = React.useState([{
        id: 0,
        idCode: '',
        fullName: '',
    }]);
    const getPatientOptionLabel = (option) => `${option.idCode}${option.id} - ${option.fullName}`;
    const getPatientNameOptions = () => {
        Axios.get(GetPatientOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                if (!_.isEmpty(data)) {
                    setPatientNameOptions(data);
                    setStopLoadingPatientName(true);
                }
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
        // price: '',
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

    // const [diagnosisOptions, setDiagnosisOptions] = React.useState([{
    //     label: '',
    //     value: '',
    // }]);
    const [diagnosisOptions, setDiagnosisOptions] = React.useState([{
        id: '',
        name: '',
    }]);
    const getDiagnosisOptions = () => {
        Axios.get(GetDiagnosisNameOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [];
                // data.map(({ name }) => options.push({
                //     label: name,
                //     value: name,
                // }));
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
        if (medicineId === '') {
            medicineId = 0;
        }

        const data = ingredients.filter(i => i.medicineId === medicineId);
        const options = [];
        if (_.isEmpty(data)) {
            options.push({
                label: '',
                value: '',
            })
        } else {
            data.map(({ name }) => options.push({
                label: name,
                value: name,
            }));
        }
        ingredientOptions[index] = options;
        setIngredientOptions([...ingredientOptions]);

        // const url = `${GetIngredientOptionsUrl}/${medicineId}`;
        // Axios.get(url, config).then((response) => {
        //     const { status, data } = response;
        //     if (status === 200 && !_.isEmpty(data)) {
        //         const options = [];
        //         data.map(({ name }) => options.push({
        //             label: name,
        //             value: name,
        //         }));
        //         ingredientOptions[index] = options;
        //         setIngredientOptions([...ingredientOptions]);
        //     }
        // }).catch((reason) => {
        //     handleError(reason, getIngredientsErrorMsg);
        // });
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
        const value = diagnosisOptions.find(d => d.name = diagnosis);

        getMedicineList(id);
        setDiagnosisValue(value);
        if (!updateMode) {
            setPrescription({
                ...prescription,
                Diagnosis: diagnosis,
                OtherDiagnosis: otherDiagnosis,
                Note: note,
            });
        } else {
            setPrescription({
                ...prescription,
                IdCode: idCode,
                DateCreated: moment(dateCreated).isValid() ? moment(dateCreated) : moment(),
                Diagnosis: diagnosis,
                OtherDiagnosis: otherDiagnosis,
                Note: note,
                PatientId: patientId,
                HistoryId: historyId,
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
                        unit,
                        // price,
                        takePeriod,
                        takeMethod,
                        takeTimes,
                        amountPerTime,
                        afterBreakfast,
                        afterLunch,
                        afternoon,
                        afterDinner,
                        note,
                    } = m;

                    let quantity = afterBreakfast + afterLunch + afternoon + afterDinner;
                    if (takePeriod !== takePeriodValue.Day) {
                        quantity = amountPerTime * takeTimes;
                    }
                    ms.push({
                        PrescriptionId: '',
                        MedicineId: medicineId,
                        Ingredient: ingredient,
                        NetWeight: netWeight,
                        Quantity: quantity,
                        Unit: unit,
                        // Price: price,
                        TakePeriod: takePeriod,
                        TakeMethod: takeMethod,
                        TakeTimes: takeTimes,
                        AmountPerTime: amountPerTime,
                        AfterBreakfast: afterBreakfast,
                        AfterLunch: afterLunch,
                        Afternoon: afternoon,
                        AfterDinner: afterDinner,
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
                        Quantity: quantity,
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
        stopLoadingIngredientName, updateMode]);

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
                                color="warning"
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
                                        {/* <TextField
                                        id="FullName"
                                        label="Họ tên BN"
                                        value={patient.FullName}
                                        readOnly
                                        fullWidth
                                        autoFocus
                                    /> */}
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
                                        {/* <TextField
                                        id="DateOfBirth"
                                        label="Năm sinh"
                                        value={patient.DateOfBirth}
                                        readOnly
                                        fullWidth
                                    /> */}
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
                                        {/* <Select
                                        fullWidth
                                        id="Diagnosis"
                                        label="Chẩn đoán"
                                        value={prescription.Diagnosis}
                                        options={diagnosisOptions}
                                        onChange={handlePrescriptionChange('Diagnosis')}
                                    /> */}
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
                                            rowsMax="5"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        {/* <Select
                                        fullWidth
                                        id="AppointmentDate"
                                        label="Hẹn tái khám (nếu có)"
                                        value={appointmentDate}
                                        options={appointmentDateOptions}
                                        onChange={handleAppointmentDateChange}
                                    /> */}
                                        {/* <DateTimePicker */}
                                        <DatePicker
                                            fullWidth
                                            disablePast
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
                                                        getOptionLabel={option => getOptionLabel(option)}
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
                                                    // readOnly
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
                                                {
                                                    medicine.TakePeriod === takePeriodValue.Day ?
                                                        <React.Fragment>
                                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                                <TextField
                                                                    id={`AfterBreakfast${index}`}
                                                                    label="Sáng"
                                                                    value={medicine.AfterBreakfast}
                                                                    onChange={handleMedicinesChange(index, 'AfterBreakfast')}
                                                                    onBlur={handleMedicinesBlur(index, 'AfterBreakfast')}
                                                                    placeholder={`...${medicine.Unit}`}
                                                                    fullWidth
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                                <TextField
                                                                    id={`AfterLunch${index}`}
                                                                    label="Trưa"
                                                                    value={medicine.AfterLunch}
                                                                    onChange={handleMedicinesChange(index, 'AfterLunch')}
                                                                    onBlur={handleMedicinesBlur(index, 'AfterLunch')}
                                                                    placeholder={`...${medicine.Unit}`}
                                                                    fullWidth
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                                <TextField
                                                                    id={`Afternoon${index}`}
                                                                    label="Chiều"
                                                                    value={medicine.Afternoon}
                                                                    onChange={handleMedicinesChange(index, 'Afternoon')}
                                                                    onBlur={handleMedicinesBlur(index, 'Afternoon')}
                                                                    placeholder={`...${medicine.Unit}`}
                                                                    fullWidth
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                                <TextField
                                                                    id={`AfterDinner${index}`}
                                                                    label="Tối"
                                                                    value={medicine.AfterDinner}
                                                                    onChange={handleMedicinesChange(index, 'AfterDinner')}
                                                                    onBlur={handleMedicinesBlur(index, 'AfterDinner')}
                                                                    placeholder={`...${medicine.Unit}`}
                                                                    fullWidth
                                                                />
                                                            </Grid>
                                                        </React.Fragment>
                                                        :
                                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                            <Grid
                                                                container
                                                                spacing={2}
                                                                justify="flex-start"
                                                            >
                                                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                                    <TextField
                                                                        id={`AmountPerTime${index}`}
                                                                        label="Mỗi lần dùng"
                                                                        value={medicine.AmountPerTime}
                                                                        onChange={handleMedicinesChange(index, 'AmountPerTime')}
                                                                        onBlur={handleMedicinesBlur(index, 'AmountPerTime')}
                                                                        placeholder={`...${medicine.Unit}`}
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                }
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                                    style={{
                                                        paddingBottom: 0,
                                                    }}
                                                >
                                                    <TextField
                                                        id={`Note${index}`}
                                                        label="Lưu ý"
                                                        value={medicine.Note}
                                                        onChange={handleMedicinesChange(index, 'Note')}
                                                        fullWidth
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
                patientId={`${patient.Id}`}
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
}

export default PrescriptionManagement;
