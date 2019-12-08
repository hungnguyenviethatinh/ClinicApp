import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    CssBaseline,
    Typography,
    FormControl
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Table } from '../../components/Table';
import { Tab, TabContent } from '../../components/Tab';
import { Snackbar } from '../../components/Snackbar';

import moment from 'moment';
import { 
    PatientStatus, 
    ExpiredSessionMsg, 
    NotFoundMsg, 
    displayDateTimeFormat, 
} from '../../constants';
import { DateTimePicker } from '@material-ui/pickers';
import Axios, { 
    axiosRequestConfig, 
} from '../../common';
import { 
    PatientUrl, 
    HistoryByPatientIdUrl, 
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

const historyColumns = [
    {
        title: 'Ngày khám', field: 'createdDate', type: 'date',
        render: rowData => moment(rowData.createdDate).format(displayDateTimeFormat),
    },
    {
        title: 'Bác sĩ khám', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
    },
];

const tabNames = ['Thông tin bệnh nhân', 'Lịch sử khám bệnh', 'Tra cứu lịch hẹn'];
const addressSeperator = ',';

const Patient = () => {
    const classes = useStyles();

    const { id } = useParams();
    const tableRef = React.createRef();

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
        DateOfBirth: null,
        Gender: '',
        Address: '',
        Job: '',
        PhoneNumber: '',
        Email: '',
        AppointmentDate: null,
        Status: PatientStatus.IsNew,
    });

    const config = axiosRequestConfig();

    const getPatient = () => {
        const url = `${PatientUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    fullName,
                    dateOfBirth,
                    gender,
                    address,
                    job,
                    phoneNumber,
                    email,
                    appointmentDate,
                } = data[0];

                const AppointmentDate = moment(appointmentDate).isValid() ? moment(appointmentDate) : null;
                const DateOfBirth = moment(dateOfBirth).isValid() ? moment(dateOfBirth).format(displayDateTimeFormat) : null;
                const Address = address.split(addressSeperator).filter(value => value.trim() !== '').join(`${addressSeperator} `);

                setPatient({
                    FullName: fullName,
                    DateOfBirth,
                    Gender: gender,
                    Address,
                    Job: job,
                    PhoneNumber: phoneNumber,
                    Email: email,
                    AppointmentDate,
                });
            }
        }).catch((reason) => {
            if (reason.response) {
                const { status } = reason.response;
                if (status === 401) {
                    handleSnackbarOption('error', ExpiredSessionMsg);
                } else if (status === 404) {
                    handleSnackbarOption('error', NotFoundMsg);
                }
            }
            console.log('[Get Patient By Id Error] ', reason);
        });
    };

    const getHistories = (resolve, reject, query) => {
        const url = `${HistoryByPatientIdUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { page } = query;
                const totalCount = data.length;
                resolve({
                    data,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            if (reason.response) {
                const { status } = reason.response;
                if (status === 401) {
                    handleSnackbarOption('error', ExpiredSessionMsg);
                } else if (status === 404) {
                    handleSnackbarOption('error', NotFoundMsg);
                }
            }
            console.log('[Get Histories Error] ', reason);
        });
    };

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    React.useEffect(() => {
        getPatient();
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="HỒ SƠ BỆNH NHÂN"
                        subheader="Tra cứu thông tin bệnh nhân tại đây"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Tab
                            value={tabValue}
                            names={tabNames}
                            handleChange={handleTabChange}
                        >
                            <TabContent value={tabValue} index={0}>
                                <Typography
                                    variant="h1"
                                    component="h1"
                                    align="center"
                                    children={`${patient.FullName}`}
                                    gutterBottom
                                />
                                <Grid container>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            align="left"
                                            children="Họ và Tên BN:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            align="center"
                                            children={`${patient.FullName}`}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            align="left"
                                            children="Ngày, tháng, năm sinh:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            align="center"
                                            children={`${patient.DateOfBirth}`}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            align="left"
                                            children="Giới tính:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            align="center"
                                            children={`${patient.Gender}`}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            align="left"
                                            children="Địa chỉ:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={10} lg={10} xl={10}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            align="center"
                                            children={`${patient.Address}`}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            align="left"
                                            children="Nghề nghiệp:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={10} lg={10} xl={10}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            align="center"
                                            children={`${patient.Job}`}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            align="left"
                                            children="Điện thoại:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            align="center"
                                            children={`${patient.PhoneNumber}`}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            align="left"
                                            children="Email:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            align="center"
                                            children={`${patient.Email}`}
                                        />
                                    </Grid>
                                </Grid>
                            </TabContent>
                            <TabContent value={tabValue} index={1}>
                                <Grid container spacing={3} >
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Table
                                            tableRef={tableRef}
                                            customOptions={{
                                                paging: false,
                                            }}
                                            columns={historyColumns}
                                            data={
                                                query => new Promise((resolve, reject) => {
                                                    getHistories(resolve, reject, query);
                                                })
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </TabContent>
                            <TabContent value={tabValue} index={2}>
                                <Grid
                                    container
                                    spacing={3}
                                    justify="center"
                                >
                                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <FormControl
                                            fullWidth
                                        >
                                            <DateTimePicker
                                                variant="static"
                                                label="Lịch hẹn"
                                                value={patient.AppointmentDate}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </TabContent>
                        </Tab>
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

export default Patient;
