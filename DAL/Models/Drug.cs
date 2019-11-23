using DAL.Models.Interfaces;
using System;

namespace DAL.Models
{
    public class Drug : IAuditableEntity
    {
        public int ID { get; set; }
        public string MedicineID { get; set; }
        public string PrescriptionID { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
