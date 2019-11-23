using DAL.Core;
using DAL.Models.Interfaces;
using System;

namespace DAL.Models
{
    public class Queue : IAuditableEntity
    {
        public int ID { get; set; }
        public string PatientID { get; set; }
        public string DoctorID { get; set; }
        public QueueStatus StatusCode { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
