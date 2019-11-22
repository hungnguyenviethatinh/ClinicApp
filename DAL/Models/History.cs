using System;
using System.Collections.Generic;
using System.Text;
using DAL.Models.Interfaces;

namespace DAL.Models
{
    public class History : IAuditableEntity
    {
        public int ID { get; set; }
        public string DoctorID { get; set; }
        public string PatientID { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public virtual ICollection<Prescription> Prescriptions { get; }
    }
}
