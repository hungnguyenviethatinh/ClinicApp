namespace ClinicAPI.ViewModels
{
    public class DoctorPatientHistoryModel
    {
        public string DoctorId { get; set; }
        public int PatientId { get; set; }
        public int HistoryId { get; set; }
    }

    public class DoctorPatientHistoryViewModel
    {
        public DoctorViewModel Doctor { get; set; }
    }
}
