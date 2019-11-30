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
        title: 'Số thứ tự', field: 'No', type: 'numeric', defaultSort: 'asc',
    },
    {
        title: 'Mã BN', field: 'ID',
        hidden: true,
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
        hidden: true,
    },
    {
        title: 'Địa chỉ', field: 'Address',
        hidden: true,
    },
    {
        title: 'Nghề nghiệp', field: 'Job',
        hidden: true,
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
        No: 1,
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
        No: 2,
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
        No: 3,
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
        No: 4,
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
        No: 5,
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

const DoctorView = () => {
    const classes = useStyles();

    const [patientQueueData, setPatientQueueData] = React.useState([]);
    const [prescriptionData, setPrescriptionData] = React.useState([]);

    // const [selectedRow, setSelectedRow] = React.useState(null);
    // const handleSelectRow = (event, rowData) => {
    //     if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
    //         setSelectedRow(rowData);
    //     } else {
    //         setSelectedRow(null);
    //     }
    // };

    React.useEffect(() => {
        setPatientQueueData(patientQueue.filter(p => p.DoctorID === 'DKC-BS01'));
        setPrescriptionData(prescriptions.filter(p => p.DoctorID === 'DKC-BS01'));
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="HÀNG CHỜ BỆNH NHÂN"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                columns={patientQueueColumns}
                                data={patientQueueData}
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
                        title="DANH SÁCH ĐƠN THUỐC MỚI"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                columns={prescriptionColumns}
                                data={prescriptionData}
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

export default DoctorView;
