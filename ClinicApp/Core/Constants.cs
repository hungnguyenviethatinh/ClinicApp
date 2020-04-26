namespace ClinicApp.Core
{
    public static class KeyConstants
    {
        public const string ApiUrlKey = "DRKHOACLINICAPP_APIURL";
        public const string SecretKey = "DRKHOACLINICAPP_SECRET";
        public const string DebuggingModeKey = "DEBUGGINGMODE";
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
        public const string IsRechecking = "Tái khám";
        public const string IsToAddDocs = "BS Hồ Sơ";
    }

    public static class TakePeriodConstants
    {
        public const string Day = "Ngày";
        public const string Week = "Tuần";
        public const string Month = "Tháng";
    }

    public static class CtRequestTypeConstants
    {
        public const string Normal = "Thường";
        public const string Urgent = "Khẩn";
        public const string Emergency = "Khẩn cấp";
    }
}
