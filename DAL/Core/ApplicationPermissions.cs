using System.Collections.Generic;
using System.Linq;
using System.Collections.ObjectModel;

namespace DAL.Core
{
    public static class ApplicationPermissions
    {
        public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

        public const string UsersPermissionGroupName = "User Permissions";
        public static ApplicationPermission ViewUsers = new ApplicationPermission(
            "View Users",
            "users.view",
            UsersPermissionGroupName,
            "Permission to view other users account details");
        public static ApplicationPermission ManageUsers = new ApplicationPermission(
            "Manage Users",
            "users.manage",
            UsersPermissionGroupName,
            "Permission to create, delete and modify other users account details");

        public const string RolesPermissionGroupName = "Role Permissions";
        public static ApplicationPermission ViewRoles = new ApplicationPermission(
            "View Roles",
            "roles.view",
            RolesPermissionGroupName,
            "Permission to view available roles");
        public static ApplicationPermission ManageRoles = new ApplicationPermission(
            "Manage Roles",
            "roles.manage",
            RolesPermissionGroupName,
            "Permission to create, delete and modify roles");
        public static ApplicationPermission AssignRoles = new ApplicationPermission(
            "Assign Roles",
            "roles.assign",
            RolesPermissionGroupName,
            "Permission to assign roles to users");

        public const string PatientPermissionGroupName = "Patient Permissions";
        public static ApplicationPermission ViewPatients = new ApplicationPermission(
            "View Patients",
            "patients.view",
            PatientPermissionGroupName,
            "Permission to view patients details");
        public static ApplicationPermission ManagePatients = new ApplicationPermission(
            "Manage Patients",
            "patients.manage",
            PatientPermissionGroupName,
            "Permission to create, delete and modify patients details");

        public const string PrescriptionPermissionGroupName = "Prescription Permissions";
        public static ApplicationPermission ViewPrescriptions = new ApplicationPermission(
            "View Prescriptions",
            "prescriptions.view",
            PrescriptionPermissionGroupName,
            "Permission to view prescriptions details");
        public static ApplicationPermission ManagePrescriptions = new ApplicationPermission(
            "Manage Prescriptions",
            "prescriptions.manage",
            PrescriptionPermissionGroupName,
            "Permission to create, delete and modify prescriptions details");

        public const string MedicinePermissionGroupName = "Drug Permissions";
        public static ApplicationPermission ViewMedicines = new ApplicationPermission(
            "View Medicines",
            "medicines.view",
            MedicinePermissionGroupName,
            "Permission to view medicines details");
        public static ApplicationPermission ManageMedicines = new ApplicationPermission(
            "Manage Medicines",
            "medicines.manage",
            MedicinePermissionGroupName,
            "Permission to create, delete and modify medicines details");

        static ApplicationPermissions()
        {
            List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
            {
                ViewUsers,
                ManageUsers,

                ViewRoles,
                ManageRoles,
                AssignRoles,

                ViewPatients,
                ManagePatients,

                ViewPrescriptions,
                ManagePrescriptions,

                ViewMedicines,
                ManageMedicines,
            };

            AllPermissions = allPermissions.AsReadOnly();
        }

        public static ApplicationPermission GetPermissionByName(string permissionName)
        {
            return AllPermissions.Where(p => p.Name == permissionName).SingleOrDefault();
        }

        public static ApplicationPermission GetPermissionByValue(string permissionValue)
        {
            return AllPermissions.Where(p => p.Value == permissionValue).SingleOrDefault();
        }

        public static string[] GetAllPermissionValues()
        {
            return AllPermissions.Select(p => p.Value).ToArray();
        }

        public static string[] GetAdministrativePermissionValues()
        {
            return new string[] {
                ViewUsers,
                ManageUsers,

                ViewRoles,
                ManageRoles,
                AssignRoles,

                ViewPatients,

                ViewPrescriptions,

                ViewMedicines,
                ManageMedicines,
            };
        }

        public static string[] GetDoctorPermissionValues()
        {
            return new string[] {
                ViewPatients,

                ViewPrescriptions,
                ManagePrescriptions,
            };
        }

        public static string[] GetReceptionistPermissionValues()
        {
            return new string[] {
                ViewPatients,
                ManagePatients,

                ViewPrescriptions,
            };
        }
    }

    public class ApplicationPermission
    {
        public ApplicationPermission()
        { }

        public ApplicationPermission(string name, string value, string groupName, string description = null)
        {
            Name = name;
            Value = value;
            GroupName = groupName;
            Description = description;
        }

        public string Name { get; set; }
        public string Value { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }

        public override string ToString()
        {
            return Value;
        }

        public static implicit operator string(ApplicationPermission permission)
        {
            return permission.Value;
        }
    }
}
