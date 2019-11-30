import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    CssBaseline,
    Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import moment from 'moment';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Select } from '../../components/Select';
import { Snackbar } from '../../components/Snackbar';
import { Button, FabButton } from '../../components/Button';

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

const typeList = [
    { name: 'Đơn thuốc', id: 0 },
    { name: 'Đơn chỉ định', id: 1 },
];

const typeListOptions = [
    { label: 'Đơn thuốc', value: 0 },
    { label: 'Đơn chỉ định', value: 1 },
];

const genderList = [
    { name: 'Nam', id: 0 },
    { name: 'Nữ', id: 1 },
    { name: 'Khác', id: 2 },
];

const statusList = [
    { name: 'Mới', id: 0 },
    { name: 'Đã in', id: 1 },
];

const doctorList = [
    { name: 'Nguyễn A', id: 'DKC-BS01' },
    { name: 'Nguyễn B', id: 'DKC-BS02' },
    { name: 'Nguyễn C', id: 'DKC-BS03' },
];

const patients = [
    {
        ID: 'DKC-BN191118194216',
        FullName: 'Nguyễn Viết A',
        YearOfBirth: 1995,
        Gender: 0,
        PhoneNumber: '0987654321',
        Address: 'tp hồ chí minh',
        Job: 'sinh viên',
        DoctorID: 'DKC-BS03',
        StatusID: 0,
    },
    {
        ID: 'DKC-BN191118194217',
        FullName: 'Nguyễn Viết B',
        YearOfBirth: 1995,
        Gender: 0,
        PhoneNumber: '0987654321',
        Address: 'tp hồ chí minh',
        Job: 'sinh viên',
        DoctorID: 'DKC-BS03',
        StatusID: 2,
    },
    {
        ID: 'DKC-BN191118194218',
        FullName: 'Nguyễn Viết C',
        YearOfBirth: 1995,
        Gender: 0,
        PhoneNumber: '0987654321',
        Address: 'tp hồ chí minh',
        Job: 'sinh viên',
        DoctorID: 'DKC-BS01',
        StatusID: 2,
    },
    {
        ID: 'DKC-BN191118194219',
        FullName: 'Nguyễn Viết D',
        YearOfBirth: 1995,
        Gender: 0,
        PhoneNumber: '0987654321',
        Address: 'tp hồ chí minh',
        Job: 'sinh viên',
        DoctorID: 'DKC-BS03',
        StatusID: 1,
    },
    {
        ID: 'DKC-BN191118194220',
        FullName: 'Nguyễn Viết E',
        YearOfBirth: 1995,
        Gender: 0,
        PhoneNumber: '0987654321',
        Address: 'tp hồ chí minh',
        Job: 'sinh viên',
        DoctorID: 'DKC-BS03',
        StatusID: 0,
    },
];

const prescriptionColumns = [
    {
        title: 'Mã số', field: 'ID',
    },
    {
        title: 'Loại', field: 'TypeID',
        render: rowData => typeList.find(t => t.id === rowData.TypeID).name,
    },
    {
        title: 'Chẩn đoán', field: 'Diagnosis',
    },
    {
        title: 'Ghi chú', field: 'Note',
    }
];

