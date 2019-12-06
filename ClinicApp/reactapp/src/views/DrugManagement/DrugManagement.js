import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import moment from 'moment';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Snackbar } from '../../components/Snackbar';
import { Button } from '../../components/Button';
import { Status } from '../../components/Status';

import {
    DrugStatus,
    ExpiredSessionMsg
} from '../../constants';
import Axios, {
    axiosConfig,
    axiosConfigJson,
} from '../../common';
import {
    GetAllMedicinesUrl,
    GetMedicineUrl,
    AddMedicineUrl,
    UpdateMedicineUrl
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

const medicineColumns = [
    {
        title: 'Tên thuốc', field: 'name',
    },
    {
        title: 'Số lượng', field: 'quantity', type: 'numeric',
    },
    {
        title: 'Đơn vị', field: 'unit',
    },
    {
        title: 'Giá', field: 'price',
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            const status = [
                DrugStatus.No,
                DrugStatus.Yes][rowData.status]
            return <Status status={status} />
        },
    },
];

const getMedicinesLogMsfHeader = '[Get Medicines Error]';
const getMedicineLogMsfHeader = '[Get Medicine Error]';
const addMedicineLogMsfHeader = '[Add Medicine Error]';

const DrugManagement = () => {

    const classes = useStyles();

    const tableRef = React.useRef(null);
    const refreshData = () => {
        tableRef.current && tableRef.current.onQueryChange();
    };

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

    const [searchValue, setSearchValue] = React.useState('');
    const handleSearchChange = event => {
        setSearchValue(event.target.value.trim());
    };
    const handleSearch = event => {
        event.preventDefault();
        refreshData();
    };

    const [medicine, setMedicine] = React.useState({
        Name: '',
        Quantity: '',
        Unit: '',
        Price: '',
    });
    const handleMedicineChange = prop => event => {
        setMedicine({
            ...medicine,
            [prop]: event.target.value,
        })
    };

    const handleReset = () => {
        setMedicine({
            Name: '',
            Quantity: '',
            Unit: '',
            Price: '',
        });
    };

    const handleDone = () => {
        if (!medicine.Name.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên thuốc!');
            return;
        }
        if (!medicine.Quantity.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập số lượng thuốc!');
            return;
        }
        if (!medicine.Unit.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập đơn vị thuốc!');
            return;
        }
        if (!medicine.Price.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập giá thuốc!');
            return;
        }

        if (!updateMode) {
            addMedicine(medicine);
        } else {
            const { id } = selectedRow;
            updateMedicine(id, medicine);
        }
    };

    const addMedicine = (medicineModel) => {
        Axios.post(AddMedicineUrl, medicineModel, axiosConfigJson()).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm thuốc vào kho dữ liêu thành công!');
                handleReset();
                refreshData();
            }
        }).catch((reason) => {
            handleError(reason, addMedicineLogMsfHeader);
        });
    };

    const updateMedicine = (id, medicineModel) => {
        const url = `${UpdateMedicineUrl}/${id}`;
        Axios.put(url, medicineModel, axiosConfigJson()).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật dữ liệu thuốc thành công!');
                handleReset();
                refreshData();
            }
        }).catch((reason) => {
            handleError(reason, addMedicineLogMsfHeader);
        });
    };

    const [updateMode, setUpdateMode] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            const { id } = rowData.id;
            getMedicine(id);
            setUpdateMode(true);
        } else {
            setSelectedRow(null);
            handleReset();
            setUpdateMode(false);
        }
    };

    const config = axiosConfig();

    const getMedicine = (id) => {
        const url = `${GetMedicineUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { name, quantity, unit, price } = data;
                setMedicine({
                    Name: name,
                    Quantity: quantity,
                    Unit: unit,
                    Price: price,
                });
            }
        }).catch((reason) => {
            handleError(reason, getMedicineLogMsfHeader);
        });
    };

    const getMedicines = (resolve, reject, query) => {
        Axios.get(GetAllMedicinesUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, medicines } = data;
                const page = query.page;

                resolve({
                    data: medicines,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            handleError(reason, getMedicinesLogMsfHeader);
        });
    };

    return (
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="QUẢN LÝ THUỐC"
                        subheader="Thêm, cập nhật thuốc tại đây"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography
                                variant="caption"
                                component="p"
                                children="BIỂU MẪU THÊM THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="Name"
                                        label="Tên thuốc"
                                        value={medicine.Name}
                                        onChange={handleMedicineChange('Name')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="Quantity"
                                        label="Số lượng"
                                        value={medicine.Quantity}
                                        onChange={handleMedicineChange('Quantity')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="Unit"
                                        label="Đơn vị"
                                        value={medicine.Unit}
                                        onChange={handleMedicineChange('Unit')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="Price"
                                        label="Giá"
                                        value={medicine.Price}
                                        onChange={handleMedicineChange('Price')}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                justify="flex-end"
                                style={{ marginTop: 8 }}
                            >
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        color="info"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        color="success"
                                        children="Hoàn tất"
                                        iconName="done"
                                        onClick={handleDone}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="DANH SÁCH THUỐC"
                        subheader="Danh sách thuốc đã có dữ liệu trên hệ thống"
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
                                children="TÌM KIẾM THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <SearchInput
                                        placeholder="Nhập tên thuốc để tìm kiếm"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        onSearch={handleSearch}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Table
                            tableRef={tableRef}
                            columns={medicineColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getMedicines(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectRow}
                            selectedRow={selectedRow}
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
}

export default DrugManagement;
