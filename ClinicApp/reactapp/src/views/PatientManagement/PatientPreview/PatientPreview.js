import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, Typography } from '@material-ui/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { Button } from '../../../components/Button';

import {
    DisplayDateFormat,
    Gender,
} from '../../../constants';

import _ from 'lodash';
import moment from 'moment';

const PatientPreview = (props) => {
    const { disabled, disabledPrint, loading, loadingPrint, open, patient, handleCancel, handlePrint, handleSave } = props;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            maxWidth="md"
            fullScreen={fullScreen}
            open={open}
            onClose={handleCancel}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title" >THÔNG TIN TIẾP NHẬN BỆNH NHÂN</DialogTitle>
            <DialogContent>
                <DialogContentText>Xem lại thông tin tiếp nhận của bệnh nhân trước khi lưu trữ và in phiếu.</DialogContentText>
                {
                    _.isEmpty(patient) ?
                        <Typography
                            variant="body1"
                            component="p"
                            children="Đang tải dữ liệu..."
                        />
                        :
                        <Grid
                            container
                            justify="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                                <Typography
                                    variant="h1"
                                    component="h1"
                                    align="center"
                                    children={`${patient.FullName}`}
                                    style={{ marginBottom: 32, textTransform: 'uppercase' }}
                                />
                                <Typography
                                    variant="caption"
                                    component="p"
                                    children="THÔNG TIN CƠ BẢN"
                                />
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    alignItems="center"
                                    style={{ marginTop: 8, marginBottom: 24 }}
                                >
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Họ và Tên BN:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.FullName}`}
                                            style={{ fontWeight: 600, textTransform: 'uppercase' }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Tuổi:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.Age}`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Giới tính:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${[Gender.None, Gender.Male, Gender.Female][patient.Gender]}`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Địa chỉ:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.Address}`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Điện thoại:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.PhoneNumber}`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Số điện thoại người thân:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.RelativePhoneNumber}`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Trạng thái:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.Status}`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Ngày hẹn khám:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={
                                                `${moment(patient.AppointmentDate).isValid() ?
                                                    moment(patient.AppointmentDate).format(DisplayDateFormat) : ''}`
                                            }
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography
                                    variant="caption"
                                    component="p"
                                    children="THÔNG TIN KHÁM LÂM SÀNG"
                                />
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    alignItems="center"
                                    style={{ marginTop: 8, marginBottom: 24 }}
                                >
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Chiều cao:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.Height} cm`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Cân nặng:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.Weight} kg`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Nhịp tim:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.BloodPressure} lần/phút`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Mạch:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.Pulse} mmHg`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Khác:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.Other}`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                                        <Typography
                                            variant="body1"
                                            component="p"
                                            children="Ghi chú:"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                                        <Typography
                                            variant="h6"
                                            component="h6"
                                            children={`${patient.Note}`}
                                            style={{ fontWeight: 600 }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography
                                    variant="caption"
                                    component="p"
                                    children="CÁC BÁC SĨ HỘI CHUẨN KHÁM"
                                />
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    alignItems="center"
                                    style={{ marginTop: 8, marginBottom: 24 }}
                                >
                                    {
                                        !_.isEmpty(patient.Doctors) &&
                                        patient.Doctors.map((doctor, index) => (
                                            <Grid item key={index} xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <Typography
                                                    variant="h6"
                                                    component="h6"
                                                    children={`${doctor.fullName}`}
                                                    style={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                                <Typography
                                    variant="caption"
                                    component="p"
                                    children="HÌNH ẢNH CHỤP X QUANG"
                                />
                                <Grid
                                    container
                                    spacing={2}
                                    justify="center"
                                    alignItems="center"
                                    style={{ marginTop: 8, marginBottom: 24 }}
                                >
                                    {
                                        !_.isEmpty(patient.XRayImages) ?
                                            <React.Fragment>
                                                {
                                                    patient.XRayImages.map((image, index) => (
                                                        <Grid key={index} item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                            <div style={{ textAlign: 'center' }}>
                                                                {
                                                                    !image.isDeleted &&
                                                                    <img
                                                                        style={{ maxWidth: '100%', }}
                                                                        src={image.data}
                                                                        alt={image.name}
                                                                    />
                                                                }
                                                            </div>
                                                        </Grid>
                                                    ))
                                                }
                                            </React.Fragment>
                                            :
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    children="KHÔNG CÓ HÌNH ẢNH"
                                                />
                                            </Grid>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                }
            </DialogContent>
            <DialogActions
                style={{
                    paddingLeft: 24,
                    paddingRight: 24,
                }}
            >
                <Button
                    autoFocus
                    disabled={disabled}
                    color="danger"
                    children="Hủy"
                    iconName="cancel"
                    onClick={handleCancel}
                    style={{ marginRight: 16 }}
                />
                <Button
                    disabled={disabledPrint}
                    loading={loadingPrint}
                    color="warning"
                    children="In"
                    iconName="print"
                    onClick={handlePrint}
                    style={{ marginRight: 16 }}
                />
                <Button
                    disabled={disabled}
                    loading={loading}
                    color="success"
                    children="Lưu"
                    iconName="done"
                    onClick={handleSave}
                />
            </DialogActions>
        </Dialog>
    );
};

PatientPreview.propTypes = {
    open: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    patientData: PropTypes.object,
    handleCancel: PropTypes.func,
    handlePrint: PropTypes.func,
    handleSave: PropTypes.func,
};

PatientPreview.defaultProps = {
    open: false,
    disabled: false,
    loading: false,
    patientData: null,
    handleCancel: () => { },
    handlePrint: () => { },
    handleSave: () => { },
};

export default PatientPreview;
