import React from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Divider
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

import Table from '../../_shared/table';
import CustomStatusBullet from '../../_shared/customstatusbullet';
import Button from '../../_shared/routerlinkbutton';

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
                        title="Xem tất cả"
                        href="/invoice"
                        icon={<VisibilityIcon />}
                    />
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

InvoiceTable.propTypes = {
    className: PropTypes.string
};

export default InvoiceTable;
