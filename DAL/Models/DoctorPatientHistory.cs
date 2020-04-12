using DAL.Models.Interfaces;
using System;

namespace DAL.Models
{
    public class DoctorPatientHistory : IAuditableEntity
    {
        public string DoctorId { get; set; }
        public virtual User Doctor { get; set; }

        public int PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        public int HistoryId { get; set; }
        public virtual History History { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