const PrescriptionManagement = () => {

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

    const [patient, setPatient] = React.useState(null);

    const [values, setValues] = React.useState({
        ID: '',
        TypeID: 0,
        Diagnosis: '',
        Note: '',
    });
    const handleValueChange = prop => event => {
        setValues({
            ...values,
            [prop]: event.target.value,
        })
    };
    const handleAddValue = () => {
        setValues({
            ID: `DKC-DT${moment().format('YYMMDDHHmmss')}`,
            TypeID: 0,
        });
        setDrugValues([
            {
                DrugName: '',
                DrugAmount: '',
                DrugUnit: '',
                DrugUsage: '',
            }
        ]);
        setRequestValues([
            {
                RequestName: '',
                RequestDription: '',
            }
        ]);
    };

    const [drugValues, setDrugValues] = React.useState([
        {
            DrugName: '',
            DrugAmount: '',
            DrugUnit: '',
            DrugUsage: '',
        }
    ]);
    const handleDrugValueChange = (index, prop) => event => {
        const newValues = [...drugValues];
        newValues[index][prop] = event.target.value;
        setDrugValues(newValues);
    };
    const handleAddDrugValue = () => {
        setDrugValues([
            ...drugValues,
            {
                DrugName: '',
                DrugAmount: '',
                DrugUnit: '',
                DrugUsage: '',
            },
        ])
    };
    const handleDeleteDrugValue = (index) => {
        drugValues.splice(index, 1);
        setDrugValues([ ...drugValues ]);
    };

    const [requestValues, setRequestValues] = React.useState([
        {
            RequestName: '',
            RequestDription: '',
        }
    ]);
    const handleRequestValueChange = (index, prop) => event => {
        const newValues = [...requestValues];
        newValues[index][prop] = event.target.value;
        setRequestValues(newValues);
    };
    const handleAddRequestValue = () => {
        setRequestValues([
            ...requestValues,
            {
                RequestName: '',
                RequestDription: '',
            },
        ])
    };
    const handleDeleteRequestValue = (index) => {
        requestValues.splice(index, 1);
        setRequestValues([ ...requestValues ]);
    };

    const [data, setData] = React.useState([]);
    const handleSaveValue = () => {
        if (
            !values.ID.trim()
        ) {
            handleSnackbarOption('error', 'Vui lòng nhập đầy đủ thông tin vào các ô trên!');
            return;
        }

        const pres = {
            ...values,
        };

        if (values.TypeID === 0) {
            Object.assign(pres, {
                drugs: [ ...drugValues ],
            });
        } else {
            Object.assign(pres, {
                requests: [ ...requestValues ],
            });
        }

        if (data.findIndex(d => d.ID === values.ID) === -1) {
            setData([...data, pres]);
            handleSnackbarOption('success', 'Kê đơn thành công!');
        } else {
            data.map(d => {
                if (d.ID === values.ID) {
                    if (values.TypeID === 0) {
                        delete d.requests;
                    } else {
                        delete d.drugs;
                    }

                    Object.assign(d, pres);
                }
            });
            setData([ ...data ]);
            handleSnackbarOption('info', 'Cập nhật đơn thành công!');
        }
    };

    const handleResetValue = () => {
        setValues({
            ID: '',
            TypeID: 0,
            Diagnosis: '',
            Note: '',
        });

        setDrugValues(drugValues.map(value => Object.assign(value, {
            DrugName: '',
            DrugAmount: '',
            DrugUnit: '',
            DrugUsage: '',
        })));

        setRequestValues(requestValues.map(value => Object.assign(value, {
            RequestName: '',
            RequestDription: '',
        })));
    };

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
            setValues({
                ID: rowData.ID,
                TypeID: rowData.TypeID,
                Diagnosis: rowData.Diagnosis,
                Note: rowData.Note,
            });
            if (rowData.drugs) {
                setDrugValues([ ...rowData.drugs ]);
            }
            if (rowData.requests) {
                setRequestValues([ ...rowData.requests ]);
            }
        } else {
            setSelectedRow(null);
            handleResetValue();
        }
    };

    React.useEffect(() => {
        console.log(data);
    }, [data]);

    React.useEffect(() => {
        setPatient(patients.find(p => p.ID === 'DKC-BN191118194218'));
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THÔNG TIN BỆNH NHÂN"
                        subheader="Dưới đây là thông tin bệnh nhân hiện tại đang được khám"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        {patient &&
                            <Paper elevation={0} className={classes.paper} >
                                <CssBaseline />
                                <Grid container spacing={3} justify="center" alignItems="center">
                                    <Grid item>
                                        <Typography variant="h1" component="h1" align="center">
                                            {patient.FullName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} style={{ marginTop: 32 }} >
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Typography variant="body1" component="p">
                                            Mã bệnh nhân:
                                        <strong>
                                                {' ' + patient.ID}
                                            </strong>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Typography variant="body1" component="p">
                                            Họ & Tên:
                                        <strong>
                                                {' ' + patient.FullName}
                                            </strong>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={2}>
                                        <Typography variant="body1" component="p">
                                            Giới tính:
                                            <strong>
                                                {
                                                    ' ' +
                                                    genderList.find(
                                                        g => g.id === patient.Gender
                                                    ).name
                                                }
                                            </strong>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={2}>
                                        <Typography variant="body1" component="p">
                                            Tuổi:
                                        <strong>
                                                {
                                                    ' ' + (
                                                        new Date().getFullYear() - patient.YearOfBirth
                                                    )
                                                }
                                            </strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        }
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="KÊ ĐƠN"
                        subheader="Thêm, xóa, cập nhật đơn thuốc, đơn chỉ định"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        id="ID"
                                        label="Mã số"
                                        value={values.ID}
                                        onChange={handleValueChange('ID')}
                                        readOnly
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Select
                                        fullWidth
                                        id="TypeID"
                                        label="Loại đơn"
                                        value={values.TypeID}
                                        options={typeListOptions}
                                        onChange={handleValueChange('TypeID')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="Diagnosis"
                                        label="Chẩn đoán"
                                        value={values.Diagnosis}
                                        onChange={handleValueChange('Diagnosis')}
                                    />
                                </Grid>
                                {
                                    values.TypeID === 0 && drugValues.map((drug, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <TextField
                                                    fullWidth
                                                    id="DrugName"
                                                    label="Tên thuốc"
                                                    value={drug.DrugName}
                                                    onChange={handleDrugValueChange(index, 'DrugName')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                <TextField
                                                    fullWidth
                                                    id="DrugAmount"
                                                    label="Số lượng"
                                                    value={drug.DrugAmount}
                                                    onChange={handleDrugValueChange(index, 'DrugAmount')}
                                                    maxLength={10}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                <TextField
                                                    fullWidth
                                                    id="DrugUnit"
                                                    label="Đơn vị"
                                                    value={drug.DrugUnit}
                                                    onChange={handleDrugValueChange(index, 'DrugUnit')}
                                                    maxLength={10}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                <TextField
                                                    fullWidth
                                                    id="DrugUsage"
                                                    label="Hướng dẫn sử dụng"
                                                    value={drug.DrugUsage}
                                                    onChange={handleDrugValueChange(index, 'DrugUsage')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                <Grid 
                                                    container 
                                                    justify="flex-end" 
                                                    spacing={2}
                                                    style={{ width: '100%', margin: 0 }}
                                                >
                                                    {
                                                        drugValues.length > 1 &&
                                                        <Grid item>
                                                            <FabButton
                                                                color="danger"
                                                                iconName="delete"
                                                                onClick={() => handleDeleteDrugValue(index)}
                                                            />
                                                        </Grid>
                                                    }
                                                    {
                                                        index === drugValues.length - 1 &&
                                                        <Grid item>
                                                            <FabButton
                                                                color="success"
                                                                iconName="add"
                                                                onClick={handleAddDrugValue}
                                                            />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </React.Fragment>
                                    ))
                                }
                                {
                                    values.TypeID === 1 && requestValues.map((request, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <TextField
                                                    fullWidth
                                                    id="RequestName"
                                                    label="Tên chỉ định"
                                                    value={request.RequestName}
                                                    onChange={handleRequestValueChange(index, 'RequestName')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={7} lg={7} xl={7}>
                                                <TextField
                                                    fullWidth
                                                    id="RequestDription"
                                                    label="Hướng dẫn"
                                                    value={request.RequestDription}
                                                    onChange={handleRequestValueChange(index, 'RequestDription')}
                                                    maxLength={10}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                                <Grid 
                                                    container 
                                                    justify="flex-end" 
                                                    spacing={2}
                                                    style={{ width: '100%', margin: 0 }}
                                                >
                                                    {
                                                        requestValues.length > 1 &&
                                                        <Grid item>
                                                            <FabButton
                                                                color="danger"
                                                                iconName="delete"
                                                                onClick={() => handleDeleteRequestValue(index)}
                                                            />
                                                        </Grid>
                                                    }
                                                    {
                                                        index === requestValues.length - 1 &&
                                                        <Grid item>
                                                            <FabButton
                                                                color="success"
                                                                iconName="add"
                                                                onClick={handleAddRequestValue}
                                                            />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </React.Fragment>
                                    ))
                                }
                                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                    <TextField
                                        fullWidth
                                        id="Note"
                                        label="Ghi chú"
                                        value={values.Note}
                                        onChange={handleValueChange('Note')}
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
                                <Grid item>
                                    <Button
                                        color="primary"
                                        children="Gửi đi in"
                                        iconName="print"
                                        disabled={selectedRow === null}
                                    />
                                </Grid>
                            </Grid>
                        }
                        title="DANH SÁCH ĐƠN THUỐC/ CHỈ ĐỊNH"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                columns={prescriptionColumns}
                                data={data}
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

export default PrescriptionManagement;
