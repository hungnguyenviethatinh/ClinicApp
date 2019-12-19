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

import Axios, {
    axiosRequestConfig,
} from '../../common';

import {
    PrescriptionStatusEnum,
    PrescriptionStatus,
    ExpiredSessionMsg,
    NotFoundMsg,
    AddressSeperator,
    DataDateTimeFormat,
    Gender,
    PatientStatusEnum,
    PatientStatus,
    RouteConstants,
} from '../../constants';

import {
    GetMedicineNameOptionsUrl,
    GetDiagnosisNameOptionsUrl,
    GetUnitNameOptionsUrl,
    GetCurrentPatientUrl,
    AddPrescriptionsUrl,
    AddMedicinesUrl,
    UpdatePatientHistoryUrl,
    UpdatePatientStatusUrl,
    UpdateMedicinesQuantityUrl,
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
}));

const getPatientErrorMsg = '[Get Patient Error] ';
const updatePatientHistoryErrorMsg = '[Update Patient Error] ';
const updateMedicinesQuantityErrorMsg = '[Update Medicines Error] ';
const getMedicineErrorMsg = '[Get Medicines Error] ';
const addPrescriptionErrorMsg = '[Add Prescription Error] ';
const addMedicineErrorMsg = '[Add Medicines Error] ';
const getDiagnosesErrMsg = '[Get Diagnoses Error] ';
const getUnitsErrorMsg = '[Get Units Error] ';

const appointmentDateOptions = [
    { label: 'Vui lòng chọn...', value: '' },
    { label: '1 tuần', value: 7 },
    { label: '2 tuần', value: 14 },
    { label: '1 tháng', value: 30 },
];

