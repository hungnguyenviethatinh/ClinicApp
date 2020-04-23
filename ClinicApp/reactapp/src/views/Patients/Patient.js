import React from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import _ from 'lodash';

import { Table } from '../../components/Table';
import { Tab, TabContent } from '../../components/Tab';
import { Snackbar } from '../../components/Snackbar';
import { Status } from '../../components/Status';
import { HistoryButton as Back, Button } from '../../components/Button';

import {
    PatientStatus,
    ExpiredSessionMsg,
    NotFoundMsg,
    DisplayDateFormat,
    Gender,
    RouteConstants,
    RoleConstants,
    AccessTokenKey,
} from '../../constants';
import Axios, {
    axiosRequestConfig,
    ChromeLyService,
    verifyJWT,
} from '../../common';
import {
    PatientUrl,
    HistoryByPatientIdUrl,
    PatientCurrentHistoryUrl,
    PatientPrintUrl,
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

const historyColumns = [
    {
        title: 'Ngày khám', field: 'checkedDate', type: 'date',
        render: rowData => moment(rowData.checkedDate).format(DisplayDateFormat),
    },
    {
        title: 'Trạng thái', field: 'isChecked',
        render: rowData => {
            const status = rowData.isChecked ? PatientStatus.IsChecked : PatientStatus.IsNew;
            return <Status status={status} />
        }
    },
];

const tabNames = ['Thông tin bệnh nhân', 'Lịch sử khám bệnh'];

const getPatientByIdError = '[Get Patient By Id Error]';
const getPatientHistoryError = '[Get Patient History Error]';
const getPatientHistoriesError = '[Get Patient Histories Error]';

const Patient = () => {
    const classes = useStyles();
    const config = axiosRequestConfig();

    const { id } = useParams();
    const browserHistory = useHistory();
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
                if (status === 404) {
                    handleSnackbarOption('warning', NotFoundMsg);
                }
            }
        }
        console.log(`${logMsgHeader}`, reason);
    };

    const [patient, setPatient] = React.useState({
        Id: 0,
        IdCode: '',
        OrderNumber: '',
        FullName: '',
        Age: '',
        Gender: '',
        Address: '',
        Job: '',
        PhoneNumber: '',
        RelativePhoneNumber: '',
        Email: '',
        AppointmentDate: null,
        Status: '',
    });

    const getPatient = () => {
        const url = `${PatientUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    idCode,
                    orderNumber,
                    fullName,
                    age,
                    gender,
                    address,
                    phoneNumber,
                    relativePhoneNumber,
                    appointmentDate,
                    status,
                } = data[0];

                const AppointmentDate = moment(appointmentDate).isValid() ? moment(appointmentDate).format(DisplayDateFormat) : null;

                setPatient({
                    Id: data[0].id,
                    IdCode: idCode,
                    OrderNumber: orderNumber,
                    FullName: fullName,
                    Age: age,
                    Gender: [Gender.None, Gender.Male, Gender.Female][gender],
                    Address: address,
                    PhoneNumber: phoneNumber,
                    RelativePhoneNumber: relativePhoneNumber,
                    AppointmentDate,
                    Status: [
                        PatientStatus.IsNew,
                        PatientStatus.IsAppointed,
                        PatientStatus.IsChecking,
                        PatientStatus.IsChecked,
                        PatientStatus.IsRechecking,
                        PatientStatus.IsToAddDocs][status],
                });
            }
        }).catch((reason) => {
            handleError(reason, getPatientByIdError);
        });
    };

    const [history, setHistory] = React.useState({
        Id: 0,
        Height: '',
        Weight: '',
        BloodPressure: '',
        Pulse: '',
        Other: '',
        Note: '',
        Doctors: [],
        XRayImages: [],
    });
    const getCurrentHistory = () => {
        const url = `${PatientCurrentHistoryUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const {
                    height,
                    weight,
                    bloodPressure,
                    pulse,
                    other,
                    note,
                    doctors,
                    xRayImages,
                } = data[0];

                setHistory({
                    Id: data[0].id,
                    Height: height,
                    Weight: weight,
                    BloodPressure: bloodPressure,
                    Pulse: pulse,
                    Other: other,
                    Note: note,
                    Doctors: doctors,
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

    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleUpdate = () => {
        const queryParams = `?pId=${patient.Id}&hId=${history.Id}`;
        const redirectUrl = RouteConstants.PatientManagementView + queryParams;
        browserHistory.push(redirectUrl);
    };
    const handlePrint = () => {
        setDisabled(true);
        setLoading(true);

        const {
            Id,
            IdCode,
            OrderNumber,
            FullName,
            Age,
            Gender,
            Address,
            PhoneNumber,
            RelativePhoneNumber,
            Status,
        } = patient;

        const {
            Height,
            Weight,
            BloodPressure,
            Pulse,
            Other,
            Note,
        } = history;

        const AppointmentDate = moment(patient.AppointmentDate).isValid() ? patient.AppointmentDate.format(DisplayDateFormat) : null;
        const Doctors = [];
        if (!_.isEmpty(history.Doctors)) {
            history.Doctors.map(({ doctor }) => Doctors.push({
                FullName: doctor.fullName,
            }));
        }
        const data = JSON.stringify({
            Id,
            IdCode,
            OrderNumber,
            FullName,
            Age: _.toNumber(Age),
            Gender,
            Address,
            PhoneNumber,
            RelativePhoneNumber,
            AppointmentDate,
            Status,
            Height,
            Weight,
            BloodPressure,
            Pulse,
            Other,
            Note,
            Doctors,
        });

        console.log(JSON.parse(data));

        ChromeLyService.post(PatientPrintUrl, null, data, response => {
            const { ResponseText } = response;
            const { ReadyState, Status, Data } = JSON.parse(ResponseText);
            if (ReadyState === 4 && Status === 200) {
                const { Message } = Data;
                console.log(`[Print Patient Success] - ${Message}`);
                handleSnackbarOption('success', 'In phiếu tiếp nhận thành công!');
            } else {
                handleSnackbarOption('error', 'Có lỗi khi in phiếu tiếp nhận bệnh nhân!');
                console.log('[Print Patient Error] - An error occurs during message routing. With url: '
                    + PatientPrintUrl
                    + '. Response received: ', response);
            }
            setDisabled(false);
            setLoading(false);
        });
    };

    const [canEditOrPrint, setCanEditOrPrint] = React.useState(false);
    const checkCanEditOrPrint = () => {
        const token = localStorage.getItem(AccessTokenKey);
        verifyJWT(token, RoleConstants.ReceptionistRoleName) && setCanEditOrPrint(true);
    };

    const getDetailPanel = (rowData) => {
        const {
            id,
            patientId,
            height,
            weight,
            bloodPressure,
            pulse,
            other,
            note,
            doctors,
            prescriptions,
            xRayImages,
        } = rowData;

        const handleHistoryCopy = () => {
            const queryParams = `?pId=${patientId}&hId=${id}`;
            const redirectUrl = RouteConstants.PatientManagementView + queryParams;
            browserHistory.push(redirectUrl);
        };

        return (
            <Paper elevation={0} style={{ padding: '16px 64px' }}>
                {
                    canEditOrPrint &&
                    <Grid
                        container
                        justify="flex-end"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                            <Button
                                color="info"
                                children="Sao chép"
                                iconName="edit"
                                onClick={handleHistoryCopy}
                            />
                        </Grid>
                    </Grid>
                }
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
                            children={`${bloodPressure} lần/phút`}
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
                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                        <Typography
                            variant="body1"
                            component="p"
                            children="Khác:"
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                        <Typography
                            variant="h6"
                            component="h6"
                            children={`${other}`}
                            style={{ fontWeight: 600 }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                        <Typography
                            variant="body1"
                            component="p"
                            children="Ghi chú:"
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                        <Typography
                            variant="h6"
                            component="h6"
                            children={`${note}`}
                            style={{ fontWeight: 600 }}
                        />
                    </Grid>
                </Grid>
                <Typography
                    variant="caption"
                    component="p"
                    children="CÁC BÁC SĨ HỘI CHUẨN KHÁM"
                />
                <Grid
                    container
                    spacing={2}
                    justify="center"
                    alignItems="center"
                    style={{ marginTop: 8, marginBottom: 24 }}
                >
                    {
                        !_.isEmpty(doctors) &&
                        doctors.map(({ doctor }) => (
                            <Grid item key={doctor.id} xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography
                                    variant="h6"
                                    component="h6"
                                    children={`${doctor.fullName}`}
                                    style={{ fontWeight: 600 }}
                                />
                            </Grid>
                        ))
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
                        !_.isEmpty(xRayImages) ?
                            <React.Fragment>
                                {
                                    xRayImages.map((image, index) => (
                                        <Grid key={index} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <div style={{ textAlign: 'center' }}>
                                                {
                                                    !image.isDeleted &&
                                                    <img
                                                        style={{ maxWidth: '100%', }}
                                                        src={image.data}
                                                        alt={image.name}
                                                    />
                                                }
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
                                                children={`${prescription.idCode}${prescription.id}`} />,
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

    React.useEffect(() => {
        checkCanEditOrPrint();
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
                        classes={{
                            action: classes.action,
                        }}
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
                                    {
                                        canEditOrPrint &&
                                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}
                                            style={{
                                                marginBottom: 24,
                                            }}
                                        >
                                            <Grid
                                                container
                                                justify="flex-end"
                                                alignItems="center"
                                                spacing={2}
                                            >
                                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                                                    <Button
                                                        fullWidth
                                                        color="info"
                                                        children="Sửa"
                                                        iconName="edit"
                                                        onClick={handleUpdate}
                                                    />
                                                </Grid>
                                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                                                    <Button
                                                        fullWidth
                                                        color="warning"
                                                        disabled={disabled}
                                                        loading={loading}
                                                        children="In"
                                                        iconName="print"
                                                        onClick={handlePrint}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    }

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
                                                    // children="Ngày, tháng, năm sinh:"
                                                    children="Tuổi:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    // children={`${patient.DateOfBirth}`}
                                                    children={`${patient.Age}`}
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
                                                    children="Điện thoại:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.PhoneNumber}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Số điện thoại người thân:"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${patient.RelativePhoneNumber}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="Ngày hẹn khám (nếu có):"
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${_.toString(patient.AppointmentDate)}`}
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
                                                                children={`${history.BloodPressure} lần/phút`}
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
                                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                            <Typography
                                                                variant="body1"
                                                                component="p"
                                                                children="Khác:"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                            <Typography
                                                                variant="h6"
                                                                component="h6"
                                                                children={`${history.Other}`}
                                                                style={{ fontWeight: 600 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                                            <Typography
                                                                variant="body1"
                                                                component="p"
                                                                children="Ghi chú:"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                                            <Typography
                                                                variant="h6"
                                                                component="h6"
                                                                children={`${history.Note}`}
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
                                                                        {
                                                                            !image.isDeleted &&
                                                                            <img
                                                                                style={{ maxWidth: '100%', }}
                                                                                src={image.data}
                                                                                alt={image.name}
                                                                            />
                                                                        }
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
