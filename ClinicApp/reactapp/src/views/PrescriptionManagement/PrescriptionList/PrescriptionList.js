import React from 'react';
import { Link } from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';

import Axios, { axiosRequestConfig } from '../../../common';
import { GetPrescriptionListUrl } from '../../../config';
import { RouteConstants, DisplayDateTimeFormat } from '../../../constants';

import moment from 'moment';

const columns = [
    {
        title: 'Mã ĐT', field: 'id',
        render: rowData =>
            <Link
                to={`${RouteConstants.PrescriptionDetailView.replace(':id', rowData.id)}`}
                children={`${rowData.idCode}${rowData.id}`}
            />,
    },
    {
        title: 'Bác sĩ kê đơn', field: 'doctorId',
        render: rowData => rowData.doctor.fullName,
    },
    {
        title: 'Ngày kê đơn', field: 'dateCreated', type: 'date',
        render: rowData => moment(rowData.dateCreated).format(DisplayDateTimeFormat),
    },
];

const PrescriptionList = (props) => {
    const { open, patientId, handleClose, handleCopy } = props;
    const config = axiosRequestConfig();

    const tableRef = React.createRef(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (!selectedRow || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
        } else {
            setSelectedRow(null);
        }
    };

    const getPrescriptionList = (resolve, reject, query) => {
        const url = `${GetPrescriptionListUrl}/${patientId}`;
        Axios.get(url, {
            ...config,
            params: {
                page: query.page + 1,
                pageSize: query.pageSize,
            },
        }).then((response) => {
            const { status, data } = response;
            if (status === 200) {
                const { totalCount, prescriptions } = data[0];
                const { page } = query;
                resolve({
                    data: prescriptions,
                    page,
                    totalCount,
                });
            }
        }).catch((reason) => {
            console.log('Get Prescription List Error:', reason);
        });
    };

    const handleDone = () => {
        handleCopy(selectedRow);
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">SAO CHÉP ĐƠN THUỐC</DialogTitle>
            <DialogContent>
                <DialogContentText>Danh sách đơn thuốc cũ của bệnh nhân</DialogContentText>
                <Table
                    tableRef={tableRef}
                    pageSizeOptions={[5, 10, 20]}
                    columns={columns}
                    data={
                        query => new Promise((resolve, reject) => {
                            getPrescriptionList(resolve, reject, query);
                        })
                    }
                    onRowClick={handleSelectRow}
                    selectedRow={selectedRow}
                />
            </DialogContent>
            <DialogActions
                style={{
                    paddingLeft: 24,
                    paddingRight: 24,
                }}
            >
                <Button
                    autoFocus
                    color="danger"
                    children="Hủy"
                    iconName="cancel"
                    onClick={handleClose}
                    style={{ marginRight: 16 }}
                />
                <Button
                    disabled={!selectedRow}
                    color="primary"
                    children="Sao chép"
                    iconName="copy"
                    onClick={handleDone}
                />
            </DialogActions>
        </Dialog>
    );
};

PrescriptionList.propTypes = {
    open: PropTypes.bool,
    patientId: PropTypes.string.isRequired,
    handleClose: PropTypes.func,
    handleCopy: PropTypes.func,
};

PrescriptionList.defaultProps = {
    open: false,
    patientId: '',
    handleClose: () => { },
    handleCopy: () => { },
};

export default PrescriptionList;
