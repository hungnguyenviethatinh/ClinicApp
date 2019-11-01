import React from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Button,
    Divider
} from '@material-ui/core';

import Table from '../../_shared/table';
import CustomStatusBullet from '../../_shared/customstatusbullet';

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

const DoctorTable = props => {
    const { className, ...rest } = props;
    const classes = useStyles();

    const [data, setData] = React.useState([]);
    const getInvoices = () => {
        const invoices = InvoiceService.GetInvoiceByStatus('Chưa in');
        setData(invoices);
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
                    <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                    >
                        New entry
                </Button>
                }
                title="DANH SÁCH ĐƠN THUỐC"
            />
            <Divider />
            <CardContent className={classes.content}>
                <PerfectScrollbar>
                    <Table
                        columns={columns}
                        data={data}
                    />
                </PerfectScrollbar>
            </CardContent>
        </Card>
    );
};

DoctorTable.propTypes = {
    className: PropTypes.string
};

export default DoctorTable;
