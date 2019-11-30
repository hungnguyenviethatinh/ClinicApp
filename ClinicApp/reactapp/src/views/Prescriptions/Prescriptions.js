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

import { Table } from '../../components/Table';
import { Status } from '../../components/Status';

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

const statusList = [
    { name: 'Mới', id: 0 },
    { name: 'Đã in', id: 1 },
];

const doctorList = [
    { name: 'Nguyễn A', id: 'DKC-BS01' },
    { name: 'Nguyễn B', id: 'DKC-BS02' },
    { name: 'Nguyễn C', id: 'DKC-BS03' },
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
        lookup: { 0: 'Đơn thuốc', 1: 'Đơn chỉ định' }
    },
    { 
        title: 'Trạng thái', field: 'StatusID',
        render: rowData => <Status status={statusList.find(s => s.id === rowData.StatusID).name} />,
        lookup: { 0: 'Mới', 1: 'Đã in' }
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
    {
        ID: 'DKC-DT006',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194219',
        TypeID: 0,
        StatusID: 1,
    },
    {
        ID: 'DKC-DT007',
        DoctorID: 'DKC-BS02',
        PatientID: 'DKC-BN191118194220',
        TypeID: 0,
        StatusID: 1,
    },
    {
        ID: 'DKC-DT008',
        DoctorID: 'DKC-BS03',
        PatientID: 'DKC-BN191118194216',
        TypeID: 0,
        StatusID: 1,
    },
    {
        ID: 'DKC-DT009',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194217',
        TypeID: 1,
        StatusID: 1,
    },
    {
        ID: 'DKC-DT010',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194218',
        TypeID: 1,
        StatusID: 1,
    },
];

const Prescriptions = () => {
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
                        title="DANH SÁCH ĐƠN THUỐC"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                customOptions={{
                                    filtering: true,
                                }}
                                columns={prescriptionColumns}
                                data={prescriptions}
                                // onRowClick={handleSelectRow}
                                // selectedRow={selectedRow}
                            />
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Prescriptions;