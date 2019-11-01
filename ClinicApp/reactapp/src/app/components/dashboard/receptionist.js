import React from 'react';
import { Grid } from '@material-ui/core';

import { ClientCard, DoctorCard, InvoiceCard } from './card';
import { ClientTable, DoctorTable, InvoiceTable } from './table';

const ReceptionistDashboard = () => {

    return (
        <Grid container spacing={3} >
            <Grid item lg={4} sm={4} md={4} xl={4} xs={12} >
                <ClientCard />
            </Grid>
            <Grid item lg={4} sm={4} md={4} xl={4} xs={12} >
                <DoctorCard />
            </Grid>
            <Grid item lg={4} sm={4} md={4} xl={4} xs={12} >
                <InvoiceCard />
            </Grid>
            <Grid item lg={12} md={12} xl={12} sm={12} xs={12} >
                <ClientTable />
            </Grid>
            <Grid item lg={4} md={4} xl={4} sm={12} xs={12} >
                <DoctorTable />
            </Grid>
            <Grid item lg={8} sm={8} md={8} xl={12} xs={12} >
                <InvoiceTable />
            </Grid>
        </Grid>
    );
}

export default ReceptionistDashboard;
