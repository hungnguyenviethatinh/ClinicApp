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

import Table from '../../_shared/table';
import CustomStatusBullet from '../../_shared/customstatusbullet';
import Button from '../../_shared/button';
import { AddClientForm, EditClientForm } from '../form';

import { ClientService } from '../../../services';

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
    { title: 'STT', field: 'order', type: 'numeric', defaultSort: 'asc' },
    { title: 'Họ và Tên', field: 'name' },
    { title: 'Số CMT', field: 'id_no' },
    { title: 'Bác sĩ khám', field: 'doctor' },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => <CustomStatusBullet status={rowData.status} />,
    },
];

const ClientTable = props => {
    const { className, ...rest } = props;
    const classes = useStyles();

    const [data, setData] = React.useState([]);
    const getClients = () => {
        const clients = ClientService.GetClient();
        setData(clients);
    };

    const [selectedRow, setSelectedRow] = React.useState(null);
    const handleSelectRow = (event, rowData) => {
        if (selectedRow === null || selectedRow.tableData.id !== rowData.tableData.id) {
            setSelectedRow(rowData);
        } else {
            setSelectedRow(null);
        }
    };

    const [openAddClientForm, setOpenAddClientForm] = React.useState(false);
    const handleOpenAddClientForm = () => {
        setOpenAddClientForm(true);
    };
    const handleCloseAddClientForm = () => {
        setOpenAddClientForm(false);
        getClients();
    };

    const [openEditClientForm, setOpenEditClientForm] = React.useState(false);
    const handleOpenEditClientForm = () => {
        setOpenEditClientForm(true);
    };
    const handleCloseEditClientForm = () => {
        setOpenEditClientForm(false);
        getClients();
    };

    const handleAdd = () => {
        handleOpenAddClientForm();
    };

    const handleDelete = () => {
        ClientService.Remove(selectedRow.order);
        getClients();
    };

    const handleEdit = () => {
        handleOpenEditClientForm();
    };

    React.useEffect(() => {
        getClients();
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
                                    color="danger"
                                    children="Xóa"
                                    iconName="delete"
                                    disabled={selectedRow === null}
                                    onClick={handleDelete}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    color="primary"
                                    children="Sửa"
                                    iconName="edit"
                                    disabled={selectedRow === null}
                                    onClick={handleEdit}
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
                    title="DANH SÁCH BỆNH NHÂN"
                />
                <Divider />
                <CardContent className={classes.content}>
                    <PerfectScrollbar>
                        <Table
                            columns={columns}
                            data={data}
                            onRowClick={handleSelectRow}
                            selectedRow={selectedRow}
                        />
                    </PerfectScrollbar>
                </CardContent>
            </Card>
            <AddClientForm
                open={openAddClientForm}
                handleClose={handleCloseAddClientForm} />
            <EditClientForm
                open={openEditClientForm}
                handleClose={handleCloseEditClientForm}
                value={selectedRow? selectedRow : {}} />
        </React.Fragment>
    );
};

ClientTable.propTypes = {
    className: PropTypes.string
};

export default ClientTable;
