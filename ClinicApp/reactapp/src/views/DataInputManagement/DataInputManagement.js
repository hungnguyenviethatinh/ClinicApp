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
import { DeleteConfirm } from '../../components/DeleteConfirm';
import { ActionOption } from '../../components/ActionOption';

import {
    ExpiredSessionMsg,
    NotFoundMsg,
} from '../../constants';
import Axios, {
    axiosRequestConfig,
} from '../../common';
import {
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

    const [disabled, setDisabled] = React.useState(false);

    // [Start] Diagnosis handle
    const [loadingDiagnosisDone, setLoadingDiagnosisDone] = React.useState(false);

    const diagnosisTableRef = React.useRef(null);
    const refreshDiagnosisData = () => {
        diagnosisTableRef.current && diagnosisTableRef.current.onQueryChange();
    };

    const [updateDiagnosisMode, setUpdateDiagnosisMode] = React.useState(false);
    const [selectedDiagnosisRow, setSelectedDiagnosisRow] = React.useState(null);
    const handleSelectDiagnosisRow = (event, rowData) => {
        if (!selectedDiagnosisRow || selectedDiagnosisRow.tableData.id !== rowData.tableData.id) {
            setSelectedDiagnosisRow(rowData);
            setOpenDiagnosisActionOption(true);
        } else {
            setSelectedDiagnosisRow(null);
            setUpdateDiagnosisMode(false);
            handleDiagnosisReset();
        }
    };

    const [openDiagnosis, setOpenDiagnosis] = React.useState(false);
    const [openDiagnosisActionOption, setOpenDiagnosisActionOption] = React.useState(false);
    const onOpenDiagnosis = () => {
        setOpenDiagnosisActionOption(false);
        setOpenDiagnosis(true);
    };
    const handleCloseDiagnosis = () => {
        setSelectedDiagnosisRow(null);
        setOpenDiagnosis(false);
    };
    const handleCloseDiagnosisActionOption = () => {
        setSelectedDiagnosisRow(null);
        setOpenDiagnosisActionOption(false);
    };

    const [diagnosisName, setDiagnosisName] = React.useState('');
    const handleDiagnosisNameChange = event => {
        setDiagnosisName(event.target.value);
    };
    const handleDiagnosisKeyPress = event => {
        if (event.key === 'Enter') {
            handleDiagnosisDone();
        }
    };

    const handleDiagnosisDone = () => {
        if (!diagnosisName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên chẩn đoán!');
            return;
        }

        setDisabled(true);
        setLoadingDiagnosisDone(true);

        const diagnosisModel = {
            Name: diagnosisName.trim(),
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
        setDisabled(true);
        deleteDiagnosis(id);
        setOpenDiagnosis(false);
    };

    const handleDiagnosisUpdate = () => {
        const { id } = selectedDiagnosisRow;
        getDiagnosis(id);
        setUpdateDiagnosisMode(true);
        setOpenDiagnosisActionOption(false);
    };

    const handleDiagnosisReset = () => {
        setDiagnosisName('');
    };

    const getDiagnoses = (resolve, reject, query) => {
        setDisabled(true);
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
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getDiagnosesLogMsfHeader);
            setDisabled(false);
        });
    };

    const getDiagnosis = (id) => {
        setDisabled(true);
        Axios.get(`${GetDiagnosisUrl}/${id}`, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { name } = data[0];
                setDiagnosisName(name);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getDiagnosisLogMsfHeader);
            setDisabled(false);
        });
    };

    const addDiagnosis = (diagnosisModel) => {
        Axios.post(AddDiagnosisUrl, diagnosisModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm chẩn đoán thành công!');
                handleDiagnosisReset();
                refreshDiagnosisData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi thêm chẩn đoán!');
            }
            setDisabled(false);
            setLoadingDiagnosisDone(false);
        }).catch((reason) => {
            handleError(reason, addDiagnosisLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi thêm chẩn đoán!');
            setDisabled(false);
            setLoadingDiagnosisDone(false);
        });
    };

    const updateDiagnosis = (id, diagnosisModel) => {
        Axios.put(`${UpdateDiagnosisUrl}/${id}`, diagnosisModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật chẩn đoán thành công!');
                refreshDiagnosisData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật chẩn đoán!');
            }
            setDisabled(false);
            setLoadingDiagnosisDone(false);
        }).catch((reason) => {
            handleError(reason, updateDiagnosisLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật chẩn đoán!');
            setDisabled(false);
            setLoadingDiagnosisDone(false);
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
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa chẩn đoán!');
            }
            setDisabled(false);
            // setLoadingDiagnosisDelete(false);
        }).catch((reason) => {
            handleError(reason, deleteDiagnosisLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa chẩn đoán!');
            setDisabled(false);
            // setLoadingDiagnosisDelete(false);
        });
    };

    // [End] Diagnosis handle.

    // [Start] Unit handle    
    // const [loadingUnitDelete, setLoadingUnitDelete] = React.useState(false);
    const [loadingUnitDone, setLoadingUnitDone] = React.useState(false);

    const unitTableRef = React.useRef(null);
    const refreshUnitData = () => {
        unitTableRef.current && unitTableRef.current.onQueryChange();
    };

    const [updateUnitMode, setUpdateUnitMode] = React.useState(false);
    const [selectedUnitRow, setSelectedUnitRow] = React.useState(null);
    const handleSelectUnitRow = (event, rowData) => {
        if (!selectedUnitRow || selectedUnitRow.tableData.id !== rowData.tableData.id) {
            setSelectedUnitRow(rowData);
            setOpenUnitActionOption(true);
        } else {
            setSelectedUnitRow(null);
            setUpdateUnitMode(false);
            handleUnitReset();
        }
    };

    const [openUnit, setOpenUnit] = React.useState(false);
    const [openUnitActionOption, setOpenUnitActionOption] = React.useState(false);
    const onOpenUnit = () => {
        setOpenUnitActionOption(false);
        setOpenUnit(true);
    };
    const handleCloseUnit = () => {
        setSelectedUnitRow(null);
        setOpenUnit(false);
    };
    const handleCloseUnitActionOption = () => {
        setSelectedUnitRow(null);
        setOpenUnitActionOption(false);
    };

    const [unitName, setUnitName] = React.useState('');
    const handleUnitNameChange = event => {
        setUnitName(event.target.value);
    };
    const handleUnitKeyPress = event => {
        if (event.key === 'Enter') {
            handleUnitDone();
        }
    };

    const handleUnitDone = () => {
        if (!unitName.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập tên đơn vị của thuốc!');
            return;
        }

        setDisabled(true);
        setLoadingUnitDone(true);

        const unitModel = {
            Name: unitName.trim(),
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
        setDisabled(true);
        deleteUnit(id);
        setOpenUnit(false);
    };

    const handleUnitUpdate = () => {
        const { id } = selectedUnitRow;
        getUnit(id);
        setUpdateUnitMode(true);
        setOpenUnitActionOption(false);
    };

    const handleUnitReset = () => {
        setUnitName('');
    };

    const getUnits = (resolve, reject, query) => {
        setDisabled(true);
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
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getUnitsLogMsfHeader);
            setDisabled(false);
        });
    };

    const getUnit = (id) => {
        setDisabled(true);
        Axios.get(`${GetUnitUrl}/${id}`, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { name } = data[0];
                setUnitName(name);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getUnitLogMsfHeader);
            setDisabled(false);
        });
    };

    const addUnit = (unitModel) => {
        Axios.post(AddUnitUrl, unitModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm tên đơn vị của thuốc thành công!');
                handleUnitReset();
                refreshUnitData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi thêm tên đơn vị của thuốc!');
            }
            setDisabled(false);
            setLoadingUnitDone(false);
        }).catch((reason) => {
            handleError(reason, addUnitLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi thêm tên đơn vị của thuốc!');
            setDisabled(false);
            setLoadingUnitDone(false);
        });
    };

    const updateUnit = (id, unitModel) => {
        Axios.put(`${UpdateUnitUrl}/${id}`, unitModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật tên đơn vị của thuốc thành công!');
                refreshUnitData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật tên đơn vị của thuốc!');
            }
            setDisabled(false);
            setLoadingUnitDone(false);
        }).catch((reason) => {
            handleError(reason, updateUnitLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật tên đơn vị của thuốc!');
            setDisabled(false);
            setLoadingUnitDone(false);
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
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa tên đơn vị của thuốc!');
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, deleteUnitLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa tên đơn vị của thuốc!');
            setDisabled(false);
        });
    };

    // [End] Unit handle.

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
                                children="BIỂU MẪU THÊM/SỬA CHẨN ĐOÁN BỆNH"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="DiagnosisName"
                                        label="Tên chẩn đoán"
                                        value={diagnosisName}
                                        onChange={handleDiagnosisNameChange}
                                        onKeyPress={handleDiagnosisKeyPress}
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
                                        color="warning"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleDiagnosisReset}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        loading={loadingDiagnosisDone}
                                        color="success"
                                        children={selectedDiagnosisRow ? 'Lưu' : 'Hoàn tất'}
                                        iconName={selectedDiagnosisRow ? 'save' : 'done'}
                                        onClick={handleDiagnosisDone}
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
                                children="BIỂU MẪU THÊM/SỬA ĐƠN VỊ THUỐC"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        id="UnitName"
                                        label="Tên đơn vị"
                                        value={unitName}
                                        onChange={handleUnitNameChange}
                                        onKeyPress={handleUnitKeyPress}
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
                                        color="warning"
                                        children="Đặt lại"
                                        iconName="reset"
                                        onClick={handleUnitReset}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        loading={loadingUnitDone}
                                        color="success"
                                        children={selectedUnitRow ? 'Lưu' : 'Hoàn tất'}
                                        iconName={selectedUnitRow ? 'save' : 'done'}
                                        onClick={handleUnitDone}
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
            <DeleteConfirm
                open={openDiagnosis}
                handleClose={handleCloseDiagnosis}
                handleDelete={handleDiagnosisDelete}
            />
            <DeleteConfirm
                open={openUnit}
                handleClose={handleCloseUnit}
                handleDelete={handleUnitDelete}
            />
            <ActionOption
                open={openDiagnosisActionOption}
                handleUpdate={handleDiagnosisUpdate}
                handleDelete={onOpenDiagnosis}
                handleClose={handleCloseDiagnosisActionOption}
            />
            <ActionOption
                open={openUnitActionOption}
                handleUpdate={handleUnitUpdate}
                handleDelete={onOpenUnit}
                handleClose={handleCloseUnitActionOption}
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

export default DataInputManagement;
