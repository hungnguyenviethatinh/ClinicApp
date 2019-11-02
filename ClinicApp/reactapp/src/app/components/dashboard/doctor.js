import React from 'react';
import { Grid } from '@material-ui/core';
import { ClientTable, InvoiceTable } from './tabledoctor';

const DoctorDashboard = () => {
    return (
        <Grid container spacing={3} >
            <Grid item lg={12} md={12} xl={12} sm={12} xs={12} >
                <ClientTable />
            </Grid>
            <Grid item lg={12} md={12} xl={12} sm={12} xs={12} >
                <InvoiceTable />
            </Grid>
        </Grid>
    );
}

export default DoctorDashboard;
