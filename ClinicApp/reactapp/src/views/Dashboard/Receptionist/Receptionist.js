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

import {
    GetPatientInQueueUrl,
    GetPrescriptionsInQueueUrl,
    DeletePatientUrl,
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
        height: '100%',
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

const getPatientLogMsgHeader = '[Get Patients Error]';
const getPrescriptionLogMsgHeader = '[Get Prescriptions Error]';
const deletePatientLogMsgHeader = '[Delete Patient Response] ';

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
                    className={clsx({ [classes.card]: true, [classes.fullHeight]: false })}
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
                    className={clsx({ [classes.card]: true, [classes.fullHeight]: false })}
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
