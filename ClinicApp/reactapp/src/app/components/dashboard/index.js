import React from 'react';

import AdminDashboard from './admin';
import DoctorDashboard from './doctor';
import ReceptionistDashboard from './receptionist';

import { ROLES } from '../../configs';
import { UserService } from '../../services';

const Dashboard = () => {
    const [admin, setAdmin] = React.useState(false);
    const [doctor, setDoctor] = React.useState(false);
    const [receptionist, setReceptionist] = React.useState(false);

    const setRole = () => {
        const user = UserService.GetCurrentUser();
        const role = user.role;
        switch (role) {
            case ROLES.ADMIN:
                setAdmin(true);
                break;
            case ROLES.DOCTOR:
                setDoctor(true);
                break;
            case ROLES.RECEPTIONIST:
                setReceptionist(true);
                break;
            default:
                break;
        }
    }

    React.useEffect(() => {
        setRole();
    }, []);

    return (
        <React.Fragment>
            {admin && <AdminDashboard />}
            {doctor && <DoctorDashboard />}
            {receptionist && <ReceptionistDashboard />}
        </React.Fragment>
    );
}

export default Dashboard;
