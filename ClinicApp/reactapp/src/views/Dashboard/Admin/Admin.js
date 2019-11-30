import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { Table } from '../../../components/Table';
import { Status } from '../../../components/Status';

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

const genderList = [
    { name: 'Nam', id: 0 },
    { name: 'Nữ', id: 1 },
    { name: 'Khác', id: 2 },
];

const typeList = [
    { name: 'Đơn thuốc', id: 0 },
    { name: 'Đơn chỉ định', id: 1 },
];

const statusList = [
    { name: 'Mới', id: 0 },
    { name: 'Tái khám', id: 1 },
    { name: 'Khám', id: 2 },
];

const doctorList = [
    { name: 'Nguyễn A', id: 'DKC-BS01' },
    { name: 'Nguyễn B', id: 'DKC-BS02' },
    { name: 'Nguyễn C', id: 'DKC-BS03' },
];

const patientQueueColumns = [
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
        render: rowData => genderList.find(g => g.id === rowData.Gender).name,
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
        render: rowData => doctorList.find(d => d.id === rowData.DoctorID).name,
    },
    {
        title: 'Trạng thái', field: 'StatusID',
        render: rowData => <Status status={statusList.find(s => s.id === rowData.StatusID).name} />,
    },
];

const patientQueue = [
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
        title: 'Mã số Đơn thuốc', field: 'ID',
        render: rowData => <Link to={`/prescription/${rowData.ID}`} children={`${rowData.ID}`} />,
    },
    { 
        title: 'Bác sĩ kê đơn', field: 'DoctorID',
        render: rowData => doctorList.find(d => d.id === rowData.DoctorID).name,
    },
    { 
        title: 'Bệnh nhân', field: 'PatientID',
        render: rowData => patientQueue.find(p => p.ID === rowData.PatientID).FullName,
    },
    { 
        title: 'Loại đơn', field: 'TypeID',
        render: rowData => typeList.find(t => t.id === rowData.TypeID).name,
    },
    { 
        title: 'Trạng thái', field: 'StatusID',
        render: rowData => <Status status={statusList.find(s => s.id === rowData.StatusID).name} />,
    },
];

const prescriptions = [
    {
        ID: 'DKC-DT001',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194219',
        TypeID: 0,
        StatusID: 0,
    },
    {
        ID: 'DKC-DT002',
        DoctorID: 'DKC-BS02',
        PatientID: 'DKC-BN191118194220',
        TypeID: 0,
        StatusID: 0,
    },
    {
        ID: 'DKC-DT003',
        DoctorID: 'DKC-BS03',
        PatientID: 'DKC-BN191118194216',
        TypeID: 0,
        StatusID: 0,
    },
    {
        ID: 'DKC-DT004',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194217',
        TypeID: 1,
        StatusID: 0,
    },
    {
        ID: 'DKC-DT005',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194218',
        TypeID: 1,
        StatusID: 0,
    },
];

const employeeColumns = [
    { 
        title: 'Mã nhân viên', field: 'ID',
    },
    {
        title: 'Họ và Tên', field: 'FullName',
    },
    {
        title: 'Chức vụ', field: 'Role',
    },
    {
        title: 'Số điện thoại', field: 'PhoneNumber',
    },
    {
        title: 'Trạng thái', field: 'Status',
        render: rowData => <Status status={rowData.Status} />,
    },
];

const employees = [
    {
        ID: 'DKC-LT191118194200',
        FullName: 'Lễ tân',
        Role: 'Lễ tân',
        PhoneNumber: '0989898989',
        Status: 'Có mặt',
    },
    { 
        ID: 'DKC-BS01',
        FullName: 'Nguyễn A',
        Role: 'Bác sĩ',
        PhoneNumber: '09999999',
        Status: 'Có mặt',
    },
    { 
        ID: 'DKC-BS02',
        FullName: 'Nguyễn B',
        Role: 'Bác sĩ',
        PhoneNumber: '09999999',
        Status: 'Có mặt',
    },
    { 
        ID: 'DKC-BS03',
        FullName: 'Nguyễn C',
        Role: 'Bác sĩ',
        PhoneNumber: '09999999',
        Status: 'Vắng mặt',
    },
];

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
        title: 'Trạng thái', field: 'Status',
        render: rowData => <Status status={rowData.Status} />,
    },
];

const drugs = [
    {
        ID: 'DKC-T001',
        Name: 'Panadol',
        Amount: 100,
        Unit: 'Vỉ',
        Status: 'Còn',
    },
    {
        ID: 'DKC-T002',
        Name: 'Panadol Extra',
        Amount: 100,
        Unit: 'Viên',
        Status: 'Còn',
    },
    {
        ID: 'DKC-T003',
        Name: 'Vitamin',
        Amount: 100,
        Unit: 'Vỉ',
        Status: 'Còn',
    },
    {
        ID: 'DKC-T004',
        Name: 'Panadol TTTT',
        Amount: 0,
        Unit: 'Hộp',
        Status: 'Hết',
    },
    {
        ID: 'DKC-T005',
        Name: 'ABc',
        Amount: 0,
        Unit: 'Lọ',
        Status: 'Hết',
    },
];

const AdminView = () => {
    const classes = useStyles();

    // const [selectedRow, setSelectedRow] = React.useState(null);
    // const handleSelectRow = (event, rowData) => {
    //     if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
    //         setSelectedRow(rowData);
    //     } else {
    //         setSelectedRow(null);
    //     }
    // };

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="DANH SÁCH BỆNH NHÂN"
                        subheader="Bệnh nhân đến khám trong ngày"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                columns={patientQueueColumns}
                                data={patientQueue}
                                // onRowClick={handleSelectRow}
                                // selectedRow={selectedRow}
                            />
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="DANH SÁCH ĐƠN THUỐC/CHỈ ĐỊNH"
                        subheader="Đơn thuốc/chỉ định được kê trong ngày "
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                columns={prescriptionColumns}
                                data={prescriptions}
                                // onRowClick={handleSelectRow}
                                // selectedRow={selectedRow}
                            />
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="DANH SÁCH NHÂN VIÊN"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                columns={employeeColumns}
                                data={employees}
                                // onRowClick={handleSelectRow}
                                // selectedRow={selectedRow}
                            />
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="DANH SÁCH THUỐC"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                columns={drugColumns}
                                data={drugs}
                                // onRowClick={handleSelectRow}
                                // selectedRow={selectedRow}
                            />
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default AdminView;
