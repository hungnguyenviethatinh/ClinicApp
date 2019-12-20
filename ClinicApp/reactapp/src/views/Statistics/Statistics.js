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
    DisplayDateFormat
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

    let patientChart = React.createRef();
    let prescriptionChart = React.createRef();
    let medicineChart = React.createRef();

    const [selectedTimePeriod, setSelectedTimePeriod] = React.useState(PeriodConstants.Day);
    const handleTimePeriodChange = event => {
        setSelectedTimePeriod(event.target.value);
    };

    const [selectedStartDate, setSelectedStartDate] = React.useState(moment().subtract(7, 'day'));
    const [selectedEndDate, setSelectedEndDate] = React.useState(moment());
    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    };
    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    };

    const handleSearch = () => {
        getPatientStat();
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

    const config = axiosRequestConfig();

    const [disabled, setDisabled] = React.useState(false);
    const [loadingSearch, setLoadingSearch] = React.useState(false);
    const [loadingPrescriptionSearch, setLoadingPrescriptionSearch] = React.useState(false);

    const [xAxisPatientData, setXAxisPatientData] = React.useState([]);
    const [allPatientData, setAllPatientData] = React.useState([]);
    // const [isNewPatientData, setIsNewPatientData] = React.useState([]);
    // const [isCheckedPatientData, setIsCheckedPatientData] = React.useState([]);
    // const [recheckPatientData, setRecheckPatientData] = React.useState([]);
    // const [appointedPatientData, setAppointedPatientData] = React.useState([]);
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
                const { all, /* isNew, isChecked, recheck, appointed */ } = data[0];
                let xAxis = [];
                const allY = [];
                // const isNewY = [];
                // const isCheckedY = [];
                // const recheckY = [];
                // const appointedY = [];

                all.map(({ x, y }) => {
                    xAxis.push(x);
                    allY.push(y);
                });
                // isNew.map(({ x, y }) => {
                //     isNewY.push(y);
                // });
                // isChecked.map(({ x, y }) => {
                //     isCheckedY.push(y);
                // });
                // recheck.map(({ x, y }) => {
                //     recheckY.push(y);
                // });
                // appointed.map(({ x, y }) => {
                //     appointedY.push(y);
                // });
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
                // setIsNewPatientData(isNewY);
                // setIsCheckedPatientData(isCheckedY);
                // setRecheckPatientData(recheckY);
                // setAppointedPatientData(appointedY);
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
    const [presSelectedEndDate, setPresSelectedEndDate] = React.useState(moment());
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
                data.map(({ name, quantity, unit }) => {
                    xAxis.push(`${name} (${unit})`);
                    yAxis.push(quantity);
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
                                        id="startDatePicker1"
                                        label="Từ ngày"
                                        value={selectedStartDate}
                                        onChange={(date) => handleStartDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <DatePicker
                                        id="endDatePicker1"
                                        label="Tới ngày"
                                        value={selectedEndDate}
                                        onChange={(date) => handleEndDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Select
                                        className={classes.select}
                                        id="timePeriod1"
                                        label="Theo"
                                        value={selectedTimePeriod}
                                        onChange={handleTimePeriodChange}
                                        options={periodOptions}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        children="Tìm kiếm"
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
                                            // {
                                            //     name: 'Mới',
                                            //     type: 'line',
                                            //     data: isNewPatientData,
                                            //     axisTick: {
                                            //         alignWithLabel: true,
                                            //     },
                                            //     lineStyle: {
                                            //         color: '#28a745',
                                            //         width: 3,
                                            //     },
                                            // },
                                            // {
                                            //     name: 'Đã khám',
                                            //     type: 'line',
                                            //     data: isCheckedPatientData,
                                            //     axisTick: {
                                            //         alignWithLabel: true,
                                            //     },
                                            //     lineStyle: {
                                            //         color: '#dc3545',
                                            //         width: 3,
                                            //     },
                                            // },
                                            // {
                                            //     name: 'Tái khám',
                                            //     type: 'line',
                                            //     data: recheckPatientData,
                                            //     axisTick: {
                                            //         alignWithLabel: true,
                                            //     },
                                            //     lineStyle: {
                                            //         color: '#6c757d',
                                            //         width: 3,
                                            //     },
                                            // },
                                            // {
                                            //     name: 'Đặt lịch hẹn',
                                            //     type: 'line',
                                            //     data: appointedPatientData,
                                            //     axisTick: {
                                            //         alignWithLabel: true,
                                            //     },
                                            //     lineStyle: {
                                            //         color: '#17a2b8',
                                            //         width: 3,
                                            //     },
                                            // },
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
                                        id="startDatePicker2"
                                        label="Từ ngày"
                                        value={presSelectedStartDate}
                                        onChange={(date) => handlePresStartDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <DatePicker
                                        id="endDatePicker2"
                                        label="Tới ngày"
                                        value={presSelectedEndDate}
                                        onChange={(date) => handlePresEndDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Select
                                        className={classes.select}
                                        id="timePeriod2"
                                        label="Theo"
                                        value={presSelectedTimePeriod}
                                        onChange={handlePresTimePeriodChange}
                                        options={periodOptions}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        children="Tìm kiếm"
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
                                                name: 'Số lượng còn lại',
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
        </Grid>
    );
};

export default StatisticsView;
