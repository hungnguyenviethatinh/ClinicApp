namespace DAL.Core
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
        public const string AdministratorRoleName = "Quản trị viên";

        public const string ReceptionistRoleName = "Lễ tân";
        
        public const string DoctorRoleName = "Bác sĩ";
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

        public const string IsToAddDocs = "BS Hồ Sơ";
    }

    public static class PrescriptionStatusConstants
    {
        public const string IsNew = "Mới";

        public const string IsPending = "Đang hoãn";

        public const string IsPrinted = "Đã in";
    }

    public static class MedicineStatusConstants
    {
        public const string Yes = "Còn";

        public const string No = "Hết";
    }

    public static class PeriodConstants
    {
        public const string Day = "DAY";

        public const string Week = "WEEK";

        public const string Month = "MONTH";
    }

    public static class FindMedicineByConstants
    {
        public const string IdCode = "IdCode";

        public const string Name = "Name";

        //public const string ShortName = "ShortName";
        public const string ExpiredDate = "ExpiredDate";

        public const string Ingredient = "Ingredient";
    }
}
