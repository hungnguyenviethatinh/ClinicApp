namespace DAL.Core
{
    public enum Gender
    {
        None,
        Female,
        Male,
    }

    public enum PatientStatus
    {
        IsNew,
        IsAppointed,
        IsChecking,
        IsChecked,
        IsRechecking,
    }

    public enum PrescriptionStatus
    {
        IsNew,
        IsPending,
        IsPrinted,
    }
}
