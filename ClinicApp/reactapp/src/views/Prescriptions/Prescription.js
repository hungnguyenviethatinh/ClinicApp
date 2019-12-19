import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Container,
    CssBaseline,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import _ from 'lodash';
import moment from 'moment';

import { Button } from '../../components/Button';
import { Snackbar } from '../../components/Snackbar';

import Axios, { axiosRequestConfig } from '../../common';
import { PrescriptionUrl } from '../../config';
import { 
    ExpiredSessionMsg, 
    NotFoundMsg,
    Gender,
    DisplayDateTimeFormat,
} from '../../constants';

const useStyles = makeStyles(theme => ({
    card: {},
    content: {
        padding: theme.spacing(3),
    },
    actions: {
        justifyContent: 'flex-end',
    },
    paper: {
        border: '1px solid rgba(224, 224, 224, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        padding: theme.spacing(2),
    },
}));

const Prescription = () => {
    const classes = useStyles();
    const { id } = useParams();

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

    const [doctor, setDoctor] = React.useState({
        FullName: '',
    });
    const [patient, setPatient] = React.useState({
        FullName: '',
        DateOfBirth: '',
        Gender: '',
        Address: '',
        PhoneNumber: '',
        AppointmentDate: '',
    });
    const [prescription, setPrescription] = React.useState({
        Diagnosis: '',
        Note: '',
    });
    const [medicines, setMedicines] = React.useState([{
        Medicine: null,
        Quantity: '',
        Unit: '',
        TimesPerDay: '',
        AfterBreakfast: '',
        AfterLunch: '',
        Afternoon: '',
        AfterDinner: '',
        Note: '',
    }]);

    const handlePrint = () => {

    };

    const config = axiosRequestConfig();

    const getPrescription = () => {
        const url = `${PrescriptionUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { diagnosis, note } = data[0];
                setPrescription({
                    Diagnosis: diagnosis,
                    Note: note,
                });

                const { fullName } = data[0].doctor;
                setDoctor({
                    FullName: fullName,
                });
                
                const {
                    fullName,
                    dateOfBirth,
                    gender,
                    address,
                    phoneNumber,
                    appointmentDate,
                } = data[0].patient;

                const AppointmentDate = moment(appointmentDate).isValid() ? moment(appointmentDate).format(DisplayDateTimeFormat) : '';
                const DateOfBirth = moment(dateOfBirth).isValid() ? moment(dateOfBirth).year() : '';
                setPatient({
                    FullName: fullName,
                    DateOfBirth,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                    AppointmentDate,
                });

                const ms = [];
                data[0].medicines.map((m) => {
                    const {
                        medicine,
                        quantity,
                        unit,
                        timesPerDay,
                        afterBreakfast,
                        afterLunch,
                        afternoon,
                        afterDinner,
                        note,
                    } = m;
                    ms.push({
                        Medicine: medicine,
                        Quantity: quantity,
                        Unit: unit,
                        TimesPerDay: timesPerDay,
                        AfterBreakfast: afterBreakfast,
                        AfterLunch: afterLunch,
                        Afternoon: afternoon,
                        AfterDinner: afterDinner,
                        Note: note,
                    });
                });
                setMedicines(ms);
            }
        }).catch((reason) => {
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
            console.log('[Get Prescription Error]', reason);
        });
    };

    React.useEffect(() => {
        getPrescription();
    }, []);

    return (
        <Grid
            container
            spacing={3}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        action={
                            <Button
                                color="warning"
                                children="In"
                                iconName="print"
                                onClick={handlePrint}
                            />
                        }
                        title="ĐƠN THUỐC"
                        subheader="Xem chi tiết thuốc"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                alignItems="center"
                                style={{ marginBottom: 8 }}
                            >

                            </Grid>
                            <Typography
                                component="h1"
                                variant="h1"
                                children="ĐƠN THUỐC"
                                align="center"
                                style={{ marginBottom: 24, fontWeight: 600 }}
                            />
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                alignItems="center"
                                style={{ marginBottom: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children="Họ tên BN:"
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.FullName}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Typography
                                        component="h5"
                                        variant="body1"
                                        children="Năm sinh:"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.DateOfBirth}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Typography
                                        component="h5"
                                        variant="body1"
                                        children="Giới tính:"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.Gender}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children="Địa chỉ:"
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children="Chẩn đoán:"
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children="Chẩn đoán:"
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={3}
                                justify="center"
                                alignItems="center"
                                style={{ marginBottom: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div style={{ width: '100%', border: '1px solid rgba(224, 224, 224, 1)' }}>
                                        <Typography
                                            align="center"
                                            component="h5"
                                            variant="body1"
                                            children="* Đặt lịch khám, tái khám theo số điện thoại: 0838.131973"
                                        />
                                        <Typography
                                            align="center"
                                            component="h5"
                                            variant="body1"
                                            children="(Quý khách vui lòng để lại tin nhắn khi chưa gọi điện thoại được.)"
                                            style={{ fontStyle: 'italic' }}
                                        />
                                    </div>
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

export default Prescription;
