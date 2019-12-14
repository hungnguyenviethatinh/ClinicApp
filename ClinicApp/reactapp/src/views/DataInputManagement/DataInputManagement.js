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

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Snackbar } from '../../components/Snackbar';
import { Button } from '../../components/Button';
import { Status } from '../../components/Status';
import { SearchInput } from '../../components/SearchInput';

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
    GetDiagnosesUrl,
    GetDiagnosisUrl,
    AddDiagnosisUrl,
    UpdateDiagnosisUrl,
    DeleteDiagnosisUrl,
    GetUnitsUrl,
    GetUnitUrl,
    UpdateUnitUrl,
    AddUnitUrl,
    DeleteUnitUrl
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

const diagnosisColumns = [
    {
        title: 'STT', field: 'id',
    },
    {
        title: 'Tên chẩn đoán', field: 'name',
    },
];

const unitColumns = [
    {
        title: 'STT', field: 'id',
    },
    {
        title: 'Tên đơn vị', field: 'name',
    },
];

const getDiagnosesLogMsfHeader = '[Get Diagnoses Error]';
const getDiagnosisLogMsfHeader = '[Get Diagnosis Error]';
const addDiagnosisLogMsfHeader = '[Add Diagnosis Error]';
const updateDiagnosisLogMsfHeader = '[Update Diagnosis Error]';
const deleteDiagnosisLogMsfHeader = '[Delete Diagnosis Error]';
const getUnitsLogMsfHeader = '[Get Units Error]';
const getUnitLogMsfHeader = '[Get Unit Error]';
const addUnitLogMsfHeader = '[Add Unit Error]';
const updateUnitLogMsfHeader = '[Update Unit Error]';
const deleteUnitLogMsfHeader = '[Delete Unit Error]';

