using System.Collections.Generic;
using System.Linq;
using System.Collections.ObjectModel;

namespace DAL.Core
{
    public static class ApplicationPermissions
    {
        public static ReadOnlyCollection<ApplicationPermission> AllPermissions;

        public const string AdminPermissionGroupName = "Administrator Permissions";
        public static ApplicationPermission AdminPermissions = new ApplicationPermission("Administrator Permissions", "administrator", AdminPermissionGroupName);

        public const string DoctorPermissionGroupName = "Doctor Permissions";
        public static ApplicationPermission DoctorPermissions = new ApplicationPermission("Doctor Permissions", "doctor", DoctorPermissionGroupName);

        public const string ReceptionistPermissionGroupName = "Receptionist Permissions";
        public static ApplicationPermission ReceptionistPermissions = new ApplicationPermission("Receptionist Permissions", "receptionist", ReceptionistPermissionGroupName);

        static ApplicationPermissions()
        {
            List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
            {
                AdminPermissions,
                DoctorPermissions,
                ReceptionistPermissions
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
            return new string[] { AdminPermissions };
        }

        public static string[] GetDoctorPermissionValues()
        {
            return new string[] { DoctorPermissions };
        }

        public static string[] GetReceptionistPermissionValues()
        {
            return new string[] { ReceptionistPermissions };
        }
    }

    public class ApplicationPermission
    {
        public ApplicationPermission()
        { }

        public ApplicationPermission(string name, string value, string groupName)
        {
            Name = name;
            Value = value;
            GroupName = groupName;
        }

        public string Name { get; set; }
        public string Value { get; set; }
        public string GroupName { get; set; }

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
