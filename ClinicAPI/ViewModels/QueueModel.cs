using DAL.Core;
using DAL.Models;

namespace ClinicAPI.ViewModels
{
    public class QueueViewModel
    {
        public int Order { get; set; }
        public Patient Patient { get; set; }
        public User Doctor { get; set; }
        public QueueStatus StatusCode { get; set; }
    }

    public class QueueEditModel
    {
        public string PatientID { get; set; }
        public string DoctorID { get; set; }
    }

    public class QueueUpdateModel
    {
        public string DoctorID { get; set; }
        public QueueStatus StatusCode { get; set; }
    }
}
