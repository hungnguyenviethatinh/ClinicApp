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
import { SearchInput } from '../../components/SearchInput';

import {
    IdPrefix,
    Gender,
} from '../../constants';
import { GetPatientsByDoctorUrl } from '../../config';
import Axios, {
    axiosConfig
} from '../../common';
import { encodeId, decodeId } from '../../utils';
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

const addressSeperator = ',';

const patientColumns = [
    {
        title: 'Mã BN', field: 'id', defaultSort: 'asc',
        render: rowData =>
            <Link
                to={`/patient/${rowData.id}`}
                children={
                    encodeId(rowData.id, IdPrefix.Patient)
                } />,
    },
    {
        title: 'Họ & Tên', field: 'fullName',
    },
    {
        title: 'Năm sinh', field: 'dateOfBirth', type: 'date',
        render: rowData => moment(rowData.dateOfBirth).year(),
    },
    {
        title: 'Giới tính', field: 'gender', type: 'numeric',
        render: rowData => [Gender.None, Gender.Male, Gender.Female][rowData.gender],
    },
    {
        title: 'Số ĐT', field: 'phoneNumber',
    },
    {
        title: 'Địa chỉ', field: 'address',
        render: rowData => _.last(rowData.address.split(addressSeperator)),
    },
];

const Patients = () => {
    const classes = useStyles();

    let tableRef = React.createRef();

    const refreshData = () => {
        tableRef.current && tableRef.current.onQueryChange();
    };

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value.trim());
    };
    const handleSearch = event => {
        event.preventDefault();
        refreshData();
    };

    const getPatients = (resolve, reject, query) => {
        let value = searchValue.toLowerCase();
        const prefix = IdPrefix.Patient.toLowerCase();
        if (value.startsWith(prefix)) {
            value = decodeId(value, prefix);
        }
        const config = axiosConfig();
        Axios.get(GetPatientsByDoctorUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: value,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const patients = data.patients;
                const page = query.page;
                const totalCount = data.totalCount;
                resolve({
                    data: patients,
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
            console.log('Get Patients Error: ', reason);
        });
    };

    return (
        <Grid
            container
            spacing={3}
            style={{ height: '100%' }}
        >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="DANH SÁCH BỆNH NHÂN"
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
                                children="TÌM KIẾM BỆNH NHÂN"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <SearchInput
                                        placeholder="Nhập mã số, tên hoặc sđt của bệnh nhân"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        onSearch={handleSearch}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={tableRef}
                            columns={patientColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPatients(resolve, reject, query);
                                })
                            }
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Patients;