const DataInputManagement = () => {

    const classes = useStyles();

    const diagnosisTableRef = React.useRef(null);
    const refreshDiagnosisData = () => {
        diagnosisTableRef.current && diagnosisTableRef.current.onQueryChange();
    };

    const unitTableRef = React.useRef(null);
    const refreshUnitData = () => {
        unitTableRef.current && unitTableRef.current.onQueryChange();
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

    const config = axiosRequestConfig();

    const [diagnosisName, setDiagnosisName] = React.useState('');
    const handleDiagnosisNameChange = event => {
        setDiagnosisName(event.target.value);
    };

    const handleDiagnosisDone = () => {
        if (!diagnosisName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên chẩn đoán!');
            return;
        }

        const diagnosisModel = {
            Name: diagnosisName,
        };
        if (!updateDiagnosisMode) {
            addDiagnosis(diagnosisModel);
        } else {
            const { id } = selectedDiagnosisRow;
            updateDiagnosis(id, diagnosisModel);
        }
    };

    const handleDiagnosisDelete = () => {
        const { id } = selectedDiagnosisRow;
        deleteDiagnosis(id);
    };

    const handleDiagnosisReset = () => {
        setDiagnosisName('');
    };

    const getDiagnoses = (resolve, reject, query) => {
        Axios.get(GetDiagnosesUrl, config).then((response) => {
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
            handleError(reason, getDiagnosesLogMsfHeader);
        });
    };

    const getDiagnosis = (id) => {
        Axios.get(`${GetDiagnosisUrl}/${id}`, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { name } = data[0];
                setDiagnosisName(name);
            }
        }).catch((reason) => {
            handleError(reason, getDiagnosisLogMsfHeader);
        });
    };

    const addDiagnosis = (diagnosisModel) => {
        Axios.post(AddDiagnosisUrl, diagnosisModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm chẩn đoán thành công!');
                handleDiagnosisReset();
                refreshDiagnosisData();
            }
        }).catch((reason) => {
            handleError(reason, addDiagnosisLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi thêm chẩn đoán!');
        });
    };

    const updateDiagnosis = (id, diagnosisModel) => {
        Axios.put(`${UpdateDiagnosisUrl}/${id}`, diagnosisModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật chẩn đoán thành công!');
                refreshDiagnosisData();
            }
        }).catch((reason) => {
            handleError(reason, updateDiagnosisLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật chẩn đoán!');
        });
    };

    const deleteDiagnosis = (id) => {
        Axios.delete(`${DeleteDiagnosisUrl}/${id}`, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa chẩn đoán thành công!');
                handleDiagnosisReset();
                setSelectedDiagnosisRow(null);
                setUpdateDiagnosisMode(false);
                refreshDiagnosisData();
            }
        }).catch((reason) => {
            handleError(reason, deleteDiagnosisLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa chẩn đoán!');
        });
    };

    const [updateDiagnosisMode, setUpdateDiagnosisMode] = React.useState(false);
    const [selectedDiagnosisRow, setSelectedDiagnosisRow] = React.useState(null);
    const handleSelectDiagnosisRow = (event, rowData) => {
        if (!selectedDiagnosisRow || selectedDiagnosisRow.tableData.id !== rowData.tableData.id) {
            setSelectedDiagnosisRow(rowData);
            setUpdateDiagnosisMode(true);
            getDiagnosis(rowData.id);
        } else {
            setSelectedDiagnosisRow(null);
            setUpdateDiagnosisMode(false);
            handleDiagnosisReset();
        }
    };

    const [unitName, setUnitName] = React.useState('');
    const handleUnitNameChange = event => {
        setUnitName(event.target.value);
    };

    const handleUnitDone = () => {
        if (!unitName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên đơn vị của thuốc!');
            return;
        }

        const unitModel = {
            Name: unitName,
        };
        if (!updateUnitMode) {
            addUnit(unitModel);
        } else {
            const { id } = selectedUnitRow;
            updateUnit(id, unitModel);
        }
    };

    const handleUnitDelete = () => {
        const { id } = selectedUnitRow;
        deleteUnit(id);
    };

    const handleUnitReset = () => {
        setUnitName('');
    };

    const getUnits = (resolve, reject, query) => {
        Axios.get(GetUnitsUrl, config).then((response) => {
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
            handleError(reason, getUnitsLogMsfHeader);
        });
    };

    const getUnit = (id) => {
        Axios.get(`${GetUnitUrl}/${id}`, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { name } = data[0];
                setUnitName(name);
            }
        }).catch((reason) => {
            handleError(reason, getUnitLogMsfHeader);
        });
    };

    const addUnit = (unitModel) => {
        Axios.post(AddUnitUrl, unitModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm tên đơn vị của thuốc thành công!');
                handleUnitReset();
                refreshUnitData();
            }
        }).catch((reason) => {
            handleError(reason, updateUnitLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi thêm tên đơn vị của thuốc!');
        });
    };

    const updateUnit = (id, unitModel) => {
        Axios.put(`${UpdateUnitUrl}/${id}`, unitModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật tên đơn vị của thuốc thành công!');
                refreshUnitData();
            }
        }).catch((reason) => {
            handleError(reason, updateUnitLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật tên đơn vị của thuốc!');
        });
    };

    const deleteUnit = (id) => {
        Axios.delete(`${DeleteUnitUrl}/${id}`, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa tên đơn vị của thuốc thành công!');
                handleUnitReset();
                setSelectedUnitRow(null);
                setUpdateUnitMode(false);
                refreshUnitData();
            }
        }).catch((reason) => {
            handleError(reason, updateUnitLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa tên đơn vị của thuốc!');
        });
    };

    const [updateUnitMode, setUpdateUnitMode] = React.useState(false);
    const [selectedUnitRow, setSelectedUnitRow] = React.useState(null);
    const handleSelectUnitRow = (event, rowData) => {
        if (!selectedUnitRow || selectedUnitRow.tableData.id !== rowData.tableData.id) {
            setSelectedUnitRow(rowData);
            setUpdateUnitMode(true);
            getUnit(rowData.id);
        } else {
            setSelectedUnitRow(null);
            setUpdateUnitMode(false);
            handleUnitReset();
        }
    };

    return (
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="CHẨN ĐOÁN BỆNH"
                        subheader="Thêm, cập nhật chẩn đoán bệnh tại đây"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography
                                variant="caption"
                                component="p"
                                children="BIỂU MẪU THÊM CHẨN ĐOÁN BỆNH"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="DiagnosisName"
                                        label="Tên thuốc"
                                        value={diagnosisName}
                                        onChange={handleDiagnosisNameChange}
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
                                        onClick={handleDiagnosisReset}
                                    />
                                </Grid>
                                {
                                    selectedDiagnosisRow &&
                                    <React.Fragment>
                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Button
                                                fullWidth
                                                color="danger"
                                                children="Xóa"
                                                iconName="delete"
                                                onClick={handleDiagnosisDelete}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Button
                                                fullWidth
                                                color="info"
                                                children="Lưu"
                                                iconName="save"
                                                onClick={handleDiagnosisDone}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                }
                                {
                                    !selectedDiagnosisRow &&
                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Button
                                            fullWidth
                                            color="success"
                                            children="Hoàn tất"
                                            iconName="done"
                                            onClick={handleDiagnosisDone}
                                        />
                                    </Grid>
                                }
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
                        title="DANH SÁCH TÊN CHẨN ĐOÁN"
                        subheader="Danh sách tên chẩn đoán đã có dữ liệu trên hệ thống"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={diagnosisTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={diagnosisColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getDiagnoses(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectDiagnosisRow}
                            selectedRow={selectedDiagnosisRow}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="ĐƠN VỊ THUỐC"
                        subheader="Thêm, cập nhật đơn vị thuốc tại đây"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography
                                variant="caption"
                                component="p"
                                children="BIỂU MẪU THÊM ĐƠN VỊ THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="UnitName"
                                        label="Tên đơn vị"
                                        value={unitName}
                                        onChange={handleUnitNameChange}
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
                                        onClick={handleUnitReset}
                                    />
                                </Grid>
                                {
                                    selectedUnitRow &&
                                    <React.Fragment>
                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Button
                                                fullWidth
                                                color="danger"
                                                children="Xóa"
                                                iconName="delete"
                                                onClick={handleUnitDelete}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Button
                                                fullWidth
                                                color="info"
                                                children="Lưu"
                                                iconName="save"
                                                onClick={handleUnitDone}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                }
                                {
                                    !selectedUnitRow &&
                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Button
                                            fullWidth
                                            color="success"
                                            children="Hoàn tất"
                                            iconName="done"
                                            onClick={handleUnitDone}
                                        />
                                    </Grid>
                                }
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
                        title="DANH SÁCH TÊN ĐƠN VỊ THUỐC"
                        subheader="Danh sách tên đơn vị thuốc đã có dữ liệu trên hệ thống"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={unitTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={unitColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getUnits(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectUnitRow}
                            selectedRow={selectedUnitRow}
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

export default DataInputManagement;
