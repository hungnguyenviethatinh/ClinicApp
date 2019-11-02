import React from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid
} from '@material-ui/core';

import Table from '../_shared/table';
import CustomStatusBullet from '../_shared/customstatusbullet';
import Button from '../_shared/button';

import { PatientService } from '../../services';

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0
    },
    actions: {
        justifyContent: 'flex-end'
    }
}));

const columns = [
    { title: 'Mã số', type: 'numeric', field: 'id', defaultSort: 'asc' },
    { title: 'Họ và Tên', field: 'name' },
    { title: 'Địa chỉ', field: 'address' },
    { title: 'Năm sinh', field: 'dob' },
    { title: 'Số điện thoại', field: 'phone' },
    { title: 'Giới tính', field: 'gender' },
];

const PatientTable = props => {
    const { className, ...rest } = props;
    const classes = useStyles();

    const [data, setData] = React.useState([]);
    const getPatients = () => {
        const patients = PatientService.GetPatients();
        setData(patients);
    };

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (selectedRow === null || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
        } else {
            setSelectedRow(null);
        }
    };

    const handleAdd = () => {
        
    };

    const handleViewProfile = () => {
        console.log(selectedRow);
    };

    React.useEffect(() => {
        getPatients();
    }, []);

    return (
        <React.Fragment>
            <Card
                {...rest}
                className={clsx(classes.root, className)}
            >
                <CardHeader
                    action={
                        <Grid container spacing={1}>
                            <Grid item>
                                <Button
                                    color="info"
                                    children="Xem"
                                    iconName="view"
                                    disabled={selectedRow === null}
                                    onClick={handleViewProfile}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    color="success"
                                    children="Thêm"
                                    iconName="add"
                                    onClick={handleAdd}
                                />
                            </Grid>
                        </Grid>
                    }
                    title="DANH SÁCH HỒ SƠ BỆNH NHÂN"
                />
                <Divider />
                <CardContent className={classes.content}>
                    <PerfectScrollbar>
                        <Table
                            columns={columns}
                            customOptions={{
                                paging: false,
                                filter: false,
                                toolbar: true,
                                showTitle: false
                            }}
                            data={data}
                            onRowClick={handleSelectRow}
                            selectedRow={selectedRow}
                        />
                    </PerfectScrollbar>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

PatientTable.propTypes = {
    className: PropTypes.string
};

export default PatientTable;
