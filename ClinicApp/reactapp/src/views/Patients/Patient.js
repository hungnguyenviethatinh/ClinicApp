import React from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { makeStyles } from '@material-ui/styles';
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
    bordered: {
        border: '1px solid rgba(224, 224, 224, 1)',
    },
}));

const typeList = [
    { name: 'Đơn thuốc', id: 0 },
    { name: 'Đơn chỉ định', id: 1 },
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

const diagnosis = [
    { name: 'Mất ngủ đau đầu', id: 0 },
    { name: 'Rối loạn', id: 1 },
    { name: 'Đau bụng', id: 2 },
    { name: 'Đau tim', id: 3 },
    { name: 'Bệnh lười', id: 4 },
];

const drugs = [
    {
        ID: 'DKC-DT001',
        Name: 'Panadol',
        Amount: 50,
        Unit: 'Viên',
        Usage: 'Ngày uống 3 lần, lần 2 viên.'
    },
    {
        ID: 'DKC-DT002',
        Name: 'Panadol',
        Amount: 50,
        Unit: 'Viên',
        Usage: 'Ngày uống 3 lần, lần 2 viên.'
    },
    {
        ID: 'DKC-DT003',
        Name: 'Panadol',
        Amount: 50,
        Unit: 'Viên',
        Usage: 'Ngày uống 3 lần, lần 2 viên.'
    },
    {
        ID: 'DKC-DT008',
        Name: 'Panadol',
        Amount: 50,
        Unit: 'Viên',
        Usage: 'Ngày uống 3 lần, lần 2 viên.'
    },
    {
        ID: 'DKC-DT006',
        Name: 'Panadol',
        Amount: 50,
        Unit: 'Viên',
        Usage: 'Ngày uống 3 lần, lần 2 viên.'
    },
    {
        ID: 'DKC-DT007',
        Name: 'Panadol',
        Amount: 50,
        Unit: 'Viên',
        Usage: 'Ngày uống 3 lần, lần 2 viên.'
    },
];

const requests = [
    {
        ID: 'DKC-DT004',
        Name: 'Chụp X Quang',
        Description: 'Đi chụp X Quang tim'
    },
    {
        ID: 'DKC-DT005',
        Name: 'Chụp X Quang',
        Description: 'Đi chụp X Quang tim'
    },
    {
        ID: 'DKC-DT009',
        Name: 'Chụp X Quang',
        Description: 'Đi chụp X Quang tim'
    },
    {
        ID: 'DKC-DT010',
        Name: 'Chụp X Quang',
        Description: 'Đi chụp X Quang tim'
    },
];

const prescriptions = [
    {
        ID: 'DKC-DT001',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194219',
        DiagnosisID: 0,
        TypeID: 0,
        StatusID: 0,
        Date: new Date('2019-01-01'),
        Note: 'Hẹn tái khám ngày 08-01-2019',
    },
    {
        ID: 'DKC-DT002',
        DoctorID: 'DKC-BS02',
        PatientID: 'DKC-BN191118194220',
        DiagnosisID: 1,
        TypeID: 0,
        StatusID: 0,
        Date: new Date('2019-01-01'),
        Note: 'Nhớ giữ ấm',
    },
    {
        ID: 'DKC-DT003',
        DoctorID: 'DKC-BS03',
        PatientID: 'DKC-BN191118194216',
        DiagnosisID: 2,
        TypeID: 0,
        StatusID: 0,
        Date: new Date('2019-01-01'),
        Note: 'Hạn chế uống rượu bia'
    },
    {
        ID: 'DKC-DT004',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194217',
        DiagnosisID: 1,
        TypeID: 1,
        StatusID: 0,
        Date: new Date('2019-01-01'),
        Note: 'Không nên uống cafe',
    },
    {
        ID: 'DKC-DT005',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194218',
        DiagnosisID: 2,
        TypeID: 1,
        StatusID: 0,
        Date: new Date('2019-01-01'),
        Note: '',
    },
    {
        ID: 'DKC-DT006',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194219',
        DiagnosisID: 3,
        TypeID: 0,
        StatusID: 1,
        Date: new Date('2019-10-01'),
        Note: 'Đã trị dứt điểm',
    },
    {
        ID: 'DKC-DT007',
        DoctorID: 'DKC-BS02',
        PatientID: 'DKC-BN191118194220',
        DiagnosisID: 4,
        TypeID: 0,
        StatusID: 1,
        Date: new Date('2019-10-01'),
        Note: '',
    },
    {
        ID: 'DKC-DT008',
        DoctorID: 'DKC-BS03',
        PatientID: 'DKC-BN191118194216',
        DiagnosisID: 4,
        TypeID: 0,
        StatusID: 1,
        Date: new Date('2019-01-01'),
        Note: '',
    },
    {
        ID: 'DKC-DT009',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194217',
        DiagnosisID: 0,
        TypeID: 1,
        StatusID: 1,
        Date: new Date('2019-01-01'),
        Note: '',
    },
    {
        ID: 'DKC-DT010',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194218',
        DiagnosisID: 3,
        TypeID: 1,
        StatusID: 1,
        Date: new Date('2019-01-01'),
        Note: '',
    },
];

const historyColumns = [
    { 
        title: 'Ngày khám', field: 'Date', type: 'date',
    },
    { 
        title: 'Bác sĩ khám', field: 'DoctorID',
        render: rowData => doctorList.find(d => d.id === rowData.DoctorID).name,
    },
    { 
        title: 'Chẩn đoán', field: 'DiagnosisID',
        render: rowData => diagnosis.find(d => d.id === rowData.DiagnosisID).name,
    },
    { 
        title: 'Số đơn thuốc / chỉ định', field: 'ID',
        render: rowData => <Link to={`/prescription/${rowData.ID}`} children={`${rowData.ID}`} />,
    },
    { 
        title: 'Ghi chú', field: 'Note',
    },
];

const Patient = () => {
    const classes = useStyles();
    const { id } = useParams();

    const [patient, setPatient] = React.useState(null);
    const [prescription, setPrescription] = React.useState([]);
    const handlePrint = () => {

    };

    React.useEffect(() => {
        setPatient(patients.find(p => p.ID === id));
        setPrescription(prescriptions.filter(p => p.PatientID === id));
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title="THÔNG TIN BỆNH NHÂN"
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
                        title="LỊCH SỬ KHÁM BỆNH"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <PerfectScrollbar>
                            <Table
                                columns={historyColumns}
                                data={prescription}
                            />
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Patient;
