import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import BlockUi from 'react-block-ui';
import _ from 'lodash';
import moment from 'moment';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select';
import { Snackbar } from '../../components/Snackbar';
import { DropZone } from '../../components/DropZone';
import { Button } from '../../components/Button';

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


const genderListOptions = [
    { label: 'Nam', value: 0 },
    { label: 'Nữ', value: 1 },
    { label: 'Khác', value: 2 },
];

const statusListOptions = [
    { label: 'Mới', value: 0 },
    { label: 'Tái khám', value: 1 },
    { label: 'Khám', value: 2 },
];

const doctorListOptions = [
    { label: 'Nguyễn A', value: 'DKC-BS01' },
    { label: 'Nguyễn B', value: 'DKC-BS02' },
    { label: 'Nguyễn C', value: 'DKC-BS03' },
];


let imageList = [];

const patientColumns = [
    {
        title: 'Mã BN', field: 'ID',
    },
    {
        title: 'Họ & Tên', field: 'FullName',
    },
    {
        title: 'Năm sinh', field: 'YearOfBirth', type: 'numeric',
    },
    {
        title: 'Giới tính', field: 'Gender', type: 'numeric',
        cellStyle: { minWidth: 100 },
        filterCellStyle: { marginTop: 0 },
        lookup: { 0: 'Nam', 1: 'Nữ', 2: 'Khác' },
    },
    {
        title: 'Số ĐT', field: 'PhoneNumber',
    },
    {
        title: 'Địa chỉ', field: 'Address',
    },
    {
        title: 'Nghề nghiệp', field: 'Job',
    },
    {
        title: 'Bác sĩ khám', field: 'DoctorID',
        hidden: true,
    },
    {
        title: 'Trạng thái', field: 'StatusID', type: 'numeric',
        hidden: true,
    },
];

const PatientManagement = () => {

    const classes = useStyles();

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const handleSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackbar(false);
	};

	const [snackbarOption, setSnackbarOption] = React.useState({
		variant: 'success',
		message: 'Data loaded successfully!',
	});
	const handleSnackbarOption = (variant, message) => {
		setSnackbarOption({
			variant,
			message,
        });
        setOpenSnackbar(true);
	};

    const [images, setImages] = React.useState([]);
    const handleFiles = (files) => {
        setImages(files);
    }

    const [values, setValues] = React.useState({
        ID: '',
        FullName: '',
        YearOfBirth: '',
        Gender: 0,
        PhoneNumber: '',
        Address: '',
        Job: '',
        DoctorID: '',
        StatusID: 0,
    });
    const handleValueChange = prop => event => {
        setValues({
            ...values,
            [prop]: event.target.value,
        })
    };
    const handleAddValue = () => {
        setValues({
            ID: `DKC-BN${moment().format('YYMMDDHHmmss')}`,
            Gender: 0,
            StatusID: 0,
        })
    };

    const [patientData, setPatientData] = React.useState([]);
    const handleSaveValue = () => {
        if (
            !values.ID.trim() || !values.FullName.trim() || !values.YearOfBirth.trim() ||
            !values.PhoneNumber.trim() || !values.Address.trim() || !values.Job.trim() || 
            !values.DoctorID.trim()
        ) {
            handleSnackbarOption('error', 'Vui lòng nhập đầy đủ thông tin vào các ô trên!');
            return;
        }

        if (!_.isNumber(parseInt(values.YearOfBirth)) || !_.isNumber(parseInt(values.PhoneNumber))) {
            handleSnackbarOption('error', 'Vui lòng nhập Số với ô Năm sinh và Số điện thoại!');
            return;
        }

        if (patientData.findIndex(p => p.ID === values.ID) === -1) {
            setPatientData([...patientData, values]);
            handleSnackbarOption('success', 'Thêm mới bệnh nhân thành công!');
        } else {
            patientData.map(p => {
                p.ID === values.ID && Object.assign(p, values)
            });
            setPatientData([ ...patientData ]);
            handleSnackbarOption('info', 'Cập nhật thông tin bệnh nhân thành công!');
        }
    };

    const handleResetValue = () => {
        setValues({
            ID: '',
            FullName: '',
            YearOfBirth: '',
            Gender: 0,
            PhoneNumber: '',
            Address: '',
            Job: '',
            DoctorID: '',
            StatusID: 0,
        });
    };

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setValues({
                ...rowData,
            });
        } else {
            setSelectedRow(null);
            handleResetValue();
        }
    };

    React.useEffect(() => {
        // console.log('values', values);
        // console.log('images', images);
    });

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THÔNG TIN BỆNH NHÂN"
                        subheader="Thêm, xóa, cập nhật thông tin bệnh nhân"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        id="ID"
                                        label="Mã Bệnh Nhân"
                                        value={values.ID}
                                        onChange={handleValueChange('ID')}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="FullName"
                                        label="Họ & Tên"
                                        value={values.FullName}
                                        onChange={handleValueChange('FullName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        id="YearOfBirth"
                                        label="Năm sinh"
                                        value={values.YearOfBirth}
                                        maxLength={4}
                                        onChange={handleValueChange('YearOfBirth')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Select
                                        fullWidth
                                        id="Gender"
                                        label="Giới tính"
                                        value={values.Gender}
                                        onChange={handleValueChange('Gender')}
                                        options={genderListOptions}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        id="PhoneNumber"
                                        label="Số điện thoại"
                                        value={values.PhoneNumber}
                                        onChange={handleValueChange('PhoneNumber')}
                                        maxLength={10}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="Address"
                                        label="Địa chỉ"
                                        value={values.Address}
                                        onChange={handleValueChange('Address')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        id="Job"
                                        label="Nghề nghiệp"
                                        value={values.Job}
                                        onChange={handleValueChange('Job')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Select
                                        fullWidth
                                        id="StatusID"
                                        label="Trạng thái"
                                        value={values.StatusID}
                                        options={statusListOptions}
                                        onChange={handleValueChange('StatusID')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Select
                                        fullWidth
                                        id="DoctorID"
                                        label="Bác sĩ khám"
                                        value={values.DoctorID}
                                        options={doctorListOptions}
                                        onChange={handleValueChange('DoctorID')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Grid 
                                        container 
                                        justify="flex-end" 
                                        spacing={2}
                                        style={{ width: '100%', margin: 0 }}
                                    >
                                        <Grid item>
                                            <Button
                                                color="info"
                                                children="Đặt lại"
                                                iconName="reset"
                                                onClick={handleResetValue}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                color="primary"
                                                children="Lưu"
                                                iconName="save"
                                                onClick={handleSaveValue}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                color="success"
                                                children="Thêm"
                                                iconName="add"
                                                onClick={handleAddValue}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <BlockUi
                                        tag="div"
                                        blocking={false}
                                        message="Hình ảnh đang được tải lên"
                                    >
                                        <DropZone onDropFile={handleFiles} />
                                    </BlockUi>
                                </Grid>
                            </Grid>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        action={
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Button
                                        color="danger"
                                        children="Xóa"
                                        iconName="delete"
                                        disabled={selectedRow === null}
                                    />
                                </Grid>
                            </Grid>
                        }
                        title="DANH SÁCH BỆNH NHÂN"
                        subheader="Tìm kiếm bệnh nhân"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                customOptions={{
                                    filtering: true,
                                }}
                                columns={patientColumns}
                                data={patientData}
                                onRowClick={handleSelectRow}
                                selectedRow={selectedRow}
                            />
                        </PerfectScrollbar>
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

export default PatientManagement;
