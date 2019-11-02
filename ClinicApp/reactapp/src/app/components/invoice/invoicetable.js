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
import PrintForm from './printform';

import { InvoiceService } from '../../services';

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
        const invoices = InvoiceService.GetInvoice();
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

    const handlePrint = () => {
        setOpen(true);
    };

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    }

    React.useEffect(() => {
        getInvoices();
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
                                    color="warning"
                                    children="In"
                                    iconName="print"
                                    disabled={selectedRow === null}
                                    onClick={handlePrint}
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
            <PrintForm
                open={open}
                handleClose={handleClose}
                value={selectedRow? selectedRow : { }}
            />
        </React.Fragment>
    );
};

InvoiceTable.propTypes = {
    className: PropTypes.string
};

export default InvoiceTable;
