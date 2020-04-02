namespace DAL.Models
{
    public class DoctorPatientHistory
    {
        public string DoctorId { get; set; }
        public virtual User Doctor { get; set; }
        public int PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public int HistoryId { get; set; }
        public virtual History History { get; set; }
    }
}
