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

const patientList = [
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

const patientColumns = [
    {
        title: 'Mã BN', field: 'ID',
        render: rowData => <Link to={`/patient/${rowData.ID}`} children={`${rowData.ID}`} />,
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
        hidden: true,
    },
    {
        title: 'Trạng thái', field: 'StatusID',
        render: rowData => <Status status={statusList.find(s => s.id === rowData.StatusID).name} />,
        hidden: true,
    },
];

const Patients = () => {
    const classes = useStyles();    

    // const [selectedRow, setSelectedRow] = React.useState(null);
    // const handleSelectRow = (event, rowData) => {
    //     if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
    //         setSelectedRow(rowData);
    //         setValues({
    //             ...rowData,
    //         });
    //     } else {
    //         setSelectedRow(null);
    //         handleResetValue();
    //     }
    // };

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
                                data={patientList}
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

export default Patients;
