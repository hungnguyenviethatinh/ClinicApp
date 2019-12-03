﻿namespace DAL.Core
{
    public static class ClaimConstants
    {
        public const string Subject = "sub";

        public const string Permission = "permission";
    }

    public static class PropertyConstants
    {
        public const string FullName = "fullname";
    }

    public static class ScopeConstants
    {
        public const string Roles = "roles";
    }

    public static class RoleConstants
    {
        public const string AdministratorRoleName = "Administrator";

        public const string ReceptionistRoleName = "Receptionist";
        
        public const string DoctorRoleName = "Doctor";
    }

    public static class GenderConstants
    {
        public const string None = "Khác";
        
        public const string Male = "Nam";

        public const string Female = "Nữ";
    }

    public static class PatientStatusConstants
    {
        public const string IsNew = "Mới";

        public const string IsAppointed = "Đặt lịch hẹn";

        public const string IsChecking = "Đang khám";

        public const string IsChecked = "Đã khám";

        public const string IsRechecking = "Tái khám";
    }

    public static class PrescriptionStatusConstants
    {
        public const string IsNew = "Mới";

        public const string IsPending = "Đang hoãn";

        public const string IsPrinted = "Đã in";
    }
}