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

import { InvoiceService } from '../../../services';

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
    { title: 'No', type: 'numeric', field: 'id', defaultSort: 'asc' },
    { title: 'Người kê đơn', field: 'doctor' },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => <CustomStatusBullet status={rowData.status} />,
    },
];

const InvoiceTable = props => {
    const { className, ...rest } = props;
    const classes = useStyles();

    const [data, setData] = React.useState([]);
    const getInvoices = () => {
        const invoices = InvoiceService.GetInvoiceByDoctor('Bác sĩ A');
        setData(invoices);
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

    const handleDelete = () => {

    };

    const handleEdit = () => {

    };

    React.useEffect(() => {
        getInvoices();
    }, []);

    return (
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
                title="DANH SÁCH ĐƠN THUỐC"
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
    );
};

InvoiceTable.propTypes = {
    className: PropTypes.string
};

export default InvoiceTable;
