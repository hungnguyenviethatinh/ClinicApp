namespace DAL.Core
{
    public enum Gender
    {
        None,
        Female,
        Male,
    }

    public enum UserStatus
    {
        InActive,
        Active,
    }

    public enum PatientStatus
    {
        New,
        Old,
    }

    public enum QueueStatus
    {
        Waiting,
        Checking,
    }

    public enum PrescriptionStatus
    {
        New,
        Pending,
        Printed,
    }

    public enum PrescriptionType
    {
        Prescription,
        Request,
    }
}
