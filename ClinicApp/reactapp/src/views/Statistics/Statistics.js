import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
} from '@material-ui/core';
import moment from 'moment';

import { BarChart, LineChart } from '../../components/Chart';
import { DatePicker } from '../../components/DatePicker';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Snackbar } from '../../components/Snackbar';

import Axios, {
    axiosRequestConfig,
} from '../../common';
import {
    GetPatientStatUrl,
    GetPrescriptionStatUrl,
    GetMedicineStatUrl,
} from '../../config';
import {
    PeriodConstants,
    DataDateTimeFormat,
    DisplayDateFormat,
    ExpiredSessionMsg,
    NotFoundMsg,
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
    select: {
        marginTop: 0,
        marginBottom: 0,
        'min-width': 100,
    },
}));

const periodOptions = [
    {
        value: PeriodConstants.Day,
        label: 'Ngày',
    },
    {
        value: PeriodConstants.Week,
        label: 'Tuần',
    },
    {
        value: PeriodConstants.Month,
        label: 'Tháng',
    },
];

const getPrescriptionStatErrorMsg = '[Get Prescription Stat Error]';
const getPatientStatErrorMsg = '[Get Patient Stat Error]';
const getMedicineStatErrorMsg = '[Get Medicine Stat Error]';

const StatisticsView = () => {
    const classes = useStyles();
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

    let patientChart = React.createRef();
    let prescriptionChart = React.createRef();
    let medicineChart = React.createRef();

    const [selectedTimePeriod, setSelectedTimePeriod] = React.useState(PeriodConstants.Day);
    const handleTimePeriodChange = event => {
        setSelectedTimePeriod(event.target.value);
    };

    const [selectedStartDate, setSelectedStartDate] = React.useState(moment().subtract(7, 'day'));
    const [selectedEndDate, setSelectedEndDate] = React.useState(moment().add(1, 'day'));
    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    };
    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    };

    const handleSearch = () => {
        getPatientStat();
    };

    const [disabled, setDisabled] = React.useState(false);
    const [loadingSearch, setLoadingSearch] = React.useState(false);
    const [loadingPrescriptionSearch, setLoadingPrescriptionSearch] = React.useState(false);

    const [xAxisPatientData, setXAxisPatientData] = React.useState([]);
    const [allPatientData, setAllPatientData] = React.useState([]);
    const getPatientStat = () => {
        const startDate = selectedStartDate.format(DataDateTimeFormat);
        const endDate = selectedEndDate.format(DataDateTimeFormat);
        const period = selectedTimePeriod;

        setDisabled(true);
        setLoadingSearch(true);

        Axios.get(GetPatientStatUrl, {
            ...config,
            params: {
                startDate,
                endDate,
                period,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { all } = data[0];
                let xAxis = [];
                const allY = [];

                all.map(({ x, y }) => {
                    xAxis.push(x);
                    allY.push(y);
                });
                if (selectedTimePeriod === PeriodConstants.Day) {
                    xAxis = xAxis.map(x => moment(x).format(DisplayDateFormat));
                }
                if (selectedTimePeriod === PeriodConstants.Week) {
                    xAxis = xAxis.map(({ year, week }) => `T${week}-${year}`);
                }
                if (selectedTimePeriod === PeriodConstants.Month) {
                    xAxis = xAxis.map(({ year, month }) => `${month}-${year}`);
                }
                setXAxisPatientData(xAxis);
                setAllPatientData(allY);
            }
            setDisabled(false);
            setLoadingSearch(false);
        }).catch((reason) => {
            handleError(reason, getPatientStatErrorMsg);
            setDisabled(false);
            setLoadingSearch(false);
        });
    };

    const [presSelectedTimePeriod, setPresSelectedTimePeriod] = React.useState(PeriodConstants.Day);
    const handlePresTimePeriodChange = event => {
        setPresSelectedTimePeriod(event.target.value);
    };

    const [presSelectedStartDate, setPresSelectedStartDate] = React.useState(moment().subtract(7, 'day'));
    const [presSelectedEndDate, setPresSelectedEndDate] = React.useState(moment().add(1, 'day'));
    const handlePresStartDateChange = date => {
        setPresSelectedStartDate(date);
    };
    const handlePresEndDateChange = date => {
        setPresSelectedEndDate(date);
    };

    const handlePrescriptionStatSearch = () => {
        getPrescriptionStat();
    };

    const [xAxisPrescriptionData, setXAxisPrescriptionData] = React.useState([]);
    const [prescriptionData, setPrescriptionData] = React.useState([]);
    const getPrescriptionStat = () => {
        const startDate = presSelectedStartDate.format(DataDateTimeFormat);
        const endDate = presSelectedEndDate.format(DataDateTimeFormat);
        const period = presSelectedTimePeriod;

        setDisabled(true);
        setLoadingPrescriptionSearch(true);

        Axios.get(GetPrescriptionStatUrl, {
            ...config,
            params: {
                startDate,
                endDate,
                period,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                let xAxis = [];
                const yAxis = [];
                data.map(({ x, y }) => {
                    xAxis.push(x);
                    yAxis.push(y);
                });
                if (presSelectedTimePeriod === PeriodConstants.Day) {
                    xAxis = xAxis.map(x => moment(x).format(DisplayDateFormat));
                }
                if (presSelectedTimePeriod === PeriodConstants.Week) {
                    xAxis = xAxis.map(({ year, week }) => `T${week}-${year}`);
                }
                if (presSelectedTimePeriod === PeriodConstants.Month) {
                    xAxis = xAxis.map(({ year, month }) => `${month}-${year}`);
                }
                setXAxisPrescriptionData(xAxis);
                setPrescriptionData(yAxis);
            }
            setDisabled(false);
            setLoadingPrescriptionSearch(false);
        }).catch((reason) => {
            handleError(reason, getPrescriptionStatErrorMsg);
            setDisabled(false);
            setLoadingPrescriptionSearch(false);
        });
    };

    const [xAxisMedicineData, setXAxisMedicineData] = React.useState([]);
    const [medicineData, setMedicineData] = React.useState([]);
    const getMedicineStat = () => {
        Axios.get(GetMedicineStatUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const xAxis = [];
                const yAxis = [];
                data.map(({ name, totalQuantity, unit }) => {
                    xAxis.push(`${name} (${unit})`);
                    yAxis.push(totalQuantity);
                });
                setXAxisMedicineData(xAxis);
                setMedicineData(yAxis);
            }
        }).catch((reason) => {
            handleError(reason, getMedicineStatErrorMsg);
        });
    };

    React.useEffect(() => {
        getPatientStat();
        getPrescriptionStat();
        getMedicineStat();
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THỐNG KÊ BỆNH NHÂN"
                        subheader="Thống kê số lượng bệnh nhân"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid container spacing={3} justify="center" alignItems="center" >
                                <Grid item>
                                    <DatePicker
                                        id="patientStartDatePicker"
                                        label="Từ ngày"
                                        value={selectedStartDate}
                                        onChange={(date) => handleStartDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <DatePicker
                                        id="patientEndDatePicker"
                                        label="Tới ngày"
                                        value={selectedEndDate}
                                        onChange={(date) => handleEndDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Select
                                        className={classes.select}
                                        id="patientTimePeriod"
                                        label="Theo"
                                        value={selectedTimePeriod}
                                        onChange={handleTimePeriodChange}
                                        options={periodOptions}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        children={`Tìm kiếm`}
                                        color="success"
                                        iconName="search"
                                        style={{ marginTop: 0, marginBottom: 0 }}
                                        onClick={handleSearch}
                                        disabled={disabled}
                                        loading={loadingSearch}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} style={{ marginTop: 24 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <LineChart
                                        ref={(e) => { patientChart = e; }}
                                        style={{ height: '350px', width: '100%' }}
                                        xAxisData={xAxisPatientData}
                                        series={[
                                            {
                                                name: 'Số bệnh nhân',
                                                type: 'line',
                                                data: allPatientData,
                                                axisTick: {
                                                    alignWithLabel: true,
                                                },
                                                lineStyle: {
                                                    color: '#3f51b5',
                                                    width: 3,
                                                },
                                            },
                                        ]}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THỐNG KÊ ĐƠN THUỐC"
                        subheader="Thống kê số lượng đơn thuốc"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid container spacing={3} justify="center" alignItems="center" >
                                <Grid item>
                                    <DatePicker
                                        id="presStartDatePicker"
                                        label="Từ ngày"
                                        value={presSelectedStartDate}
                                        onChange={(date) => handlePresStartDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <DatePicker
                                        id="presEndDatePicker"
                                        label="Tới ngày"
                                        value={presSelectedEndDate}
                                        onChange={(date) => handlePresEndDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Select
                                        className={classes.select}
                                        id="presTimePeriod"
                                        label="Theo"
                                        value={presSelectedTimePeriod}
                                        onChange={handlePresTimePeriodChange}
                                        options={periodOptions}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        children={`Tìm kiếm`}
                                        color="success"
                                        iconName="search"
                                        style={{ marginTop: 0, marginBottom: 0 }}
                                        onClick={handlePrescriptionStatSearch}
                                        disabled={disabled}
                                        loading={loadingPrescriptionSearch}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} style={{ marginTop: 24 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <LineChart
                                        ref={(e) => { prescriptionChart = e; }}
                                        style={{ height: '350px', width: '100%' }}
                                        xAxisData={xAxisPrescriptionData}
                                        series={[
                                            {
                                                name: 'Số lượng đơn thuốc',
                                                type: 'line',
                                                data: prescriptionData,
                                                axisTick: {
                                                    alignWithLabel: true,
                                                },
                                                lineStyle: {
                                                    color: '#3f51b5',
                                                    width: 3,
                                                },
                                            },
                                        ]}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THỐNG KÊ THUỐC"
                        subheader="Thống kê số lượng thuốc trong kho dữ liệu"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid container spacing={3} style={{ marginTop: 24 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <BarChart
                                        ref={(e) => { medicineChart = e; }}
                                        style={{ height: '350px', width: '100%' }}
                                        xAxisData={xAxisMedicineData}
                                        series={[
                                            {
                                                name: 'Số lượng đã nhập',
                                                type: 'bar',
                                                data: medicineData,
                                                axisTick: {
                                                    alignWithLabel: true,
                                                },
                                                itemStyle: {
                                                    color: '#3f51b5',
                                                },
                                            },
                                        ]}
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
};

export default StatisticsView;
