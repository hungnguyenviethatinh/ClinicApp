using DAL.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class Prescription : IAuditableEntity
    {
        public string ID { get; set; }
        public string TypeCode { get; set; }
        public string DoctorID { get; set; }
        public string PatientID { get; set; }
        public int HistoryID { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public virtual ICollection<Drug> Drugs { get; }
        public virtual ICollection<Request> Requests { get; }
    }
}
