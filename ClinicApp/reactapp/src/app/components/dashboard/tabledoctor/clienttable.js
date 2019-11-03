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
        const clients = ClientService.GetClientByDoctor('Bác sĩ A');
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

    const handleAdd = () => {
        handleOpenAddClientForm();
    };

    const handleUpdateStatus = () => {

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
                                    color="primary"
                                    children="Khám xong"
                                    iconName="edit"
                                    disabled={selectedRow === null || selectedRow.status === 'Đang chờ'}
                                    onClick={handleUpdateStatus}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    color="success"
                                    children="Gọi vào khám"
                                    iconName="add"
                                    disabled={selectedRow === null || selectedRow.status === 'Đang khám'}
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
        </React.Fragment>
    );
};

ClientTable.propTypes = {
    className: PropTypes.string
};

export default ClientTable;
