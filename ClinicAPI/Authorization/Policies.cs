﻿namespace ClinicAPI.Authorization
{
    public class Policies
    {
        public const string ViewAllUsersPolicy = "View All Users";
        public const string ManageAllUsersPolicy = "Manage All Users";

        public const string ViewAllRolesPolicy = "View All Roles";
        public const string ManageAllRolesPolicy = "Manage All Roles";
        public const string AssignAllRolesPolicy = "Assign All Roles";

        public const string ViewAllPatientsPolicy = "View All Patients";
        public const string ManageAllPatientsPolicy = "Manage All Patients";

        public const string ViewAllPrescriptionsPolicy = "View All Prescriptions";
        public const string ManageAllPrescriptionsPolicy = "Manage All Prescriptions";

        public const string ViewAllDrugsPolicy = "View All Drugs";
        public const string ManageAllDrugsPolicy = "Manage All Drugs";
    }
}