const PrescriptionManagement = () => {
    const classes = useStyles();
    const history = useHistory();

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

    const [appointmentDate, setAppointmentDate] = React.useState('');
    const [patient, setPatient] = React.useState({
        Id: '',
        FullName: '',
        DateOfBirth: '',
        Gender: '',
        Address: '',
        PhoneNumber: '',
        AppointmentDate: null,
    });
    const handleAppointmentDateChange = (event) => {
        const days = event.target.value;
        setAppointmentDate(days);

        if (_.isFinite(days)) {
            const date = moment().add(days, 'day');
            setPatient({
                ...patient,
                AppointmentDate: date.format(DataDateTimeFormat),
            });
            medicines.map((medicine) => {
                const afterBreakfast = _.toNumber(medicine.AfterBreakfast);
                const afterLunch = _.toNumber(medicine.AfterLunch);
                const afterNoon = _.toNumber(medicine.Afternoon);
                const afterDinner = _.toNumber(medicine.AfterDinner);
                const quantity = (afterBreakfast + afterLunch + afterNoon + afterDinner) * days;
                medicine.Quantity = _.toString(quantity);
            });
            setMedicines([...medicines]);
        } else {
            setPatient({
                ...patient,
                AppointmentDate: null,
            });
            medicines.map((medicine) => {
                const afterBreakfast = _.toNumber(medicine.AfterBreakfast);
                const afterLunch = _.toNumber(medicine.AfterLunch);
                const afterNoon = _.toNumber(medicine.Afternoon);
                const afterDinner = _.toNumber(medicine.AfterDinner);
                const quantity = afterBreakfast + afterLunch + afterNoon + afterDinner;
                medicine.Quantity = _.toString(quantity);
            });
            setMedicines([...medicines]);
        }
    };

    const [prescription, setPrescription] = React.useState({
        Diagnosis: '',
        Note: '',
        Status: PrescriptionStatusEnum[PrescriptionStatus.IsNew],
        PatientId: '',
        DoctorId: '',
        HistoryId: '',
    });
    const handlePrescriptionChange = prop => event => {
        setPrescription({
            ...prescription,
            [prop]: event.target.value,
        });
    };

    const [medicines, setMedicines] = React.useState([{
        PrescriptionId: '',
        MedicineId: '',
        Quantity: '',
        Unit: '',
        Price: '',
        TimesPerDay: '',
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
        const afterBreakfast = _.toNumber(medicine.AfterBreakfast);
        const afterLunch = _.toNumber(medicine.AfterLunch);
        const afterNoon = _.toNumber(medicine.Afternoon);
        const afterDinner = _.toNumber(medicine.AfterDinner);
        const quantity = afterBreakfast + afterLunch + afterNoon + afterDinner;
        const maxQuantity = medicineNameOptions.find(m => m.id === medicine.MedicineId).quantity;

        if (quantity > _.toNumber(maxQuantity)) {
            handleSnackbarOption('error', `Không đủ thuốc! Số lượng thuốc còn lại trong kho: ${maxQuantity}.`)
        } else {
            medicines[index].Quantity = _.toString(quantity);
            setMedicines([...medicines]);
        }
    };

    const [medicineName, setMedicineName] = React.useState(null);
    const handleMedicineNameChange = index => (event, value) => {
        medicines[index].MedicineId = value ? value.id : '';
        medicines[index].Unit = value ? value.unit : '';
        setMedicines([...medicines]);
        setMedicineName(value);
    };

    const handlePopMedicine = index => event => {
        medicines.splice(index, 1);
        setMedicines([...medicines]);
    };

    const handlePushMedicine = () => {
        medicines.push({
            PrescriptionId: '',
            MedicineId: '',
            Quantity: '',
            Unit: '',
            Price: '',
            TimesPerDay: '',
            AfterBreakfast: '',
            AfterLunch: '',
            Afternoon: '',
            AfterDinner: '',
            Note: '',
        });
        setMedicines([...medicines]);
    };

    const handleReset = () => {
        setAppointmentDate('');
        setPatient({
            ...patient,
            AppointmentDate: null,
        })
        setPrescription({
            ...prescription,
            Diagnosis: '',
            Note: '',
        });
        setMedicines([{
            PrescriptionId: '',
            MedicineId: '',
            Quantity: '',
            Unit: '',
            Price: '',
            TimesPerDay: '',
            AfterBreakfast: '',
            AfterLunch: '',
            Afternoon: '',
            AfterDinner: '',
            Note: '',
        }]);
    };

    const handleDone = () => {
        if (!patient.FullName.trim()) {
            handleSnackbarOption('error', 'Chưa chọn bệnh nhân để kê đơn!');
            return;
        }
        if (patient.AppointmentDate && !moment(patient.AppointmentDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày giờ hẹn tái khám hợp lệ (không có để trống)!');
            return;
        }
        if (!prescription.Diagnosis.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập chẩn đoán!');
            return;
        }
        for (let medicine of medicines) {
            if (!_.isFinite(medicine.MedicineId)) {
                handleSnackbarOption('error', 'Yêu cầu nhập mặt hàng thuốc!');
                return;
            }
            if (!medicine.Quantity.trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập số lượng!');
                return;
            }
            if (medicine.Quantity.trim() && !_.isFinite(_.toNumber(medicine.Quantity))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Số lượng!');
                return;
            }
            if (!medicine.Unit.trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập đơn vị!');
                return;
            }
            if (!medicine.TimesPerDay.trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập số lần uống Mỗi ngày!');
                return;
            }
            if (medicine.TimesPerDay.trim() && !_.isFinite(_.toNumber(medicine.TimesPerDay))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Mỗi ngày!');
                return;
            }
            if (_.toNumber(medicine.TimesPerDay) !== [
                medicine.AfterBreakfast,
                medicine.AfterLunch,
                medicine.Afternoon,
                medicine.AfterDinner].filter(value => (value.trim() && true)).length) {
                handleSnackbarOption('error', 'Số lần uống mỗi ngày dư hoặc thiếu!');
                return;
            }
            if (medicine.AfterBreakfast.trim() && !_.isFinite(_.toNumber(medicine.AfterBreakfast))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Sáng!');
                return;
            }
            if (medicine.AfterLunch.trim() && !_.isFinite(_.toNumber(medicine.AfterLunch))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Trưa!');
                return;
            }
            if (medicine.Afternoon.trim() && !_.isFinite(_.toNumber(medicine.Afternoon))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Chiều!');
                return;
            }
            if (medicine.AfterDinner.trim() && !_.isFinite(_.toNumber(medicine.AfterDinner))) {
                handleSnackbarOption('error', 'Yêu cầu nhập số cho trường Tối!');
                return;
            }
        }

        console.log(patient);
        console.log(prescription);
        console.log(medicines);

        const prescriptionModel = {
            ...prescription,
        };
        addPrescription(prescriptionModel);
    };

    const config = axiosRequestConfig();

    const addPrescription = (prescriptionModel) => {
        Axios.post(AddPrescriptionsUrl, prescriptionModel, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id } = data;
                if (!_.isEmpty(medicines)) {
                    const medicineModels = [];
                    medicines.map((medicine) => {
                        const Price = medicineNameOptions
                            .find(value => value.id === medicine.MedicineId).price * _.toNumber(medicine.Quantity);
                        medicineModels.push({
                            ...medicine,
                            PrescriptionId: id,
                            Price,
                        })
                    });
                    addMedicines(medicineModels);
                }
            }
        }).catch((reason) => {
            handleError(reason, addPrescriptionErrorMsg);
            handleSnackbarOption('error', 'Có lỗi khi tạo đơn thuốc mới!');
        });
    };

    const addMedicines = (medicineModels) => {
        Axios.post(AddMedicinesUrl, medicineModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                updatePatientHistory();
            }
        }).catch((reason) => {
            handleError(reason, addMedicineErrorMsg);
            handleSnackbarOption('error', 'Có lỗi khi tạo đơn thuốc mới!');
        });
    };

    const updatePatientHistory = () => {
        const id = patient.Id;
        const medicineUpdateModels = [];
        medicines.map(({ MedicineId, Quantity }) => medicineUpdateModels.push({
            Id: MedicineId,
            Quantity,
        }));

        if (patient.AppointmentDate) {
            Axios.get(`${UpdatePatientHistoryUrl}/${id}`, {
                ...config,
                params: {
                    appointmentDate: patient.AppointmentDate,
                    status: PatientStatusEnum[PatientStatus.IsChecked],
                }
            }).then((response) => {
                const { status } = response;
                if (status === 200) {
                    handleSnackbarOption('success', 'Đơn thuốc mới đã được tạo thành công!');
                    handleReset();
                    updateMedicinesQuantity(medicineUpdateModels);
                } else {
                    handleSnackbarOption('error', 'Có lỗi khi tạo đơn thuốc mới!');
                }
            }).catch((reason) => {
                handleError(reason, updatePatientErrorMsg);
                handleSnackbarOption('error', 'Có lỗi khi tạo đơn thuốc mới!');
            });
        } else {
            const url = `${UpdatePatientStatusUrl}/${id}/${PatientStatusEnum[PatientStatus.IsChecked]}`;
            Axios.get(url, config).then((response) => {
                const { status } = response;
                if (status === 200) {
                    handleSnackbarOption('success', 'Đơn thuốc mới đã được tạo thành công!');
                    handleReset();
                    updateMedicinesQuantity(medicineUpdateModels);
                } else {
                    handleSnackbarOption('error', 'Có lỗi khi tạo đơn thuốc mới!');
                }
            }).catch((reason) => {
                handleError(reason, updatePatientHistoryErrorMsg);
                handleSnackbarOption('error', 'Có lỗi khi tạo đơn thuốc mới!');
            });
        }
    };

    const updateMedicinesQuantity = (medicineUpdateModels) => {
        Axios.put(UpdateMedicinesQuantityUrl, medicineUpdateModels, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log('[Update Medicines Quantity; - OK!');
            } else {
                console.log('[Update Medicines Quantity; - Error!');
            }
            history.push(RouteConstants.DashboardView);
        }).catch((reason) => {
            handleError(reason, updateMedicinesQuantityErrorMsg);
            history.push(RouteConstants.DashboardView);
        });
    };

    const getPatient = () => {
        Axios.get(GetCurrentPatientUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    id,
                    doctorId,
                    fullName,
                    dateOfBirth,
                    gender,
                    address,
                    phoneNumber,
                } = data[0].patient;

                const Address = address
                    .split(AddressSeperator)
                    .filter(value => (value.trim() && true))
                    .join(`${AddressSeperator} `);

                setPatient({
                    ...patient,
                    Id: id,
                    FullName: fullName,
                    DateOfBirth: moment(dateOfBirth).year(),
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address,
                    PhoneNumber: phoneNumber,
                });
                setPrescription({
                    ...prescription,
                    PatientId: id,
                    DoctorId: doctorId,
                    HistoryId: data[0].history.id,
                });
            }
        }).catch((reason) => {
            handleError(reason, getPatientErrorMsg);
        });
    };

    const [medicineNameOptions, setMedicineNameOptions] = React.useState([{
        id: '',
        name: '',
        quantity: '',
        unit: '',
        price: '',
    }]);
    const getOptionLabel = (option) => option.name;
    const getMedicineNameOptions = () => {
        Axios.get(GetMedicineNameOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                setMedicineNameOptions(data);
            }
        }).catch((reason) => {
            handleError(reason, getMedicineErrorMsg);
        });
    };

    const [diagnosisOptions, setDiagnosisOptions] = React.useState([{
        label: '',
        value: '',
    }]);
    const getDiagnosisOptions = () => {
        Axios.get(GetDiagnosisNameOptionsUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [];
                data.map(({ name }) => options.push({
                    label: name,
                    value: name,
                }));
                setDiagnosisOptions(options);
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
            }
        }).catch((reason) => {
            handleError(reason, getUnitsErrorMsg);
        });
    };

    React.useEffect(() => {
        getPatient();
        getMedicineNameOptions();
        getDiagnosisOptions();
        getUnitOptions();
    }, []);

    return (
        <Grid
            container
            spacing={2}
            justify="center"
        >
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="PHIẾU KÊ ĐƠN THUỐC"
                        subheader="Kê đơn thuốc mới cho bệnh nhân hiện tại đang khám"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <TextField
                                        id="FullName"
                                        label="Họ tên BN"
                                        value={patient.FullName}
                                        readOnly
                                        fullWidth
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                                    <TextField
                                        id="DateOfBirth"
                                        label="Năm sinh"
                                        value={patient.DateOfBirth}
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
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
                                    <TextField
                                        id="Address"
                                        label="Địa chỉ"
                                        value={patient.Address}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <TextField
                                        id="PhoneNumber"
                                        label="Số iện thoại"
                                        value={patient.PhoneNumber}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <Select
                                        fullWidth
                                        id="Diagnosis"
                                        label="Chẩn đoán"
                                        value={prescription.Diagnosis}
                                        options={diagnosisOptions}
                                        onChange={handlePrescriptionChange('Diagnosis')}
                                    />
                                </Grid>
                                {
                                    medicines.map((medicine, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                                <Autocomplete
                                                    fullWidth
                                                    id={`MedicineId${index}`}
                                                    label="Mặt hàng thuốc"
                                                    options={medicineNameOptions}
                                                    getOptionLabel={option => getOptionLabel(option)}
                                                    value={medicineName}
                                                    onChange={handleMedicineNameChange(index)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <TextField
                                                    id={`Quantity${index}`}
                                                    label="Số lượng"
                                                    value={medicine.Quantity}
                                                    onChange={handleMedicinesChange(index, 'Quantity')}
                                                    fullWidth
                                                    readOnly
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <Select
                                                    fullWidth
                                                    id={`Unit${index}`}
                                                    label="Đơn vị"
                                                    value={medicine.Unit}
                                                    options={unitOptions}
                                                    onChange={handleMedicinesChange(index, 'Unit')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
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
                                                        <Grid item>
                                                            <FabButton
                                                                color="success"
                                                                iconName="add"
                                                                onClick={handlePushMedicine}
                                                            />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <TextField
                                                    id={`TimesPerDay${index}`}
                                                    label="Ngày uống"
                                                    value={medicine.TimesPerDay}
                                                    onChange={handleMedicinesChange(index, 'TimesPerDay')}
                                                    placeholder="...lần"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <TextField
                                                    id={`Note${index}`}
                                                    label="Lưu ý"
                                                    value={medicine.Note}
                                                    onChange={handleMedicinesChange(index, 'Note')}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    ))
                                }
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
                                    <Select
                                        fullWidth
                                        id="AppointmentDate"
                                        label="Hẹn tái khám (nếu có)"
                                        value={appointmentDate}
                                        options={appointmentDateOptions}
                                        onChange={handleAppointmentDateChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                justify="flex-end"
                                style={{ marginTop: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Button
                                        fullWidth
                                        color="info"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Button
                                        fullWidth
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
}

export default PrescriptionManagement;
