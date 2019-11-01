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

import { DoctorServie } from '../../../services';

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0
    },
}));

const columns = [
    { title: 'Họ và Tên', field: 'name', defaultSort: 'asc' },
    {
        title: 'Trạng thái', field: 'status',
        render: rowData => <CustomStatusBullet status={rowData.status} />,
    },
];

const DoctorTable = props => {
    const { className, ...rest } = props;
    const classes = useStyles();

    const [data, setData] = React.useState([]);
    const getDoctors = () => {
        const doctors = DoctorServie.GetDoctor();
        setData(doctors);
    };

    React.useEffect(() => {
        getDoctors();
    }, []);

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardHeader
                title="DANH SÁCH BÁC SĨ"
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
