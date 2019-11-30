import React from 'react';

import { ReceptionistView } from './Receptionist';
import { DoctorView } from './Doctor';
import { AdminView } from './Admin';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <React.Fragment>
            { user.role === 'admin' && <AdminView /> }
            { user.role === 'letan' && <ReceptionistView /> }
            { user.role === 'bacsi' && <DoctorView /> }
        </React.Fragment>
    );
}

export default Dashboard;
