import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';

import { Table } from '../../components/Table';
import { Status } from '../../components/Status';
import { SearchInput } from '../../components/SearchInput';
import { Snackbar } from '../../components/Snackbar';

import {
    PrescriptionStatus,
    DisplayDateFormat,
    RouteConstants,
    ExpiredSessionMsg,
} from '../../constants';
import { GetPrescriptionsUrl } from '../../config';
import Axios, {
    axiosRequestConfig,
} from '../../common';
import moment from 'moment';

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

const prescriptionColumns = [
    {
        title: 'Mã ĐT', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.PrescriptionDetailView.replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bác sĩ kê đơn', field: 'doctorId',
        render: rowData => `BS. ${rowData.doctor.fullName}`,
    },
    {
        title: 'Bệnh nhân', field: 'patientId',
        render: rowData =>
            <Link
                to={`${RouteConstants.PatientDetailView.replace(':id', rowData.patientId)}`}
                children={`${rowData.patient.fullName}`}
            />,
    },
    {
        title: 'Ngày kê đơn', field: 'dateCreated', type: 'date',
        render: rowData => moment(rowData.dateCreated).format(DisplayDateFormat),
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            const status = [
                PrescriptionStatus.IsNew,
                PrescriptionStatus.IsPending,
                PrescriptionStatus.IsPrinted][rowData.status]
            return <Status status={status} />
        },
    },
];

const Prescriptions = () => {
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

    let tableRef = React.createRef();

    const refreshData = () => {
        tableRef.current && tableRef.current.onQueryChange();
    };

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    };
    const handleSearch = event => {
        event.preventDefault();
        refreshData();
    };

    const getPrescriptions = (resolve, reject, query) => {
        Axios.get(GetPrescriptionsUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: searchValue,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, prescriptions } = data[0];
                const { page } = query;
                resolve({
                    data: prescriptions,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            if (reason.response) {
                const { status } = reason.response;
                if (status === 401) {
                    handleSnackbarOption('error', ExpiredSessionMsg);
                }
            }
            console.log('Get Prescriptions Error: ', reason);
        });
    };

    return (
        <Grid
            container
            spacing={3}
            style={{ height: '100%' }}
        >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="DANH SÁCH ĐƠN THUỐC"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper
                            elevation={0}
                            className={classes.paper}
                            style={{ paddingBottom: 10 }}
                        >
                            <Typography
                                variant="caption"
                                component="p"
                                children="TÌM KIẾM ĐƠN THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <SearchInput
                                        placeholder="Nhập mã đt, tên bác sĩ hoặc tên bệnh nhân để tìm đơn thuốc"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        onSearch={handleSearch}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={tableRef}
                            columns={prescriptionColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPrescriptions(resolve, reject, query);
                                })
                            }
                        />
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

export default Prescriptions;
