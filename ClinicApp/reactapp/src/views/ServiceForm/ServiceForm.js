import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
} from '@material-ui/core';

import clsx from 'clsx';
import moment from 'moment';

import { Table } from '../../components/Table';
import { Status } from '../../components/Status';
import { Snackbar } from '../../components/Snackbar';
import { AddButton } from '../../components/Button';
import { ActionOption } from '../../components/ActionOption';
import { DeleteConfirm } from '../../components/DeleteConfirm';

import {
    GetDoctorCtFormsUrl,
    GetDoctorMriFormsUrl,
    GetDoctorTestFormsUrl,
    GetDoctorXqFormsUrl,
    DeleteCtFormUrl,
    DeleteMriFormUrl,
    DeleteTestFormUrl,
    DeleteXqFormUrl,
} from '../../config';
import Axios, {
    axiosRequestConfig,
} from '../../common';
import {
    ExpiredSessionMsg,
    PrescriptionStatus,
    RouteConstants,
    FormMode,
    DisplayDateFormat,
} from '../../constants';

const useStyles = makeStyles(theme => ({
    card: {},
    content: {
        padding: theme.spacing(0),
    },
    action: {
        marginRight: 0,
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
    fullHeight: {
        height: '100%',
    }
}));

const renderPatient = (rowData) => (
    <Link
        to={`${RouteConstants.PatientDetailView.replace(':id', rowData.patientId)}`}
        children={`${rowData.patient.fullName}`}
    />);

const renderStatus = (rowData) => {
    const status = [
        PrescriptionStatus.IsNew,
        PrescriptionStatus.IsPending,
        PrescriptionStatus.IsPrinted][rowData.status]
    return <Status status={status} />
};

const ctFormColumns = [
    {
        title: 'Ngày kê đơn', field: 'dateCreated', type: 'date',
        render: rowData => moment(rowData.dateCreated).format(DisplayDateFormat),
    },
    {
        title: 'Mã đơn', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.CtFormView.replace(':mode', FormMode.View).replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bệnh nhân', field: 'patientId',
        render: rowData => renderPatient(rowData),
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => renderStatus(rowData),
    },
];

const mriFormColumns = [
    {
        title: 'Ngày kê đơn', field: 'dateCreated', type: 'date',
        render: rowData => moment(rowData.dateCreated).format(DisplayDateFormat),
    },
    {
        title: 'Mã đơn', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.MriFormView.replace(':mode', FormMode.View).replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bệnh nhân', field: 'patientId',
        render: rowData => renderPatient(rowData),
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => renderStatus(rowData),
    },
];

const testFormColumns = [
    {
        title: 'Ngày kê đơn', field: 'dateCreated', type: 'date',
        render: rowData => moment(rowData.dateCreated).format(DisplayDateFormat),
    },
    {
        title: 'Mã đơn', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.TestFormView.replace(':mode', FormMode.View).replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bệnh nhân', field: 'patientId',
        render: rowData => renderPatient(rowData),
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => renderStatus(rowData),
    },
];

const xqFormColumns = [
    {
        title: 'Ngày kê đơn', field: 'dateCreated', type: 'date',
        render: rowData => moment(rowData.dateCreated).format(DisplayDateFormat),
    },
    {
        title: 'Mã đơn', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.XqFormView.replace(':mode', FormMode.View).replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bệnh nhân', field: 'patientId',
        render: rowData => renderPatient(rowData),
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => renderStatus(rowData),
    },
];

const getCtFormsLogMsgHeader = '[Get CtForms Error]';
const getMriFormsLogMsgHeader = '[Get MriForms Error]';
const getTestFormsLogMsgHeader = '[Get TestForms Error]';
const getXqFormsLogMsgHeader = '[Get XqForms Error]';
const deleteCtFormsLogMsgHeader = '[Delete CtForm Error]';
const deleteMriFormsLogMsgHeader = '[Delete MriForm Error]';
const deleteTestFormsLogMsgHeader = '[Delete TestForm Error]';
const deleteXqFormsLogMsgHeader = '[Delete XqForm Error]';

const ServiceForm = () => {
    const classes = useStyles();
    const browserHistory = useHistory();
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
            }
        }
        console.log(`${logMsgHeader}`, reason);
    };

    const ctFormTableRef = React.useRef(null);
    const mriFormTableRef = React.useRef(null);
    const testFormTableRef = React.useRef(null);
    const xqFormTableRef = React.useRef(null);

    const refreshCtFormData = () => {
        ctFormTableRef.current && ctFormTableRef.current.onQueryChange();
    };
    const refreshMriFormData = () => {
        mriFormTableRef.current && mriFormTableRef.current.onQueryChange();
    };
    const refreshTestFormData = () => {
        testFormTableRef.current && testFormTableRef.current.onQueryChange();
    };
    const refreshXqFormData = () => {
        xqFormTableRef.current && xqFormTableRef.current.onQueryChange();
    };

    const [openCtDeleteConfirm, setOpenCtDeleteConfirm] = React.useState(false);
    const [openCtActionOption, setOpenCtActionOption] = React.useState(false);
    const onOpenCtDeleteConfirm = () => {
        setOpenCtActionOption(false);
        setOpenCtDeleteConfirm(true);
    };
    const handleCloseCtDeleteConfirm = () => {
        setSelectedCtRow(null);
        setOpenCtDeleteConfirm(false);
    };
    const handleCloseCtActionOption = () => {
        setSelectedCtRow(null);
        setOpenCtActionOption(false);
    };

    const [openMriDeleteConfirm, setOpenMriDeleteConfirm] = React.useState(false);
    const [openMriActionOption, setOpenMriActionOption] = React.useState(false);
    const onOpenMriDeleteConfirm = () => {
        setOpenMriActionOption(false);
        setOpenMriDeleteConfirm(true);
    };
    const handleCloseMriDeleteConfirm = () => {
        setSelectedMriRow(null);
        setOpenMriDeleteConfirm(false);
    };
    const handleCloseMriActionOption = () => {
        setSelectedMriRow(null);
        setOpenMriActionOption(false);
    };

    const [openTestDeleteConfirm, setOpenTestDeleteConfirm] = React.useState(false);
    const [openTestActionOption, setOpenTestActionOption] = React.useState(false);
    const onOpenTestDeleteConfirm = () => {
        setOpenTestActionOption(false);
        setOpenTestDeleteConfirm(true);
    };
    const handleCloseTestDeleteConfirm = () => {
        setSelectedTestRow(null);
        setOpenTestDeleteConfirm(false);
    };
    const handleCloseTestActionOption = () => {
        setSelectedTestRow(null);
        setOpenTestActionOption(false);
    };

    const [openXqDeleteConfirm, setOpenXqDeleteConfirm] = React.useState(false);
    const [openXqActionOption, setOpenXqActionOption] = React.useState(false);
    const onOpenXqDeleteConfirm = () => {
        setOpenXqActionOption(false);
        setOpenXqDeleteConfirm(true);
    };
    const handleCloseXqDeleteConfirm = () => {
        setSelectedXqRow(null);
        setOpenXqDeleteConfirm(false);
    };
    const handleCloseXqActionOption = () => {
        setSelectedXqRow(null);
        setOpenXqActionOption(false);
    };

    const [selectedCtRow, setSelectedCtRow] = React.useState(null);
    const handleCtDelete = () => {
        const { id } = selectedCtRow;
        deleteCtForm(id);
        setOpenCtDeleteConfirm(false);
    };
    const handleCtUpdate = () => {
        const { id } = selectedCtRow;
        const redirectUrl = RouteConstants.CtFormView.replace(':mode', FormMode.Update).replace(':id', id);
        setOpenCtActionOption(false);
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };
    const handleCtAdd = () => {
        const redirectUrl = RouteConstants.CtFormView.replace(':mode', FormMode.Add).replace(':id', 'new');
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };
    const handleSelectCtRow = (event, rowData) => {
        if (!selectedCtRow || selectedCtRow.tableData.id !== rowData.tableData.id) {
            setSelectedCtRow(rowData);
            setOpenCtActionOption(true);
        } else {
            setSelectedCtRow(null);
        }
    };

    const [selectedMriRow, setSelectedMriRow] = React.useState(null);
    const handleMriDelete = () => {
        const { id } = selectedMriRow;
        deleteMriForm(id);
        setOpenMriDeleteConfirm(false);
    };
    const handleMriUpdate = () => {
        const { id } = selectedMriRow;
        const redirectUrl = RouteConstants.MriFormView.replace(':mode', FormMode.Update).replace(':id', id);
        setOpenMriActionOption(false);
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };
    const handleMriAdd = () => {
        const redirectUrl = RouteConstants.MriFormView.replace(':mode', FormMode.Add).replace(':id', 'new');
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };
    const handleSelectMriRow = (event, rowData) => {
        if (!selectedMriRow || selectedMriRow.tableData.id !== rowData.tableData.id) {
            setSelectedMriRow(rowData);
            setOpenMriActionOption(true);
        } else {
            setSelectedMriRow(null);
        }
    };

    const [selectedTestRow, setSelectedTestRow] = React.useState(null);
    const handleTestDelete = () => {
        const { id } = selectedTestRow;
        deleteTestForm(id);
        setOpenTestDeleteConfirm(false);
    };
    const handleTestUpdate = () => {
        const { id } = selectedTestRow;
        const redirectUrl = RouteConstants.TestFormView.replace(':mode', FormMode.Update).replace(':id', id);
        setOpenTestActionOption(false);
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };
    const handleTestAdd = () => {
        const redirectUrl = RouteConstants.TestFormView.replace(':mode', FormMode.Add).replace(':id', 'new');
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };
    const handleSelectTestRow = (event, rowData) => {
        if (!selectedTestRow || selectedTestRow.tableData.id !== rowData.tableData.id) {
            setSelectedTestRow(rowData);
            setOpenTestActionOption(true);
        } else {
            setSelectedTestRow(null);
        }
    };

    const [selectedXqRow, setSelectedXqRow] = React.useState(null);
    const handleXqDelete = () => {
        const { id } = selectedXqRow;
        deleteXqForm(id);
        setOpenXqDeleteConfirm(false);
    };
    const handleXqUpdate = () => {
        const { id } = selectedXqRow;
        const redirectUrl = RouteConstants.XqFormView.replace(':mode', FormMode.Update).replace(':id', id);
        setOpenXqActionOption(false);
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };
    const handleXqAdd = () => {
        const redirectUrl = RouteConstants.XqFormView.replace(':mode', FormMode.Add).replace(':id', 'new');
        setTimeout(() => {
            browserHistory.push(redirectUrl);
        }, 1000);
    };
    const handleSelectXqRow = (event, rowData) => {
        if (!selectedXqRow || selectedXqRow.tableData.id !== rowData.tableData.id) {
            setSelectedXqRow(rowData);
            setOpenXqActionOption(true);
        } else {
            setSelectedXqRow(null);
        }
    };

    const getCtForms = (resolve, reject, query) => {
        Axios.get(GetDoctorCtFormsUrl, config).then((response) => {
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
            handleError(reason, getCtFormsLogMsgHeader);
        });
    };

    const getMriForms = (resolve, reject, query) => {
        Axios.get(GetDoctorMriFormsUrl, config).then((response) => {
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
            handleError(reason, getMriFormsLogMsgHeader);
        });
    };

    const getTestForms = (resolve, reject, query) => {
        Axios.get(GetDoctorTestFormsUrl, config).then((response) => {
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
            handleError(reason, getTestFormsLogMsgHeader);
        });
    };

    const getXqForms = (resolve, reject, query) => {
        Axios.get(GetDoctorXqFormsUrl, config).then((response) => {
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
            handleError(reason, getXqFormsLogMsgHeader);
        });
    };

    const deleteCtForm = (id) => {
        const url = `${DeleteCtFormUrl}/${id}`;
        Axios.delete(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa đơn chỉ định thành công!');
                setSelectedCtRow(null);
                refreshCtFormData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa đơn chỉ định. Vui lòng thử lại sau!');
                handleError(response, deleteCtFormsLogMsgHeader);
            }
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi xóa đơn chỉ định. Vui lòng thử lại sau!');
            handleError(reason, deleteCtFormsLogMsgHeader);
        });
    };

    const deleteMriForm = (id) => {
        const url = `${DeleteMriFormUrl}/${id}`;
        Axios.delete(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa đơn chỉ định thành công!');
                setSelectedMriRow(null);
                refreshMriFormData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa đơn chỉ định. Vui lòng thử lại sau!');
                handleError(response, deleteMriFormsLogMsgHeader);
            }
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi xóa đơn chỉ định. Vui lòng thử lại sau!');
            handleError(reason, deleteMriFormsLogMsgHeader);
        });
    };

    const deleteTestForm = (id) => {
        const url = `${DeleteTestFormUrl}/${id}`;
        Axios.delete(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa đơn chỉ định thành công!');
                setSelectedTestRow(null);
                refreshTestFormData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa đơn chỉ định. Vui lòng thử lại sau!');
                handleError(response, deleteTestFormsLogMsgHeader);
            }
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi xóa đơn chỉ định. Vui lòng thử lại sau!');
            handleError(reason, deleteTestFormsLogMsgHeader);
        });
    };

    const deleteXqForm = (id) => {
        const url = `${DeleteXqFormUrl}/${id}`;
        Axios.delete(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa đơn chỉ định thành công!');
                setSelectedXqRow(null);
                refreshXqFormData();
            } else {
                handleSnackbarOption('error', 'Có lỗi khi xóa đơn chỉ định. Vui lòng thử lại sau!');
                handleError(response, deleteXqFormsLogMsgHeader);
            }
        }).catch((reason) => {
            handleSnackbarOption('error', 'Có lỗi khi xóa đơn chỉ định. Vui lòng thử lại sau!');
            handleError(reason, deleteXqFormsLogMsgHeader);
        });
    };

    return (
        <Grid
            container
            spacing={3}
            className={classes.fullHeight} >
            <Grid
                item
                xs={12} sm={12} md={6} lg={6} xl={6}
            >
                <Card
                    className={clsx(classes.card, classes.fullHeight)}
                >
                    <CardHeader
                        classes={{
                            action: classes.action,
                        }}
                        action={
                            <AddButton onClick={handleCtAdd} />
                        }
                        title="PHIẾU CHỈ ĐỊNH CHỤP CT"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={ctFormTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={ctFormColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getCtForms(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectCtRow}
                            selectedRow={selectedCtRow}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                item
                xs={12} sm={12} md={6} lg={6} xl={6}
            >
                <Card
                    className={clsx(classes.card, classes.fullHeight)}
                >
                    <CardHeader
                        classes={{
                            action: classes.action,
                        }}
                        action={
                            <AddButton onClick={handleMriAdd} />
                        }
                        title="PHIẾU CHỈ ĐỊNH CHỤP CỘNG HƯỞNG TỪ (MRI)"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={mriFormTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={mriFormColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getMriForms(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectMriRow}
                            selectedRow={selectedMriRow}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                item
                xs={12} sm={12} md={6} lg={6} xl={6}
            >
                <Card
                    className={clsx(classes.card, classes.fullHeight)}
                >
                    <CardHeader
                        classes={{
                            action: classes.action,
                        }}
                        action={
                            <AddButton onClick={handleTestAdd} />
                        }
                        title="PHIẾU YÊU CẦU XÉT NGHIỆM"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={testFormTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={testFormColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getTestForms(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectTestRow}
                            selectedRow={selectedTestRow}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                item
                xs={12} sm={12} md={6} lg={6} xl={6}
            >
                <Card
                    className={clsx(classes.card, classes.fullHeight)}
                >
                    <CardHeader
                        classes={{
                            action: classes.action,
                        }}
                        action={
                            <AddButton onClick={handleXqAdd} />
                        }
                        title="PHIẾU CHỈ ĐỊNH CHẨN ĐOÁN HÌNH ẢNH"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={xqFormTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={xqFormColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getXqForms(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectXqRow}
                            selectedRow={selectedXqRow}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <DeleteConfirm
                open={openCtDeleteConfirm}
                handleClose={handleCloseCtDeleteConfirm}
                handleDelete={handleCtDelete}
            />
            <ActionOption
                open={openCtActionOption}
                handleUpdate={handleCtUpdate}
                handleDelete={onOpenCtDeleteConfirm}
                handleClose={handleCloseCtActionOption}
            />
            <DeleteConfirm
                open={openMriDeleteConfirm}
                handleClose={handleCloseMriDeleteConfirm}
                handleDelete={handleMriDelete}
            />
            <ActionOption
                open={openMriActionOption}
                handleUpdate={handleMriUpdate}
                handleDelete={onOpenMriDeleteConfirm}
                handleClose={handleCloseMriActionOption}
            />
            <DeleteConfirm
                open={openTestDeleteConfirm}
                handleClose={handleCloseTestDeleteConfirm}
                handleDelete={handleTestDelete}
            />
            <ActionOption
                open={openTestActionOption}
                handleUpdate={handleTestUpdate}
                handleDelete={onOpenTestDeleteConfirm}
                handleClose={handleCloseTestActionOption}
            />
            <DeleteConfirm
                open={openXqDeleteConfirm}
                handleClose={handleCloseXqDeleteConfirm}
                handleDelete={handleXqDelete}
            />
            <ActionOption
                open={openXqActionOption}
                handleUpdate={handleXqUpdate}
                handleDelete={onOpenXqDeleteConfirm}
                handleClose={handleCloseXqActionOption}
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

export default ServiceForm;
