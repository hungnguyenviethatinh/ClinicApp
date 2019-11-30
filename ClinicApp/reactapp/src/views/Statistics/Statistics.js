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
        value: 'DAY',
        label: 'Ngày',
    },
    {
        value: 'WEEK',
        label: 'Tuần',
    },
    {
        value: 'MONTH',
        label: 'Tháng',
    },
];

const xAxisPatientData = ['1/1/2019', '2/1/2019', '3/1/2019', '4/1/2019', '5/1/2019', '6/1/2019', '7/1/2019', '8/1/2019', '9/1/2019', '10/1/2019' ];
const patientData = [10, 2, 15, 5, 8, 0, 0, 11, 12, 1 ];

const xAxisPresData = ['1/1/2019', '2/1/2019', '3/1/2019', '4/1/2019', '5/1/2019', '6/1/2019', '7/1/2019', '8/1/2019', '9/1/2019', '10/1/2019' ];
const presDrugData = [9, 1, 15, 5, 8, 0, 0, 11, 12, 1 ];
const presRequData = [1, 1, 0, 5, 8, 0, 0, 11, 12, 1 ];

const StatisticsView = () => {
    const classes = useStyles();

    let patientChart = React.createRef();
    let prescriptionChart = React.createRef();

    const [selectedTimePeriod, setSelectedTimePeriod] = React.useState('DAY');
    const handleTimePeriodChange = event => {
        setSelectedTimePeriod(event.target.value);
    };

    const [selectedStartDate, setSelectedStartDate] = React.useState(moment());
    const [selectedEndDate, setSelectedEndDate] = React.useState(moment());
    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    };
    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    };

    const handleSearch = () => {

    };

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
                            <Grid container spacing={3} alignItems="center" >
                                <Grid item>
                                    <DatePicker
                                        id="startDatePicker"
                                        label="Từ ngày"
                                        value={selectedStartDate}
                                        onChange={(date) => handleStartDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <DatePicker
                                        id="endDatePicker"
                                        label="Tới ngày"
                                        value={selectedEndDate}
                                        onChange={(date) => handleEndDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Select
                                        className={classes.select}
                                        id="timePeriod"
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
                                                data: patientData,
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
                            <Grid container spacing={3} alignItems="center" >
                                <Grid item>
                                    <DatePicker
                                        id="startDatePicker"
                                        label="Từ ngày"
                                        value={selectedStartDate}
                                        onChange={(date) => handleStartDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <DatePicker
                                        id="endDatePicker"
                                        label="Tới ngày"
                                        value={selectedEndDate}
                                        onChange={(date) => handleEndDateChange(date)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Select
                                        className={classes.select}
                                        id="timePeriod"
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
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} style={{ marginTop: 24 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <BarChart
                                        ref={(e) => { prescriptionChart = e; }}
                                        style={{ height: '350px', width: '100%' }}
                                        xAxisData={xAxisPresData}
                                        series={[
                                            {
                                                name:'Đơn thuốc',
                                                type:'bar',
                                                stack: 'Số lượng đơn',
                                                data: presDrugData,
                                                axisTick: {
                                                    alignWithLabel: true,
                                                },
                                                itemStyle: {
                                                    color: 'blue',
                                                },
                                            },
                                            {
                                                name:'Đơn chỉ định',
                                                type:'bar',
                                                stack: 'Số lượng đơn',
                                                data: presRequData,
                                                axisTick: {
                                                    alignWithLabel: true,
                                                },
                                                itemStyle: {
                                                    color: 'green',
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
