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
import _ from 'lodash';
import moment from 'moment';

import { Table } from '../../components/Table';
import { TextField } from '../../components/TextField';
import { Snackbar } from '../../components/Snackbar';
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

const drugColumns = [
    {
        title: 'Mã số', field: 'ID',
    },
    {
        title: 'Tên thuốc', field: 'Name',
    },
    {
        title: 'Số lượng', field: 'Amount', type: 'numeric',
    },
    {
        title: 'Đơn vị', field: 'Unit',
    },
    {
        title: 'Giá', field: 'Price', type: 'numeric',
        render: rowData => rowData.Price + ' VNĐ',
    },
];

const drugs = [
    {
        ID: 'DKC-T001',
        Name: 'Panadol',
        Amount: '100',
        Unit: 'Vỉ',
        Price: '100000',
    },
    {
        ID: 'DKC-T002',
        Name: 'Panadol Extra',
        Amount: '100',
        Unit: 'Viên',
        Price: '100000',
    },
    {
        ID: 'DKC-T003',
        Name: 'Vitamin',
        Amount: '100',
        Unit: 'Vỉ',
        Price: '100000',
    },
    {
        ID: 'DKC-T004',
        Name: 'Panadol TTTT',
        Amount: '0',
        Unit: 'Hộp',
        Price: '100000',
    },
    {
        ID: 'DKC-T005',
        Name: 'ABc',
        Amount: '0',
        Unit: 'Lọ',
        Price: '100000',
    },
];

const UserManagement = () => {

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
        message: '',
    });
    const handleSnackbarOption = (variant, message) => {
        setSnackbarOption({
            variant,
            message,
        });
        setOpenSnackbar(true);
    };

    const [values, setValues] = React.useState({
        ID: '',
        Name: '',
        Amount: '',
        Unit: '',
        Price: '',
    });
    const handleValueChange = prop => event => {
        setValues({
            ...values,
            [prop]: event.target.value,
        })
    };

    const handleAddValue = () => {
        setValues({
            ID: `DKC-T${moment().format('YYMMDDHHmmss')}`,
        });
    };

    const [drugData, setDrugData] = React.useState([...drugs]);
    const handleSaveValue = () => {
        if (
            !values.ID.trim() || !values.Name.trim() || !values.Amount || !values.Unit || !values.Price
        ) {
            handleSnackbarOption('error', 'Vui lòng nhập đầy đủ thông tin vào các ô trên!');
            return;
        }

        if (!_.isNumber(parseInt(values.Amount)) || !_.isNumber(parseInt(values.Price))) {
            handleSnackbarOption('error', 'Vui lòng nhập số vào ô Số lượng hợp lệ!');
            return;
        }

        if (drugData.findIndex(p => p.ID === values.ID) === -1) {
            setDrugData([...drugData, values]);
            handleSnackbarOption('success', 'Thêm thuốc mới thành công!');
        } else {
            drugData.map(d => {
                d.ID === values.ID && Object.assign(d, values)
            });
            setDrugData([...drugData]);
            handleSnackbarOption('info', 'Cập nhật thông tin thuốc thành công!');
        }
    };

    const handleDelete = () => {
        setDrugData(drugData.filter(e => e.ID !== selectedRow.ID));
    };

    const handleResetValue = () => {
        setValues({
            ID: '',
            Name: '',
            Amount: '',
            Unit: '',
            Price: '',
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
                        title="THÔNG TIN NHÂN VIÊN"
                        subheader="Thêm, xóa, cập nhật thông tin nhân viên"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        id="ID"
                                        label="Mã số thuốc"
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
                                        id="Name"
                                        label="Tên thuốc"
                                        value={values.Name}
                                        onChange={handleValueChange('Name')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        id="Amount"
                                        label="Số lượng"
                                        value={values.Amount}
                                        onChange={handleValueChange('Amount')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                    <TextField
                                        fullWidth
                                        id="Unit"
                                        label="Đơn vị"
                                        value={values.Unit}
                                        onChange={handleValueChange('Unit')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                    <TextField
                                        fullWidth
                                        id="Price"
                                        label="Giá"
                                        value={values.Price}
                                        onChange={handleValueChange('Giá')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                                        onClick={handleDelete}
                                    />
                                </Grid>
                            </Grid>
                        }
                        title="DANH SÁCH THUỐC"
                        subheader="Tìm kiếm thuốc"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                customOptions={{
                                    filtering: true,
                                }}
                                columns={drugColumns}
                                data={drugData}
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

export default UserManagement;
