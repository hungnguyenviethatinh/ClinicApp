import React from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import FullScreenDialog from '../../_shared/dialog';
import TextField from '../../_shared/textfield';
import Select from '../../_shared/select';
import Snackbar from '../../_shared/snackbar';

import { ClientService , DoctorServie } from '../../../services';

const useStyles = makeStyles(theme => ({
    head: {
        marginBottom: theme.spacing(3),
    },

    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
}));

const EditClientForm = props => {
    const classes = useStyles();
    const { open, handleClose, value } = props;

    const buttons = [
        {
            children: 'Lưu',
            iconName: 'save',
            onClick: () => { handleSave(); }
        }
    ];

    const handleSave = () => {
        if (!editMode) {
            return;
        }

        if (name === '' || id_no === '' || doctor === '') {
            handleSnackbarOption('error', 'Vui lòng điền đầy đủ vào các trường trên!');
            setOpenSnackbar(true);
            return;
        }

        ClientService.Update({
            order: value.order,
            name,
            id_no,
            doctor,
            status: value.status
        });

        handleSnackbarOption('success', 'Thông tin Khách hàng đã được cập nhật thành công!');
        setOpenSnackbar(true);
    }

    const handleCloseDialog = () => {
        setOpenSnackbar(false);
        setEditMode(false);
        handleClose();
    };

    const [editMode, setEditMode] = React.useState(false);

    const [name, setName] = React.useState(value.name);
    const handleChangeName = event => {
        if (!editMode) { setEditMode(true); }
        setName(event.target.value);
    };

    const [id_no, setIdNo] = React.useState(value.id_no);
    const handleChangeIdNo = event => {
        if (!editMode) { setEditMode(true); }
        setIdNo(event.target.value);
    };

    const [doctor, setDoctor] = React.useState(value.doctor);
    const handleChangeDoctor = event => {
        if (!editMode) { setEditMode(true); }
        setDoctor(event.target.value);
    }

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
    };

    const [doctorOptions, setDoctorOptions] = React.useState([]);
    const getDoctorOptions = () => {
        const doctors = DoctorServie.GetDoctor();
        let options = [];
        doctors.map(doctor => {
            options.push({
                label: doctor.name,
                value: doctor.name,
            });
        });
        setDoctorOptions(options);
    };

    React.useEffect(() => {
        if (!editMode) {
            setName(value.name);
            setIdNo(value.id_no);
            setDoctor(value.doctor);
        }
    });

    React.useEffect(() => {
        getDoctorOptions();
    }, []);

    return (
        <FullScreenDialog
            title="Thêm Khách hàng"
            buttons={buttons}
            open={open}
            handleClose={handleCloseDialog}
        >
            <div className={clsx(classes.paper, classes.head)}>
                <Typography color="primary" component="h4" variant="h4">
                    THÔNG TIN KHÁCH HÀNG
                </Typography>
            </div>
            <div className={classes.paper}>
                <form className={classes.form}>
                    <TextField
                        required={true}
                        fullWidth={true}
                        id="name"
                        label="Tên khách hàng"
                        value={name}
                        onChange={handleChangeName}
                        autoFocus={true}
                    />
                    <TextField
                        required={true}
                        fullWidth={true}
                        id="id_no"
                        label="Số CMND"
                        value={id_no}
                        onChange={handleChangeIdNo}
                    />
                    <Select
                        required={true}
                        fullWidth={true}
                        id="doctor"
                        label="Bác sĩ khám"
                        value={doctor}
                        onChange={handleChangeDoctor}
                        options={doctorOptions}
                    />
                </form>
            </div>
            <Snackbar
                vertical="bottom"
                horizontal="right"
                variant={snackbarOption.variant}
                message={snackbarOption.message}
                open={openSnackbar}
                handleClose={handleSnackbarClose}
            />
        </FullScreenDialog>
    );
}

EditClientForm.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    value: PropTypes.object.isRequired,
}

export default EditClientForm;
