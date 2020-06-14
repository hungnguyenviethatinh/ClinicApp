import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import _ from 'lodash';
import moment from 'moment';

import { Button } from '../../components/Button';
import { Snackbar } from '../../components/Snackbar';
import { HistoryButton as Back } from '../../components/Button';

import Axios, {
    axiosRequestConfig,
    ChromeLyService,
    verifyJWT,
} from '../../common';
import {
    PrescriptionUrl,
    PrescriptionPrintUrl,
    UpdatePrescriptionStatusUrl,
    OpenTimesUrl,
} from '../../config';
import {
    ExpiredSessionMsg,
    NotFoundMsg,
    Gender,
    DisplayDateFormat,
    PrescriptionStatus,
    TakePeriodValue,
    RouteConstants,
    RoleConstants,
    AccessTokenKey,
} from '../../constants';

import { logo } from '../../components/Logo';

const useStyles = makeStyles(theme => ({
    card: {},
    content: {
        padding: theme.spacing(3),
    },
    actions: {
        justifyContent: 'flex-end',
    },
    paper: {
        border: '3px solid #011D42',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        padding: theme.spacing(2),
    },
    footer: {
        width: '100%',
        height: '100px',
        display: 'flex',
        border: '3px solid #011D42',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
}));

const getPrescriptionError = '[Get Prescription Error]';
const getOpenTimesError = '[Get Open Times Error]';
const updatePrescriptionError = '[Update Prescription Error]';

const getDateString = (date) => {
    const day = date.day() === 0 ?
        'CN' : `Thứ ${date.day() + 1}`;
    const month = date.month() + 1;
    return `${day}, ngày ${date.date()} tháng ${month} năm ${date.year()}`;
};

const Prescription = () => {
    const classes = useStyles();
    const browserHistory = useHistory();
    const config = axiosRequestConfig();

    const now = moment();
    const currentDate = getDateString(now);
    const currentTime = `${now.format('HH:mm')}`;

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

    const handleError = (reason, logError) => {
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
        console.log(logError, reason);
    };

    const [doctor, setDoctor] = React.useState({
        FullName: '',
    });
    const [patient, setPatient] = React.useState({
        IdCode: '',
        Id: '',
        OrderNumber: '',
        FullName: '',
        Age: '',
        Gender: '',
        Address: '',
        PhoneNumber: '',
        AppointmentDate: '',
    });
    const [prescription, setPrescription] = React.useState({
        Diagnosis: '',
        OtherDiagnosis: '',
        Note: '',
        DateCreated: '',
    });
    const [currentHistoryId, setCurrentHistoryId] = React.useState(null);
    const [medicines, setMedicines] = React.useState([{
        MedicineName: '',
        Ingredient: '',
        NetWeight: '',
        Quantity: '',
        Unit: '',
        TakePeriod: TakePeriodValue.Day,
        TakeMethod: '',
        TakeTimes: '',
        AmountPerTime: '',
        MealTime: '',
        Note: '',
    }]);
    const [openTimes, setOpenTimes] = React.useState(null);

    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [canEditOrCopy, setCanEditOrCopy] = React.useState(false);
    const checkCanEditOrCopy = () => {
        const token = localStorage.getItem(AccessTokenKey);
        verifyJWT(token, RoleConstants.DoctorRoleName) && setCanEditOrCopy(true);
    };

    const handleUpdate = () => {
        const queryParams = `?uId=${id}&uPId=${patient.Id}&uHId=${currentHistoryId}`;
        const redirectUrl = RouteConstants.PrescriptionManagementView + queryParams;
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };

    const handlePrint = () => {
        const data = JSON.stringify({
            doctor,
            patient,
            prescription,
            medicines,
            openTimes,
        });

        console.log(JSON.parse(data));

        setDisabled(true);
        setLoading(true);

        ChromeLyService.post(PrescriptionPrintUrl, null, data, response => {
            const { ResponseText } = response;
            const { ReadyState, Status, Data } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                const { Message } = Data;
                handleSnackbarOption('success', Message);
                updatePrescriptionStatus();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in đơn thuốc!');
                console.log('[Print Prescription Error] - An error occurs during message routing. With url: '
                    + PrescriptionPrintUrl
                    + '. Response received: ', response);

            }
            setDisabled(false);
            setLoading(false);
        });
    };

    const [dateCreatedString, setDateCreatedString] = React.useState('Thứ ..., ngày ... tháng ... năm 20...');
    const [appointmentDateString, setAppointmentDateString] = React.useState('Thứ ..., ngày ... tháng ... năm 20...');

    const getPrescription = () => {
        setDisabled(true);
        const url = `${PrescriptionUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { diagnosis, otherDiagnosis, note, dateCreated, historyId } = data[0];

                let DateCreated = null;
                if (moment(dateCreated).isValid()) {
                    const date = moment(dateCreated);
                    DateCreated = date.format(DisplayDateFormat);
                    setDateCreatedString(getDateString(date));
                }
                setPrescription({
                    Diagnosis: diagnosis,
                    OtherDiagnosis: otherDiagnosis,
                    Note: note,
                    DateCreated,
                });

                setCurrentHistoryId(historyId);

                setDoctor({
                    FullName: data[0].doctor.fullName,
                });

                const {
                    fullName,
                    orderNumber,
                    age,
                    gender,
                    address,
                    phoneNumber,
                    appointmentDate,
                } = data[0].patient;

                let AppointmentDate = null;
                if (moment(appointmentDate).isValid() && moment(appointmentDate) >= moment()) {
                    const date = moment(appointmentDate);
                    AppointmentDate = date.format(DisplayDateFormat);
                    setAppointmentDateString(getDateString(date));
                }

                setPatient({
                    IdCode: data[0].patient.idCode,
                    Id: data[0].patient.id,
                    OrderNumber: orderNumber,
                    FullName: fullName,
                    Age: age !== 0 ? age : '',
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                    AppointmentDate,
                });

                const ms = [];
                data[0].medicines.map((m) => {
                    const {
                        medicine,
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
                        MedicineName: medicine.name,
                        Ingredient: !_.isEmpty(ingredient) ? ingredient : '',
                        NetWeight: !_.isEmpty(netWeight) ? netWeight : '',
                        Quantity: !_.isNull(quantity) ? quantity : '......',
                        Unit: unit,
                        TakePeriod: _.toLower(takePeriod),
                        TakeMethod: _.capitalize(takeMethod),
                        TakeTimes: !_.isNull(takeTimes) ? takeTimes : '......',
                        AmountPerTime: !_.isNull(amountPerTime) ? amountPerTime : '......',
                        MealTime: !_.isEmpty(mealTime) ? mealTime : '......',
                        Note: !_.isEmpty(note) ? note : '............',
                    });
                });
                setMedicines(ms);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getPrescriptionError);
            setDisabled(false);
        });
    };

    const getOpenTimes = () => {
        Axios.get(OpenTimesUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                setOpenTimes(data);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getOpenTimesError);
            setDisabled(false);
        });
    };

    const updatePrescriptionStatus = () => {
        const url = `${UpdatePrescriptionStatusUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                console.log(`Đã cập nhật trạng thái đơn thuốc thành ${PrescriptionStatus.IsPrinted}!`);
            } else {
                console.log(response);
            }
            setDisabled(false);
            setLoading(false);
        }).catch((reason) => {
            handleError(reason, updatePrescriptionError);
            setDisabled(false);
            setLoading(false);
        });
    };

    React.useEffect(() => {
        checkCanEditOrCopy();
        getPrescription();
        getOpenTimes();
    }, []);

    return (
        <Grid
            container
            spacing={3}
            justify="center"
            alignItems="center"
        >
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                <Back />
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        action={
                            <React.Fragment>
                                {canEditOrCopy &&
                                    <Button
                                        color="info"
                                        disabled={disabled || loading}
                                        children="Sửa"
                                        iconName="edit"
                                        onClick={handleUpdate}
                                        style={{
                                            marginRight: '5px',
                                        }}
                                    />
                                }
                                <Button
                                    color="warning"
                                    disabled={disabled}
                                    loading={loading}
                                    children="In"
                                    iconName="print"
                                    onClick={handlePrint}
                                />
                            </React.Fragment>
                        }
                        title="ĐƠN THUỐC"
                        subheader="Xem chi tiết thuốc và in"
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
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <div style={{ width: '100%' }} >
                                        <img
                                            src={logo}
                                            alt="Dr. Khoa Clinic"
                                            style={{ height: 'auto', width: '100%', }}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Typography
                                        component="h2"
                                        variant="h2"
                                        children={`Dr. KHOA Clinic`}
                                        style={{ fontWeight: 600 }}
                                    />
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        children={`ĐT:       0838.131973`}
                                    />
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        children={`Email:    clinic.drkhoa@gmail.com`}
                                    />
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        children={`Website:  www.drkhoaclinic.com`}
                                    />
                                    <Typography
                                        component="p"
                                        variant="subtitle2"
                                        children={`Đc: 6A, Đường 36, Phường Tân Quy, Q7, TP.HCM`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Grid
                                        container
                                        spacing={2}
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography
                                                align="right"
                                                component="p"
                                                variant="body1"
                                                children={`${currentDate}`}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography
                                                align="right"
                                                component="p"
                                                variant="body1"
                                                children={`Mã DKC: ${patient.IdCode}${patient.Id}`}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography
                                                align="right"
                                                component="p"
                                                variant="body1"
                                                children={`Số thứ tự: ${patient.OrderNumber}`}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography
                                                align="right"
                                                component="p"
                                                variant="body1"
                                                children={`Giờ: ${currentTime}`}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Typography
                                component="h1"
                                variant="h1"
                                children={`ĐƠN THUỐC`}
                                align="center"
                                style={{ marginBottom: 24, fontWeight: 600 }}
                            />
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                alignItems="baseline"
                                style={{ marginBottom: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`Họ tên BN:`}
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.FullName}`}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="body1"
                                        children={`Tuổi:`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.Age}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="body1"
                                        children={`Giới tính:`}
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
                                        children={`Địa chỉ:`}
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.Address}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`ĐT:`}
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${patient.PhoneNumber}`}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`Chẩn đoán:`}
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${!prescription.Diagnosis.trim() ?
                                            '................................................................' +
                                            '...............................................................' :
                                            prescription.Diagnosis}`
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`Chẩn đoán khác:`}
                                        style={{ fontWeight: 600 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                        children={`${!prescription.OtherDiagnosis.trim() ?
                                            '................................................................' +
                                            '..................................................' :
                                            prescription.OtherDiagnosis}`
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div style={{ width: '100%', padding: '16px 0px' }}>
                                        <Grid
                                            container
                                            spacing={2}
                                            justify="center"
                                            alignItems="baseline"
                                        >
                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children={`STT`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children={`MẶT HÀNG THUỐC`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <Typography
                                                    align="center"
                                                    component="h5"
                                                    variant="h5"
                                                    children={`SỐ LƯỢNG`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                <Typography
                                                    component="h5"
                                                    variant="h5"
                                                    children={`ĐƠN VỊ`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            {
                                                !_.isEmpty(medicines) && medicines.map((m, index) => (
                                                    <React.Fragment key={index}>
                                                        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                            <Typography
                                                                align="center"
                                                                component="h5"
                                                                variant="h5"
                                                                children={`${index + 1}`}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                            <Typography
                                                                component="h5"
                                                                variant="h5"
                                                                children={`${m.MedicineName} ${m.NetWeight} ${m.Ingredient}`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                            <Typography
                                                                align="center"
                                                                component="h5"
                                                                variant="h5"
                                                                children={`${m.Quantity}`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                            <Typography
                                                                component="h5"
                                                                variant="h5"
                                                                children={`${m.Unit}`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>
                                                        <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
                                                            <Typography
                                                                component="p"
                                                                variant="subtitle1"
                                                                children={
                                                                    `${m.TakeMethod} ${m.TakePeriod} ${m.TakeTimes} lần,
                                                                    lần ${m.AmountPerTime} ${m.Unit}, ${m.MealTime} ăn.
                                                                    Lưu ý: ${m.Note}`
                                                                }
                                                                style={{ fontStyle: 'italic' }}
                                                            />
                                                        </Grid>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                    >
                                        <b><u>Ghi chú: </u></b>
                                        {
                                            prescription.Note ||
                                            '........................................................................' +
                                            '.................................................................... ' +
                                            '........................................................................' +
                                            '....................................................................................'
                                        }
                                    </Typography>
                                    <Typography
                                        component="h5"
                                        variant="h5"
                                    >
                                        <b><u>Tái khám: </u></b>{appointmentDateString}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12} sm={12} md={12} lg={12} xl={12}
                                    style={{
                                        width: '100%',
                                        padding: '16px 0px'
                                    }}
                                >
                                    <Grid
                                        container
                                        spacing={2}
                                        justify="space-between"
                                        alignItems="center"
                                        style={{
                                            marginLeft: 0,
                                            marginRight: 0,
                                            width: '100%',
                                        }}
                                    >

                                        <Grid
                                            item
                                            xs={12} sm={12} md={4} lg={4} xl={4}
                                            style={{
                                                border: '3px solid #011D42',
                                            }}>
                                            <Typography
                                                component="h5"
                                                variant="h5"
                                                children={`* Giờ khám bệnh:`}
                                                style={{ fontWeight: 600 }}
                                            />
                                            {
                                                !_.isEmpty(openTimes) &&
                                                openTimes.map((openTime, index) => (
                                                    <Typography
                                                        key={index}
                                                        component="p"
                                                        variant="body2"
                                                        children={`${openTime.openClosedTime}`}
                                                    />
                                                ))
                                            }
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12} sm={12} md={4} lg={4} xl={4}
                                        >
                                            <Typography
                                                align="center"
                                                component="h5"
                                                variant="body1"
                                                children={`${dateCreatedString}`}
                                            />
                                            <Typography
                                                align="center"
                                                component="h5"
                                                variant="h5"
                                                children={`Bác sĩ khám bệnh`}
                                                style={{
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                }}
                                            />
                                            <Typography
                                                align="center"
                                                component="h5"
                                                variant="h5"
                                                children={`${doctor.FullName}`}
                                                style={{
                                                    fontWeight: 600,
                                                    marginTop: '3rem',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography
                                                component="p"
                                                variant="body2"
                                                children={
                                                    `* Đơn thuốc có giá trị trong đợt khám. Tái khám khách hàng nhớ mang theo đơn thuốc.`
                                                }
                                            />
                                        </Grid>
                                    </Grid>
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
                                    <div className={classes.footer}>
                                        <Typography
                                            align="center"
                                            component="h5"
                                            variant="body1"
                                            children={`* Đặt lịch khám, tái khám theo số điện thoại: 0838.131973`}
                                        />
                                        <Typography
                                            align="center"
                                            component="h5"
                                            variant="body1"
                                            children={`(Quý khách vui lòng để lại tin nhắn, zalo khi chưa gọi điện thoại được.)`}
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
