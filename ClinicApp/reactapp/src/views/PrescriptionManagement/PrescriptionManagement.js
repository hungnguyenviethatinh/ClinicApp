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

import {
    PrescriptionStatusEnum,
    PrescriptionStatus
} from '../../constants';

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
            AppointmentDate: data,
        });
    };
    const getPatient = () => {

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
        setMedicines(medicines);
    };

    const [medicineName, setMedicineName] = React.useState(null);
    const handleMedicineNameChange = index => (event, value) => {
        medicines[index][MedicineId] = value.Id;
        setMedicines(medicines);
        setMedicineName(value);
    };
    const [medicineNameOptions, setMedicineNameOptions] = React.useState([{
        Id: '',
        Name: '',
    }]);
    const getOptionLabel = (option) => option.Name;
    const getMedicineNames = () => {

    };

    const handlePopMedicine = index => event => {

    };

    const handlePushMedicine = () => {

    };

    const handleReset = () => {

    };

    const handleDone = () => {

    };

    return (
        <Grid
            container
            spacing={2}
            justify="center"
        >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
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
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
                                    <TextField
                                        id="FullName"
                                        label="Họ tên BN"
                                        value={patient.FullName}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
                                    <TextField
                                        id="DateOfBirth"
                                        label="Năm sinh"
                                        value={patient.DateOfBirth}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
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
                                    />
                                </Grid>
                                {
                                    medicines.map((medicine, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                                <Autocomplete
                                                    id={`MedicineId${index}`}
                                                    options={medicineNameOptions}
                                                    getOptionLable={option => getOptionLabel(option)}
                                                    value={medicineName}
                                                    onChange={handleMedicineNameChange(index)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <TextField
                                                    id={`Quantity${index}`}
                                                    label="Số lượng"
                                                    value={medicine.Quantity}
                                                    onChange={handleMedicinesChange('Quantity')}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <TextField
                                                    id={`Unit${index}`}
                                                    label="Đơn vị"
                                                    value={medicine.Unit}
                                                    onChange={handleMedicinesChange('Unit')}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                        <TextField
                                                            id={`TimesPerDay${index}`}
                                                            label="Ngày uống"
                                                            value={medicine.TimesPerDay}
                                                            onChange={handleMedicinesChange('TimesPerDay')}
                                                            placeholder="...lần"
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                        <TextField
                                                            id={`AfterBreakfast${index}`}
                                                            label="Sáng"
                                                            value={medicine.AfterBreakfast}
                                                            onChange={handleMedicinesChange('AfterBreakfast')}
                                                            placeholder="...viên"
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                        <TextField
                                                            id={`AfterLunch${index}`}
                                                            label="Trứa"
                                                            value={medicine.AfterLunch}
                                                            onChange={handleMedicinesChange('AfterLunch')}
                                                            placeholder="...lần"
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                        <TextField
                                                            id={`AfterDinner${index}`}
                                                            label="Tối"
                                                            value={medicine.AfterDinner}
                                                            onChange={handleMedicinesChange('AfterDinner')}
                                                            placeholder="...lần"
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                        <TextField
                                                            id={`Note${index}`}
                                                            label="Lưu ý"
                                                            value={medicine.Note}
                                                            onChange={handleMedicinesChange('Note')}
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
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
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <DateTimePicker
                                        fullWidth
                                        id="AppointmentDate"
                                        label="Ngày giờ hẹn (nếu có)"
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
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        color="info"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
