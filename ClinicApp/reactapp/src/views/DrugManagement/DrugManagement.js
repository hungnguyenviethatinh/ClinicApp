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
import _ from 'lodash';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Snackbar } from '../../components/Snackbar';
import { Button } from '../../components/Button';
import { Status } from '../../components/Status';
import { SearchInput } from '../../components/SearchInput';
import { DeleteConfirm } from '../../components/DeleteConfirm';

import {
    DrugStatus,
    ExpiredSessionMsg
} from '../../constants';
import Axios, {
    axiosRequestConfig,
} from '../../common';
import {
    GetAllMedicinesUrl,
    GetMedicineUrl,
    AddMedicineUrl,
    UpdateMedicineUrl,
    DeleteMedicineUrl,
    GetUnitUrl
} from '../../config';
import { Select } from '../../components/Select';

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
const updateMedicineLogMsfHeader = '[Update Medicine Error]';
const deleteMedicineLogMsfHeader = '[Delete Medicine Error]';
const getUnitsLogMsfHeader = '[Get Units Error]';

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

    const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
    const onOpenDeleteConfirm = () => {
        setOpenDeleteConfirm(true);
    };
    const handlCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
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
        setSearchValue(event.target.value);
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

    const handleMedicineKeyPress = event => {
        if (event.key === 'Enter') {
            handleDone();
        }
    };

    const handleReset = () => {
        setMedicine({
            Name: '',
            Quantity: '',
            Unit: '',
            Price: '',
        });
    };

    const [disabled, setDisabled] = React.useState(false);
    const [loadingDelete, setLoadingDelete] = React.useState(false);
    const [loadingDone, setLoadingDone] = React.useState(false);

    const handleDone = () => {
        if (!medicine.Name.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên thuốc!');
            return;
        }
        if (!medicine.Quantity.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập số lượng thuốc!');
            return;
        }
        if (medicine.Quantity.trim() && !_.isFinite(_.toNumber(medicine.Quantity))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số cho số lượng thuốc!');
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
        if (medicine.Price.trim() && !_.isFinite(_.toNumber(medicine.Price))) {
            handleSnackbarOption('error', 'Yêu cầu nhập số cho giá thuốc!');
            return;
        }

        setDisabled(true);
        setLoadingDone(true);

        const medicineModel = {
            Name: medicine.Name.trim(),
            Quantity: _.toNumber(medicine.Quantity),
            Unit: medicine.Unit,
            Price: _.toNumber(medicine.Price),
        };

        if (!updateMode) {
            addMedicine(medicineModel);
        } else {
            const { id } = selectedRow;
            updateMedicine(id, medicineModel);
        }
    };

    const handleDelete = () => {
        const { id } = selectedRow;
        setDisabled(true);
        setLoadingDelete(true);
        deleteMedicine(id);
        setOpenDeleteConfirm(false);
    };

    const config = axiosRequestConfig();

    const addMedicine = (medicineModel) => {
        Axios.post(AddMedicineUrl, medicineModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm thuốc vào kho dữ liêu thành công!');
                handleReset();
                refreshData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi thêm thuốc vào kho dữ liệu!');
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleError(reason, addMedicineLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi thêm thuốc vào kho dữ liệu!');
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const updateMedicine = (id, medicineModel) => {
        const url = `${UpdateMedicineUrl}/${id}`;
        Axios.put(url, medicineModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật dữ liệu thuốc thành công!');
                refreshData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin thuốc!');
            }
            setDisabled(false);
            setLoadingDone(false);
        }).catch((reason) => {
            handleError(reason, updateMedicineLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật thông tin thuốc!');
            setDisabled(false);
            setLoadingDone(false);
        });
    };

    const deleteMedicine = (id) => {
        Axios.delete(`${DeleteMedicineUrl}/${id}`, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thuốc đã được xóa thành công!');
                handleReset();
                setSelectedRow(null);
                setUpdateMode(false);
                refreshData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa loại thuốc này!');
            }
            setDisabled(false);
            setLoadingDelete(false);
        }).catch((reason) => {
            handleError(reason, deleteMedicineLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa loại thuốc này!');
            setDisabled(false);
            setLoadingDelete(false);
        });
    };

    const [updateMode, setUpdateMode] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            const { id } = rowData;
            getMedicine(id);
            setUpdateMode(true);
        } else {
            setSelectedRow(null);
            handleReset();
            setUpdateMode(false);
        }
    };

    const getMedicine = (id) => {
        setDisabled(true);
        const url = `${GetMedicineUrl}/${id}`;
        Axios.get(url, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { name, quantity, unit, price } = data[0];
                setMedicine({
                    Name: name,
                    Quantity: quantity,
                    Unit: unit,
                    Price: price,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getMedicineLogMsfHeader);
            setDisabled(false);
        });
    };

    const getMedicines = (resolve, reject, query) => {
        setDisabled(true);
        const value = searchValue.trim();
        Axios.get(GetAllMedicinesUrl, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
                query: value,
            }
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, medicines } = data[0];
                const { page } = query;

                resolve({
                    data: medicines,
                    page,
                    totalCount,
                });
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getMedicinesLogMsfHeader);
            setDisabled(false);
        });
    };

    const [unitOptions, setUnitOptions] = React.useState([{
        label: '',
        value: '',
    }]);
    const getUnitOptions = () => {
        setDisabled(true);
        Axios.get(GetUnitUrl, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const options = [];
                data.map(({ name }) => options.push({
                    label: name,
                    value: name,
                }));
                setUnitOptions(options);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getUnitsLogMsfHeader);
            setDisabled(false);
        });
    };

    React.useEffect(() => {
        getUnitOptions();
    }, []);

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
                                        onKeyPress={handleMedicineKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="Quantity"
                                        label="Số lượng"
                                        value={medicine.Quantity}
                                        onChange={handleMedicineChange('Quantity')}
                                        onKeyPress={handleMedicineKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Select
                                        fullWidth
                                        id="Unit"
                                        label="Đơn vị"
                                        value={medicine.Unit}
                                        options={unitOptions}
                                        onChange={handleMedicineChange('Unit')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="Price"
                                        label="Giá"
                                        placeholder={`...đồng/${medicine.Unit}`}
                                        value={medicine.Price}
                                        onChange={handleMedicineChange('Price')}
                                        onKeyPress={handleMedicineKeyPress}
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
                                        disabled={disabled}
                                        color="info"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleReset}
                                    />
                                </Grid>
                                {
                                    selectedRow &&
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Button
                                            fullWidth
                                            disabled={disabled}
                                            loading={loadingDelete}
                                            color="danger"
                                            children="Xóa"
                                            iconName="delete"
                                            onClick={onOpenDeleteConfirm}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        loading={loadingDone}
                                        color="success"
                                        children={selectedRow ? 'Lưu' : 'Hoàn tất'}
                                        iconName={selectedRow ? 'save' : 'done'}
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
            <DeleteConfirm
                open={openDeleteConfirm}
                handleClose={handlCloseDeleteConfirm}
                handleDelete={handleDelete}
            />
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
