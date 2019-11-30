import React from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Paper,
    Container,
    CssBaseline,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
    },
    {
        ID: 'DKC-DT002',
        DoctorID: 'DKC-BS02',
        PatientID: 'DKC-BN191118194220',
        DiagnosisID: 1,
        TypeID: 0,
        StatusID: 0,
    },
    {
        ID: 'DKC-DT003',
        DoctorID: 'DKC-BS03',
        PatientID: 'DKC-BN191118194216',
        DiagnosisID: 2,
        TypeID: 0,
        StatusID: 0,
    },
    {
        ID: 'DKC-DT004',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194217',
        DiagnosisID: 1,
        TypeID: 1,
        StatusID: 0,
    },
    {
        ID: 'DKC-DT005',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194218',
        DiagnosisID: 2,
        TypeID: 1,
        StatusID: 0,
    },
    {
        ID: 'DKC-DT006',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194219',
        DiagnosisID: 3,
        TypeID: 0,
        StatusID: 1,
    },
    {
        ID: 'DKC-DT007',
        DoctorID: 'DKC-BS02',
        PatientID: 'DKC-BN191118194220',
        DiagnosisID: 4,
        TypeID: 0,
        StatusID: 1,
    },
    {
        ID: 'DKC-DT008',
        DoctorID: 'DKC-BS03',
        PatientID: 'DKC-BN191118194216',
        DiagnosisID: 4,
        TypeID: 0,
        StatusID: 1,
    },
    {
        ID: 'DKC-DT009',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194217',
        DiagnosisID: 0,
        TypeID: 1,
        StatusID: 1,
    },
    {
        ID: 'DKC-DT010',
        DoctorID: 'DKC-BS01',
        PatientID: 'DKC-BN191118194218',
        DiagnosisID: 3,
        TypeID: 1,
        StatusID: 1,
    },
];

const Prescription = () => {
    const classes = useStyles();
    const { id } = useParams();

    const [prescription, setPrescription] = React.useState(null);
    const handlePrint = () => {

    };

    React.useEffect(() => {
        setPrescription(prescriptions.find(p => p.ID === id));
    }, []);

    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        action={
                            <Grid container>
                                <Grid item>
                                    <Button
                                        color="warning"
                                        children="In"
                                        iconName="print"
                                        onClick={handlePrint}
                                    />
                                </Grid>
                            </Grid>
                        }
                        title="CHI TIẾT ĐƠN THUỐC/ CHỈ ĐỊNH"
                    />
                    <Divider />
                    <CardContent className={classes.content}>
                        <Paper elevation={0} className={classes.paper} >
                            {
                                prescription &&
                                <Container maxWidth="md">
                                    <CssBaseline />
                                    <Grid container spacing={3} justify="center" alignItems="center">
                                        <Grid item>
                                            <Typography variant="h1" component="h1" align="center">
                                                {typeList.find(t => t.id === prescription.TypeID).name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} style={{ marginTop: 32 }} >
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <Typography variant="body1" component="p">
                                                Họ & Tên:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                            <Typography variant="h4" component="h4">
                                                {' ' + patients.find(p => p.ID === prescription.PatientID).FullName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <Typography variant="body1" component="p">
                                                Giới tính:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                            <Typography variant="h4" component="h4">
                                                {
                                                    ' ' +
                                                    genderList.find(
                                                        g => g.id === patients.find(
                                                            p => p.ID === prescription.PatientID
                                                        ).Gender
                                                    ).name
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <Typography variant="body1" component="p">
                                                Tuổi:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                                            <Typography variant="h4" component="h4">
                                                {
                                                    ' ' + (
                                                        new Date().getFullYear() - patients.find(p => p.ID === prescription.PatientID).YearOfBirth
                                                    )
                                                }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} style={{ marginTop: 24 }}>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <Typography variant="body1" component="p">
                                                Chẩn đoán:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                                            <Typography variant="h4" component="h4">
                                                {
                                                    ' ' + diagnosis.find(d => d.id === prescription.DiagnosisID).name
                                                }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginTop: 32 }}>
                                        {
                                            prescription.TypeID === 0 &&
                                            drugs.filter(d => d.ID === prescription.ID).map(
                                                (drug, index) => (
                                                    <React.Fragment key={index}>
                                                        <Grid
                                                            item
                                                            xs={10} sm={10} md={10} lg={10} xl={10}
                                                        >
                                                            <Typography variant="body1" component="p">
                                                                {`${index + 1}: ${drug.Name}`}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={2} sm={2} md={2} lg={2} xl={2}
                                                        >
                                                            <Typography variant="body1" component="p">
                                                                {`${drug.Amount} ${drug.Unit}`}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12} sm={12} md={12} lg={12} xl={12}
                                                        >
                                                            <Typography variant="subtitle1" component="p">
                                                                {drug.Usage}
                                                            </Typography>
                                                        </Grid>
                                                    </React.Fragment>
                                                )
                                            )

                                        }
                                        {
                                            prescription.TypeID === 1 &&
                                            requests.filter(r => r.ID === prescription.ID).map(
                                                (request, index) => (
                                                    <React.Fragment key={index}>
                                                        <Grid
                                                            item
                                                            xs={12} sm={12} md={12} lg={12} xl={12}
                                                        >
                                                            <Typography variant="body1" component="p">
                                                                {`${index + 1}: ${request.Name}`}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12} sm={12} md={12} lg={12} xl={12}
                                                        >
                                                            <Typography variant="body1" component="p">
                                                                {request.Description}
                                                            </Typography>
                                                        </Grid>
                                                    </React.Fragment>
                                                )
                                            )
                                        }
                                    </Grid>
                                    <Grid container spacing={3} justify="flex-end" style={{ marginTop: 32 }}>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <Typography variant="h5" component="h5" align="center">Bác sĩ</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} justify="flex-end" style={{ marginTop: 64 }}>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <Typography variant="h4" component="h4" align="center" >
                                                {doctorList.find(d => d.id === prescription.DoctorID).name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Container>
                            }
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Prescription;
