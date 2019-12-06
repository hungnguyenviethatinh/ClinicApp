import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    CssBaseline,
    Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import moment from 'moment';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select';
import { Snackbar } from '../../components/Snackbar';
import { Button, FabButton } from '../../components/Button';
import { Autocomplete } from '../../components/Autocomplete';
import { DateTimePicker } from '../../components/DateTimePicker'

import Axios, {
    axiosConfig,
    axiosConfigJson,
} from '../../common';

import {
    PrescriptionStatusEnum,
    PrescriptionStatus,
    ExpiredSessionMsg,
    NotFoundMsg,
} from '../../constants';
import { 
    GetMedicineNameOptionsUrl, GetCurrentPatientUrl, AddMedicinesUrl, 
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
const getMedicineErrorMsg = '[Get Medicines Error] ';
const addPrescriptionErrorMsg = '[Add Prescription Error] ';
const addMedicineErrorMsg = '[Add Medicines Error] ';

const PrescriptionManagement = () => {

    const classes = useStyles();

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

    const [patient, setPatient] = React.useState({
        FullName: '',
        DateOfBirth: '',
        Gender: '',
        Address: '',
        PhoneNumber: '',
        AppointmentDate: null,
    });
    const handleAppointmentDateChange = (date) => {
        setPatient({
            ...patient,
            AppointmentDate: date,
        });
    };
    const getPatient = () => {
        Axios.get(GetCurrentPatientUrl, axiosConfig()).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    id,
                    fullName,
                    dateOfBirth,
                    gender,
                    address,
                    phoneNumber,
                } = data.patient;
                
                setPatient({
                    ...patient,
                    FullName: fullName,
                    DateOfBirth: moment(dateOfBirth).year(),
                    Gender: gender,
                    Address: address,
                    PhoneNumber: phoneNumber,
                });
                setPrescription({
                    ...prescription,
                    PatientId: id,
                    DoctorId: doctorId,
                    HistoryId: data.history.id,
                });
            }
        }).catch((reason) => {
            handleError(reason, getPatientErrorMsg);
        });
    };

    const [prescription, setPrescription] = React.useState({
        Diagnosis: '',
        Note: '',
        Status: PrescriptionStatusEnum[PrescriptionStatus.IsPending],
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
        AfterDinner: '',
        Note: '',
    }]);
    const handleMedicinesChange = (index, prop) => event => {
        medicines[index][prop] = event.target.value;
        setMedicines([...medicines]);
    };

    const [medicineName, setMedicineName] = React.useState(null);
    const handleMedicineNameChange = index => (event, value) => {
        medicines[index][MedicineId] = value.id;
        setMedicines([...medicines]);
        setMedicineName(value);
    };
    const [medicineNameOptions, setMedicineNameOptions] = React.useState([{
        id: '',
        name: '',
    }]);
    const getOptionLabel = (option) => option.name;
    const getMedicineNameOptions = () => {
        Axios.get(GetMedicineNameOptionsUrl, axiosConfig()).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                data.map(({ id, name }) => ({id, name}));
                setMedicineNameOptions(data);
            }
        }).catch((reason) => {
            handleError(reason, getMedicineErrorMsg);
        });
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
            AfterDinner: '',
            Note: '',
        });
        setMedicines([...medicines]);
    };

    const handleReset = () => {
        setPatient({
            ...patient,
            AppointmentDate: null,
        })
        setPrescription({
            Diagnosis: '',
            Note: '',
            Status: PrescriptionStatusEnum[PrescriptionStatus.IsPending],
            PatientId: '',
            DoctorId: '',
            HistoryId: '',
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
            AfterDinner: '',
            Note: '',
        }]);
    };

    const handleDone = () => {
        if (patient.AppointmentDate && !moment(patient.AppointmentDate).isValid()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày giờ hẹn tái khám hợp lệ (không có để trống)!');
            return;
        }
        if (!prescription.Diagnosis.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập chẩn đoán!');
            return;
        }
        for (let medicine of medicines) {
            if (!medicine.MedicineId.trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập mặt hàng thuốc!');
                return;
            }
            if (!medicine.Quantity.trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập số lượng!');
                return;
            }
            if (!medicine.Unit.trim()) {
                handleSnackbarOption('error', 'Yêu cầu nhập đơn vị!');
                return;
            }
        }

        console.log(patient);
        console.log(prescription);
        console.log(medicines);

        if (patient.FullName.trim() !== '') {
            addPrescription(prescription);
        }
    };

    const addPrescription = (prescriptionModel) => {
        Axios.post(AddPrescriptionUrl, prescriptionModel, axiosConfigJson()).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { id } = data;
                // handleSnackbarOption('success', 'Đơn thuốc mới đã được tạo thành công!');
                // handleReset();
                if (!_.isEmpty(medicines)) {
                    medicines.map(medicine => Object.assign(medicine, {
                        PrescriptionId: id,
                    }));
                    addMedicines(medicines);
                }
            }
        }).catch((reason) => {
            handleError(reason, addPrescriptionErrorMsg);
            handleSnackbarOption('error', 'Có lỗi khi tạo đơn thuốc mới!');
        });
    };

    const addMedicines = (medicineModels) => {
        Axios.post(AddMedicinesUrl, medicineModels, axiosConfigJson()).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Đơn thuốc mới đã được tạo thành công!');
                handleReset();
            }
        }).catch((reason) => {
            handleError(reason, addMedicineErrorMsg);
            handleSnackbarOption('error', 'Có lỗi khi tạo đơn thuốc mới!');
        });
    };

    React.useEffect(() => {
        getPatient();
        getMedicineNameOptions();
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
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <TextField
                                        id="FullName"
                                        label="Họ tên BN"
                                        value={patient.FullName}
                                        readOnly
                                        fullWidth
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
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <TextField
                                        id="Diagnosis"
                                        label="Chẩn đoán"
                                        value={prescription.Diagnosis}
                                        onChange={handlePrescriptionChange('Diagnosis')}
                                        fullWidth
                                        multiline
                                        rowsMax="3"
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
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <TextField
                                                    id={`Unit${index}`}
                                                    label="Đơn vị"
                                                    value={medicine.Unit}
                                                    onChange={handleMedicinesChange(index, 'Unit')}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                <Grid
                                                    container
                                                    justify="flex-end"
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
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                                                    placeholder="...viên"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <TextField
                                                    id={`AfterLunch${index}`}
                                                    label="Trưa"
                                                    value={medicine.AfterLunch}
                                                    onChange={handleMedicinesChange(index, 'AfterLunch')}
                                                    placeholder="...lần"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <TextField
                                                    id={`AfterDinner${index}`}
                                                    label="Tối"
                                                    value={medicine.AfterDinner}
                                                    onChange={handleMedicinesChange(index, 'AfterDinner')}
                                                    placeholder="...lần"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
                                        label="Ghi chú"
                                        value={prescription.Note}
                                        onChange={handlePrescriptionChange('Note')}
                                        fullWidth
                                        multiline
                                        rowsMax="5"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <DateTimePicker
                                        fullWidth
                                        id="AppointmentDate"
                                        label="Hẹn tái khám (nếu có)"
                                        value={patient.AppointmentDate}
                                        onChange={(date) => handleAppointmentDateChange(date)}
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
