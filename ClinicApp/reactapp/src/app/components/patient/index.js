import React from 'react';
import { Grid } from '@material-ui/core';
import PatientTable from './patienttable';

const Patient = () => {
    return (
        <Grid container spacing={3} >
            <Grid item lg={12} md={12} xl={12} sm={12} xs={12} >
                <PatientTable />
            </Grid>
        </Grid>
    );
}

export default Patient;
