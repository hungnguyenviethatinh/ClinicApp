namespace DAL.Models
{
    public class DoctorPatient
    {
        public string DoctorId { get; set; }
        public virtual User Doctor { get; set; }
        public int PatientId { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
