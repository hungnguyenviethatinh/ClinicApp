namespace ClinicAPI.ViewModels
{
    public class HistoryModel
    {
        public string HeartBeat { get; set; }
        public string BloodPresure { get; set; }
        public string Pulse { get; set; }
        public bool IsChecked { get; set; }

        public string DoctorId { get; set; }

        public int PatientId { get; set; }
    }
}
