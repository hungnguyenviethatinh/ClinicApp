import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Typography,
} from '@material-ui/core';

import clsx from 'clsx';
import moment from 'moment';
import _ from 'lodash';

import { Table } from '../../../components/Table';
import { Status } from '../../../components/Status';
import { Snackbar } from '../../../components/Snackbar';
import { RefreshButton } from '../../../components/Button';
import { ActionOption } from '../../../components/ActionOption';
import { DeleteConfirm } from '../../../components/DeleteConfirm';
import { PrintConfirmDialog } from '../../../components/PrintDialog';

import {
    GetPatientInQueueUrl,
    GetPrescriptionsInQueueUrl,
    DeletePatientUrl,
    GetCtFormsUrl,
    GetMriFormsUrl,
    GetTestFormsUrl,
    GetXqFormsUrl,
} from '../../../config';
import Axios, {
    axiosRequestConfig,
} from '../../../common';
import {
    ExpiredSessionMsg,
    Gender,
    PatientStatus,
    PrescriptionStatus,
    RouteConstants,
    DisplayDateFormat,
} from '../../../constants';

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
        height: 'auto',
    }
}));

const patientQueueColumns = [
    {
        title: 'STT', field: 'orderNumber', type: 'numeric',
    },
    {
        title: 'Ngày khám', field: 'checkedDate', type: 'date',
        render: rowData => {
            if (rowData.appointmentDate) {
                return moment(rowData.appointmentDate).format(DisplayDateFormat);
            }

            if (rowData.checkedDate) {
                return moment(rowData.checkedDate).format(DisplayDateFormat);
            }

            return moment().format(DisplayDateFormat);
        },
    },
    {
        title: 'Mã BN', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.PatientDetailView.replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`}
            />,
    },
    {
        title: 'Họ & Tên', field: 'fullName',
    },
    {
        title: 'Tuổi', field: 'age', type: 'numeric',
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
    },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => {
            let status = [
                PatientStatus.IsNew,
                PatientStatus.IsAppointed,
                PatientStatus.IsChecking,
                PatientStatus.IsChecked,
                PatientStatus.IsRechecking,
                PatientStatus.IsToAddDocs][rowData.status];
            if (moment(rowData.appointmentDate).isValid()) {
                if (status !== PatientStatus.IsChecking) {
                    status = PatientStatus.IsAppointed;
                }
            }
            return <Status status={status} />
        },
    },
];

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

const prescriptionColumns = [
    {
        title: 'Mã Đơn Thuốc', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.PrescriptionDetailView.replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`}
            />,
    },
    {
        title: 'Bác sĩ kê đơn', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
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

const ctFormColumns = [
    {
        title: 'Mã đơn', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.CtFormView.replace(':mode', FormMode.View).replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bác sĩ kê đơn', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
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
        title: 'Mã đơn', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.MriFormView.replace(':mode', FormMode.View).replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bác sĩ kê đơn', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
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
        title: 'Mã đơn', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.TestFormView.replace(':mode', FormMode.View).replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bác sĩ kê đơn', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
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
        title: 'Mã đơn', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.XqFormView.replace(':mode', FormMode.View).replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`} />,
    },
    {
        title: 'Bác sĩ kê đơn', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
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

const getPatientLogMsgHeader = '[Get Patients Error]';
const getPrescriptionLogMsgHeader = '[Get Prescriptions Error]';
const deletePatientLogMsgHeader = '[Delete Patient Response] ';
const getCtFormsLogMsgHeader = '[Get CtForms Error]';
const getMriFormsLogMsgHeader = '[Get MriForms Error]';
const getTestFormsLogMsgHeader = '[Get TestForms Error]';
const getXqFormsLogMsgHeader = '[Get XqForms Error]';
const printCtFormsLogMsgHeader = '[Print CtForm Error]';
const printMriFormsLogMsgHeader = '[Print MriForm Error]';
const printTestFormsLogMsgHeader = '[Print TestForm Error]';
const printXqFormsLogMsgHeader = '[Print XqForm Error]';

const ReceptionistView = () => {
    const classes = useStyles();
    const config = axiosRequestConfig();
    const browserHistory = useHistory();

    const patientTableRef = React.useRef(null);
    const prescriptionTableRef = React.useRef(null);

    const refreshPatientData = () => {
        patientTableRef.current && patientTableRef.current.onQueryChange();
    };
    const refreshPrescriptionData = () => {
        prescriptionTableRef.current && prescriptionTableRef.current.onQueryChange();
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
            }
        }
        console.log(`${logMsgHeader}`, reason);
    };

    const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
    const [openActionOption, setOpenActionOption] = React.useState(false);
    const onOpenDeleteConfirm = () => {
        setOpenActionOption(false);
        setOpenDeleteConfirm(true);
    };
    const handleCloseDeleteConfirm = () => {
        setSelectedRow(null);
        setOpenDeleteConfirm(false);
    };
    const handleCloseActionOption = () => {
        setSelectedRow(null);
        setOpenActionOption(false);
    };

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setOpenActionOption(true);
        } else {
            setSelectedRow(null);
        }
    };

    const handleUpdate = () => {
        const { id } = selectedRow;
        const queryParams = `?pId=${id}&hId=current`;
        const redirectUrl = RouteConstants.PatientManagementView + queryParams;
        browserHistory.push(redirectUrl);
    };

    const handleDelete = () => {
        const { id } = selectedRow;
        deletePatient(id);

        setOpenDeleteConfirm(false);
    };

    const deletePatient = (id) => {
        const url = `${DeletePatientUrl}/${id}`;
        Axios.delete(url, config).then((response) => {
            const { status } = response;
            if (status === 200) {
                handleSnackbarOption('success', 'Xóa bệnh nhân thành công.');
                refreshPatientData();
                setSelectedRow(null);
            } else {
                handleError(deletePatientLogMsgHeader, response);
                handleSnackbarOption('error', 'Có lỗi khi xóa bệnh nhân.');
            }
        }).catch((reason) => {
            handleError(deletePatientLogMsgHeader, reason);
            handleSnackbarOption('error', 'Có lỗi khi xóa bệnh nhân.');
        });
    };

    const getPatientsInQueue = (resolve, reject, query) => {
        Axios.get(GetPatientInQueueUrl, config).then((response) => {
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
            handleError(reason, getPatientLogMsgHeader);
        });
    };

    const getPrescriptionsInQueue = (resolve, reject, query) => {
        Axios.get(GetPrescriptionsInQueueUrl, config).then((response) => {
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
            handleError(reason, getPrescriptionLogMsgHeader);
        });
    };

    const getPatientDetailPanel = (rowData) => {
        return (
            <div style={{ padding: 10 }}>
                <Typography
                    variant="caption"
                    component="p"
                    children="CÁC BÁC SĨ HỘI CHUẨN KHÁM"
                />
                {
                    !_.isEmpty(rowData.doctors) &&
                    rowData.doctors.map(({ doctor }) => (
                        <Typography
                            key={doctor.id}
                            variant="h6"
                            component="h6"
                            children={`${doctor.fullName}`}
                            style={{ fontWeight: 600 }}
                        />
                    ))
                }
            </div>
        );
    };

    // Service forms handlers:
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

    const [openCtPrintConfirmDialog, setOpenCtPrintConfirmDialog] = React.useState(false);
    const handleCloseCtPrintConfirm = () => {
        setSelectedCtRow(null);
        setOpenCtPrintConfirmDialog(false);
    };
    const [selectedCtRow, setSelectedCtRow] = React.useState(null);
    const handleCtPrint = () => {

    };
    const handleSelectCtRow = (event, rowData) => {
        if (!selectedCtRow || selectedCtRow.tableData.id !== rowData.tableData.id) {
            setSelectedCtRow(rowData);
            setOpenCtPrintConfirmDialog(true);
        } else {
            setSelectedCtRow(null);
        }
    };

    const [openMriPrintConfirmDialog, setOpenMriPrintConfirmDialog] = React.useState(false);
    const handleCloseMriPrintConfirm = () => {
        setSelectedMriRow(null);
        setOpenMriPrintConfirmDialog(false);
    };
    const [selectedMriRow, setSelectedMriRow] = React.useState(null);
    const handleMriPrint = () => {

    };
    const handleSelectMriRow = (event, rowData) => {
        if (!selectedMriRow || selectedMriRow.tableData.id !== rowData.tableData.id) {
            setSelectedMriRow(rowData);
            setOpenMriPrintConfirmDialog(true);
        } else {
            setSelectedMriRow(null);
        }
    };

    const [openTestPrintConfirmDialog, setOpenTestPrintConfirmDialog] = React.useState(false);
    const handleCloseTestPrintConfirm = () => {
        setSelectedTestRow(null);
        setOpenTestPrintConfirmDialog(false);
    };
    const [selectedTestRow, setSelectedTestRow] = React.useState(null);
    const handleTestPrint = () => {

    };
    const handleSelectTestRow = (event, rowData) => {
        if (!selectedTestRow || selectedTestRow.tableData.id !== rowData.tableData.id) {
            setSelectedTestRow(rowData);
            setOpenTestPrintConfirmDialog(true);
        } else {
            setSelectedTestRow(null);
        }
    };

    const [openXqPrintConfirmDialog, setOpenXqPrintConfirmDialog] = React.useState(false);
    const handleCloseXqPrintConfirm = () => {
        setSelectedXqRow(null);
        setOpenXqPrintConfirmDialog(false);
    };
    const [selectedXqRow, setSelectedXqRow] = React.useState(null);
    const handleXqPrint = () => {

    };
    const handleSelectXqRow = (event, rowData) => {
        if (!selectedXqRow || selectedXqRow.tableData.id !== rowData.tableData.id) {
            setSelectedXqRow(rowData);
            setOpenXqPrintConfirmDialog(true);
        } else {
            setSelectedXqRow(null);
        }
    };

    const getCtForms = (resolve, reject, query) => {
        Axios.get(GetCtFormsUrl, config).then((response) => {
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
        Axios.get(GetMriFormsUrl, config).then((response) => {
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
        Axios.get(GetTestFormsUrl, config).then((response) => {
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
        Axios.get(GetXqFormsUrl, config).then((response) => {
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
    // Service forms handlers.

    return (
        <Grid
            container
            spacing={3}
            className={classes.fullHeight} >
            <Grid
                item
                xs={12} sm={12} md={12} lg={12} xl={12}
            >
                <Card
                    className={clsx(classes.card, classes.fullHeight)}
                >
                    <CardHeader
                        classes={{
                            action: classes.action,
                        }}
                        action={
                            <RefreshButton onClick={refreshPatientData} />
                        }
                        title="HÀNG CHỜ BỆNH NHÂN"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={patientTableRef}
                            detailPanel={getPatientDetailPanel}
                            customOptions={{
                                paging: false,
                            }}
                            columns={patientQueueColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPatientsInQueue(resolve, reject, query);
                                })
                            }
                            onRowClick={handleSelectRow}
                            selectedRow={selectedRow}
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid
                item
                xs={12} sm={12} md={12} lg={12} xl={12}
            >
                <Card
                    className={clsx(classes.card, classes.fullHeight)}
                >
                    <CardHeader
                        classes={{
                            action: classes.action,
                        }}
                        action={
                            <RefreshButton onClick={refreshPrescriptionData} />
                        }
                        title="DANH SÁCH ĐƠN THUỐC MỚI"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Table
                            tableRef={prescriptionTableRef}
                            customOptions={{
                                paging: false,
                            }}
                            columns={prescriptionColumns}
                            data={
                                query => new Promise((resolve, reject) => {
                                    getPrescriptionsInQueue(resolve, reject, query);
                                })
                            }
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
                            <RefreshButton onClick={refreshCtFormData} />
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
                            <RefreshButton onClick={refreshMriFormData} />
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
                            <RefreshButton onClick={refreshTestFormData} />
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
                            <RefreshButton onClick={refreshXqFormData} />
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
                open={openDeleteConfirm}
                handleClose={handleCloseDeleteConfirm}
                handleDelete={handleDelete}
            />
            <ActionOption
                open={openActionOption}
                handleUpdate={handleUpdate}
                handleDelete={onOpenDeleteConfirm}
                handleClose={handleCloseActionOption}
            />
            <PrintConfirmDialog
                open={openCtPrintConfirmDialog}
                handleClose={handleCloseCtPrintConfirm}
                handlePrint={handleCtPrint}
            />
            <PrintConfirmDialog
                open={openMriPrintConfirmDialog}
                handleClose={handleCloseMriPrintConfirm}
                handlePrint={handleMriPrint}
            />
            <PrintConfirmDialog
                open={openTestPrintConfirmDialog}
                handleClose={handleCloseTestPrintConfirm}
                handlePrint={handleTestPrint}
            />
            <PrintConfirmDialog
                open={openXqPrintConfirmDialog}
                handleClose={handleCloseXqPrintConfirm}
                handlePrint={handleXqPrint}
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
};

export default ReceptionistView;
