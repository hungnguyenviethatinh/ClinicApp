import React from 'react';
import { Grid } from '@material-ui/core';
import InvoiceTable from './invoicetable';

const Invoice = () => {
    return (
        <Grid container spacing={3} >
            <Grid item lg={12} sm={12} md={12} xl={12} xs={12} >
                <InvoiceTable />
            </Grid>
        </Grid>
    );
}

export default Invoice;
