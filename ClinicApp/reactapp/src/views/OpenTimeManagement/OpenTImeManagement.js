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
    ExpiredSessionMsg
} from '../../constants';
import Axios, {
    axiosRequestConfig,
} from '../../common';
import {
    GetOpenTimesUrl,
    GetOpenTimeUrl,
    AddOpenTimeUrl,
    UpdateOpenTimeUrl,
    DeleteOpenTimeUrl,
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

const openTimeColumns = [
    {
        title: 'STT', field: 'id',
    },
    {
        title: 'Thời gian khám/nghỉ', field: 'openClosedTime',
    },
];

const getOpenTimesLogMsfHeader = '[Get OpenTimes Error]';
const getOpenTimeLogMsfHeader = '[Get OpenTime Error]';
const addOpenTimeLogMsfHeader = '[Add OpenTime Error]';
const updateOpenTimeLogMsfHeader = '[Update OpenTime Error]';
const deleteOpenTimeLogMsfHeader = '[Delete OpenTime Error]';

const OpenTimeManagement = () => {
    // [Start] Common
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

    // [End] Common.

    // [Start] State declaration and event handlers
    const [disabled, setDisabled] = React.useState(false);
    const [loadingOpenTimeDone, setLoadingOpenTimeDone] = React.useState(false);

    const openTimeTableRef = React.useRef(null);
    const refreshOpenTimeData = () => {
        openTimeTableRef.current && openTimeTableRef.current.onQueryChange();
    };

    const [updateOpenTimeMode, setUpdateOpenTimeMode] = React.useState(false);
    const [selectedOpenTimeRow, setSelectedOpenTimeRow] = React.useState(null);
    const handleSelectOpenTimeRow = (event, rowData) => {
        if (!selectedOpenTimeRow || selectedOpenTimeRow.tableData.id !== rowData.tableData.id) {
            setSelectedOpenTimeRow(rowData);
            setOpenActionOption(true);
        } else {
            setSelectedOpenTimeRow(null);
            setUpdateOpenTimeMode(false);
            handleOpenTimeReset();
        }
    };

    const [openOpenTime, setOpenOpenTime] = React.useState(false);
    const [openActionOption, setOpenActionOption] = React.useState(false);
    const onOpenOpenTime = () => {
        setOpenActionOption(false);
        setOpenOpenTime(true);
    };
    const handleCloseOpenTime = () => {
        setSelectedOpenTimeRow(null);
        setOpenOpenTime(false);
    };
    const handleCloseActionOption = () => {
        setSelectedOpenTimeRow(null);
        setOpenActionOption(false);
    };

    const [openTimeValue, setOpenTimeValue] = React.useState('');
    const handleOpenTimeChange = event => {
        setOpenTimeValue(event.target.value);
    };
    const handleOpenTimeKeyPress = event => {
        if (event.key === 'Enter') {
            handleOpenTimeDone();
        }
    };

    const handleOpenTimeDone = () => {
        if (!openTimeValue.trim()) {
            handleSnackbarOption('error', 'Yêu cầu nhập ngày khám/nghỉ!');
            return;
        }

        setDisabled(true);
        setLoadingOpenTimeDone(true);

        const openTimeModel = {
            OpenClosedTime: openTimeValue.trim(),
        };
        if (!updateOpenTimeMode) {
            addOpenTime(openTimeModel);
        } else {
            const { id } = selectedOpenTimeRow;
            updateOpenTime(id, openTimeModel);
        }
    };

    const handleOpenTimeUpdate = () => {
        const { id } = selectedOpenTimeRow;
        getOpenTime(id);
        setUpdateOpenTimeMode(true);
        setOpenActionOption(false);
    };

    const handleOpenTimeDelete = () => {
        const { id } = selectedOpenTimeRow;
        setDisabled(true);
        deleteOpenTime(id);
        setOpenOpenTime(false);
    };

    const handleOpenTimeReset = () => {
        setOpenTimeValue('');
    };

    // [End] State declaration and event handlers.

    // [Start] Api handlers
    const getOpenTimes = (resolve, reject, query) => {
        setDisabled(true);
        Axios.get(GetOpenTimesUrl, config).then((response) => {
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
            handleError(reason, getOpenTimesLogMsfHeader);
            setDisabled(false);
        });
    };

    const getOpenTime = (id) => {
        setDisabled(true);
        Axios.get(`${GetOpenTimeUrl}/${id}`, config).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { openClosedTime } = data[0];
                setOpenTimeValue(openClosedTime);
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, getOpenTimeLogMsfHeader);
            setDisabled(false);
        });
    };

    const addOpenTime = (openTimeModel) => {
        Axios.post(AddOpenTimeUrl, openTimeModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Thêm thành công!');
                handleOpenTimeReset();
                refreshOpenTimeData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi thêm dữ liệu!');
            }
            setDisabled(false);
            setLoadingOpenTimeDone(false);
        }).catch((reason) => {
            handleError(reason, addOpenTimeLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi thêm dữ liệu!');
            setDisabled(false);
            setLoadingOpenTimeDone(false);
        });
    };

    const updateOpenTime = (id, openTimeModel) => {
        Axios.put(`${UpdateOpenTimeUrl}/${id}`, openTimeModel, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Cập nhật thành công!');
                refreshOpenTimeData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi cập nhật dữ liệu!');
            }
            setDisabled(false);
            setLoadingOpenTimeDone(false);
        }).catch((reason) => {
            handleError(reason, updateOpenTimeLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi cập nhật dữ liệu!');
            setDisabled(false);
            setLoadingOpenTimeDone(false);
        });
    };

    const deleteOpenTime = (id) => {
        Axios.delete(`${DeleteOpenTimeUrl}/${id}`, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa thành công!');
                handleOpenTimeReset();
                setSelectedOpenTimeRow(null);
                setUpdateOpenTimeMode(false);
                refreshOpenTimeData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa dữ liệu!');
            }
            setDisabled(false);
        }).catch((reason) => {
            handleError(reason, deleteOpenTimeLogMsfHeader);
            handleSnackbarOption('error', 'Có lỗi khi xóa dữ liệu!');
            setDisabled(false);
        });
    };

    // [End] Api handlers.

    return (
        <Grid container spacing={3} >
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <Card
                    className={classes.card}
                    style={{ height: '100%' }}
                >
                    <CardHeader
                        title="QUẢN LÝ THỜI GIAN KHÁM CHỮA BỆNH"
                        subheader="Thêm, cập nhật thời gian khám nghỉ tại đây"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography
                                variant="caption"
                                component="p"
                                children="BIỂU MẪU THÊM/SỬA THỜI GIAN KHÁM/NGHỈ"
                            />
                            <Grid container spacing={2} style={{ marginBottom: 8 }} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="OpenTimeValue"
                                        label="Nhập thời gian khám/nghỉ"
                                        value={openTimeValue}
                                        onChange={handleOpenTimeChange}
                                        onKeyPress={handleOpenTimeKeyPress}
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
                                        onClick={handleOpenTimeReset}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Button
                                        fullWidth
                                        disabled={disabled}
                                        loading={loadingOpenTimeDone}
                                        color="success"
                                        children={selectedOpenTimeRow ? 'Lưu' : 'Hoàn tất'}
                                        iconName={selectedOpenTimeRow ? 'save' : 'done'}
                                        onClick={handleOpenTimeDone}
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
                        title="THỜI GIAN KHÁM/NGHỈ"
                        subheader="Thời gian khám nghỉ đã có dữ liệu trên hệ thống"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={openTimeTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={openTimeColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getOpenTimes(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectOpenTimeRow}
                            selectedRow={selectedOpenTimeRow}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <DeleteConfirm
                open={openOpenTime}
                handleClose={handleCloseOpenTime}
                handleDelete={handleOpenTimeDelete}
            />
            <ActionOption
                open={openActionOption}
                handleUpdate={handleOpenTimeUpdate}
                handleDelete={onOpenOpenTime}
                handleClose={handleCloseActionOption}
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

export default OpenTimeManagement;
