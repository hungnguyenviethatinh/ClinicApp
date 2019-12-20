import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography,
    FormControl
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DateTimePicker } from '@material-ui/pickers';
import moment from 'moment';

import { Table } from '../../components/Table';
import { Tab, TabContent } from '../../components/Tab';
import { Snackbar } from '../../components/Snackbar';
import { Status } from '../../components/Status';
import { HistoryButton as Back } from '../../components/Button';

import {
    PatientStatus,
    ExpiredSessionMsg,
    // NotFoundMsg,
    DisplayDateFormat,
    AddressSeperator,
    Gender,
    RouteConstants,
    IdPrefix,
} from '../../constants';
import Axios, {
    axiosRequestConfig,
} from '../../common';
import {
    PatientUrl,
    HistoryByPatientIdUrl,
    PatientCurrentHistoryUrl,
} from '../../config';
import { encodeId } from '../../utils';

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
        render: rowData => moment(rowData.createdDate).format(DisplayDateFormat),
    },
    {
        title: 'Bác sĩ khám', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
    },
    {
        title: 'Trạng thái', field: 'isChecked',
        render: rowData => {
            const status = rowData.isChecked ? PatientStatus.IsChecked : PatientStatus.IsNew;
            return <Status status={status} />
        }
    },
];

const getDetailPanel = (rowData) => {
    const {
        height,
        weight,
        bloodPresure,
        pulse,
        prescriptions,
        xRayImages,
    } = rowData;

    return (
        <Paper elevation={0} style={{ padding: '16px 64px' }}>
            <Typography
                variant="caption"
                component="p"
                children="THÔNG TIN KHÁM LÂM SÀNG"
            />
            <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
                style={{ marginTop: 8, marginBottom: 24 }}
            >
                <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                    <Typography
                        variant="body1"
                        component="p"
                        children="Chiều cao:"
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                    <Typography
                        variant="h6"
                        component="h6"
                        children={`${height} cm`}
                        style={{ fontWeight: 600 }}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                    <Typography
                        variant="body1"
                        component="p"
                        children="Cân nặng:"
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                    <Typography
                        variant="h6"
                        component="h6"
                        children={`${weight} kg`}
                        style={{ fontWeight: 600 }}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                    <Typography
                        variant="body1"
                        component="p"
                        children="Nhịp tim:"
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                    <Typography
                        variant="h6"
                        component="h6"
                        children={`${bloodPresure} lần/phút`}
                        style={{ fontWeight: 600 }}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                    <Typography
                        variant="body1"
                        component="p"
                        children="Mạch:"
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                    <Typography
                        variant="h6"
                        component="h6"
                        children={`${pulse} mmHg`}
                        style={{ fontWeight: 600 }}
                    />
                </Grid>
            </Grid>
            <Typography
                variant="caption"
                component="p"
                children="HÌNH ẢNH CHỤP X QUANG"
            />
            <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
                style={{ marginTop: 8, marginBottom: 24 }}
            >
                {
                    !_.isEmpty(xRayImages) ?
                        <React.Fragment>
                            {
                                xRayImages.map((image, index) => (
                                    <Grid key={index} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <div style={{ textAlign: 'center' }}>
                                            <img
                                                src={image.data}
                                                alt={image.name}
                                            />
                                        </div>
                                    </Grid>
                                ))
                            }
                        </React.Fragment>
                        :
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography
                                variant="body1"
                                component="p"
                                children="KHÔNG CÓ HÌNH ẢNH"
                            />
                        </Grid>
                }
            </Grid>
            <Typography
                variant="caption"
                component="p"
                children="ĐƠN THUỐC ĐÃ KÊ"
            />
            <Grid
                container
                spacing={2}
                justify="flex-start"
                alignItems="center"
                style={{ marginTop: 8, marginBottom: 24 }}
            >
                {
                    !_.isEmpty(prescriptions) ?
                        <React.Fragment>
                            {
                                prescriptions.map((prescription, index) => (
                                    <Grid key={index} item>
                                        <Link
                                            to={`${RouteConstants.PrescriptionDetailView.replace(':id', prescription.id)}`}
                                            children={
                                                encodeId(prescription.id, `${IdPrefix.Prescription}`)
                                            } />
                                    </Grid>
                                ))
                            }
                        </React.Fragment>
                        :
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography
                                variant="body1"
                                component="p"
                                children="KHÔNG CÓ ĐƠN THUỐC"
                            />
                        </Grid>
                }
            </Grid>

        </Paper>
    );
};

const tabNames = ['Thông tin bệnh nhân', 'Lịch sử khám bệnh', 'Tra cứu lịch hẹn'];

