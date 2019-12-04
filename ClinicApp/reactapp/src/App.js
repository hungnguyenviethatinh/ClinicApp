import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { Dashboard as DashboardView } from './views/Dashboard';
import { Login as LoginView } from './views/Login';
import { PatientsView, PatientDetailView } from './views/Patients';
import { PatientMangementView } from './views/PatientManagement';
import { PrescriptionsView, PrescriptionDetailView } from './views/Prescriptions';
import { PrescriptionManagementView } from './views/PrescriptionManagement';
import { UserManagementView } from './views/UserManagement';
import { DrugManagementView } from './views/DrugManagement';
import { StatisticsView } from './views/Statistics';
import { UserView } from './views/User';

import { PrivateRoute } from './components/PrivateRoute';

const App = () => {
    return (
        <Router>
            <Switch>
                <Redirect exact from="/" to="/dashboard" />
                <PrivateRoute exact path="/dashboard" component={DashboardView} />
                <PrivateRoute exact path="/patients" component={PatientsView} />
                <PrivateRoute exact path="/patient/:id" component={PatientDetailView} />
                <PrivateRoute exact path="/patient-management" component={PatientMangementView} />
                <PrivateRoute exact path="/prescriptions" component={PrescriptionsView} />
                <PrivateRoute exact path="/prescription/:id" component={PrescriptionDetailView} />
                <PrivateRoute exact path="/prescription-management" component={PrescriptionManagementView} />
                <PrivateRoute exact path="/user-management" component={UserManagementView} />
                <PrivateRoute exact path="/drug-management" component={DrugManagementView} />
                <PrivateRoute exact path="/statistics" component={StatisticsView} />
                <PrivateRoute exact path="/account/me" component={UserView} />
                <Route exact path="/login" component={LoginView} />
                <Redirect to="/dashboard" />
            </Switch>
        </Router>
    );
}

export default App;