const getPatientByIdError = '[Get Patient By Id Error]';
const getPatientHistoryError = '[Get Patient History Error]';
const getPatientHistoriesError = '[Get Patient Histories Error]';

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

    const handleError = (reason, logMsgHeader) => {
        if (reason.response) {
            const { status } = reason.response;
            if (status === 401) {
                handleSnackbarOption('error', ExpiredSessionMsg);
            } else {
                // if (status === 404) {
                //     handleSnackbarOption('error', NotFoundMsg);
                // }
            }
        }
        console.log(`${logMsgHeader}`, reason);
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
                const DateOfBirth = moment(dateOfBirth).isValid() ? moment(dateOfBirth).format(DisplayDateFormat) : null;
                const Address = address.split(AddressSeperator).filter(value => value.trim() !== '').join(`${AddressSeperator} `);

                setPatient({
                    FullName: fullName,
                    DateOfBirth,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address,
                    Job: job,
                    PhoneNumber: phoneNumber,
                    Email: email,
                    AppointmentDate,
                });
            }
        }).catch((reason) => {
            handleError(reason, getPatientByIdError);
        });
    };

    const [history, setHistory] = React.useState(null);
    const getCurrentHistory = () => {
        const url = `${PatientCurrentHistoryUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    height,
                    weight,
                    bloodPresure,
                    pulse,
                    xRayImages,
                } = data[0];

                setHistory({
                    Height: height,
                    Weight: weight,
                    BloodPresure: bloodPresure,
                    Pulse: pulse,
                    XRayImages: xRayImages,
                });
            }
        }).catch((reason) => {
            handleError(reason, getPatientHistoryError);
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
            handleError(reason, getPatientHistoriesError);
        });
    };

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    React.useEffect(() => {
        getPatient();
        getCurrentHistory();
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item >
                <Back />
            </Grid>
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
                                <Grid
                                    container
                                    justify="center"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h1"
                                            component="h1"
                                            align="center"
                                            children={`${patient.FullName}`}
                                            style={{ marginBottom: 32, textTransform: 'uppercase' }}
                                        />
                                        <Typography
                                            variant="caption"
                                            component="p"
                                            children="THÔNG TIN CƠ BẢN"
                                        />
                                        <Grid
                                            container
                                            spacing={2}
                                            justify="center"
                                            alignItems="center"
                                            style={{ marginTop: 8, marginBottom: 24 }}
                                        >
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Họ và Tên BN:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.FullName}`}
                                                    style={{ fontWeight: 600, textTransform: 'uppercase' }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Ngày, tháng, năm sinh:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.DateOfBirth}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Giới tính:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.Gender}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Địa chỉ:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.Address}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Nghề nghiệp:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.Job}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Điện thoại:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.PhoneNumber}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Email:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.Email}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Typography
                                            variant="caption"
                                            component="p"
                                            children="THÔNG TIN KHÁM LÂM SÀNG"
                                        />
                                        <Grid
                                            container
                                            spacing={2}
                                            justify="center"
                                            alignItems="center"
                                            style={{ marginTop: 8, marginBottom: 24 }}
                                        >
                                            {
                                                history ?
                                                    <React.Fragment>
                                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                            <Typography
                                                                variant="body1"
                                                                component="p"
                                                                children="Chiều cao:"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                            <Typography
                                                                variant="h6"
                                                                component="h6"
                                                                children={`${history.Height} cm`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                            <Typography
                                                                variant="body1"
                                                                component="p"
                                                                children="Cân nặng:"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                            <Typography
                                                                variant="h6"
                                                                component="h6"
                                                                children={`${history.Weight} kg`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                            <Typography
                                                                variant="body1"
                                                                component="p"
                                                                children="Nhịp tim:"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                            <Typography
                                                                variant="h6"
                                                                component="h6"
                                                                children={`${history.BloodPresure} lần/phút`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                            <Typography
                                                                variant="body1"
                                                                component="p"
                                                                children="Mạch:"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                            <Typography
                                                                variant="h6"
                                                                component="h6"
                                                                children={`${history.Pulse} mmHg`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                    </React.Fragment>
                                                    :
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography
                                                            variant="body1"
                                                            component="p"
                                                            children="KHÔNG CÓ THÔNG TIN"
                                                        />
                                                    </Grid>
                                            }
                                        </Grid>
                                        <Typography
                                            variant="caption"
                                            component="p"
                                            children="HÌNH ẢNH CHỤP X QUANG"
                                        />
                                        <Grid
                                            container
                                            spacing={2}
                                            justify="center"
                                            alignItems="center"
                                            style={{ marginTop: 8, marginBottom: 24 }}
                                        >
                                            {
                                                (history && !_.isEmpty(history.XRayImages)) ?
                                                    <React.Fragment>
                                                        {
                                                            history.XRayImages.map((image, index) => (
                                                                <Grid key={index} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <img
                                                                            src={image.data}
                                                                            alt={image.name}
                                                                        />
                                                                    </div>
                                                                </Grid>
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                    :
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography
                                                            variant="body1"
                                                            component="p"
                                                            children="KHÔNG CÓ HÌNH ẢNH"
                                                        />
                                                    </Grid>
                                            }
                                        </Grid>
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
                                            detailPanel={(rowData) => getDetailPanel(rowData)}
                                        />
                                    </Grid>
                                </Grid>
                            </TabContent>
                            <TabContent value={tabValue} index={2}>
                                <Grid
                                    container
                                    spacing={3}
                                    justify="center"
                                    alignItems="center"
                                >
                                    {
                                        patient.AppointmentDate ?
                                            <Grid item>
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
                                            :
                                            <Grid
                                                item
                                                xs={12} sm={12} md={12} lg={12} xl={12}
                                                style={{ paddingLeft: 0, paddingRight: 0 }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="KHÔNG CÓ LỊCH HẸN NÀO"
                                                />
                                            </Grid>
                                    }
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
