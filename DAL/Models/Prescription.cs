using DAL.Core;
using DAL.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class Prescription : IAuditableEntity
    {
        public int Id { get; set; }

        public string Diagnosis { get; set; }
        public string Note { get; set; }
        public PrescriptionStatus Status { get; set; }
        public bool IsDeleted { get; set; }

        public int PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        public string DoctorId { get; set; }
        public virtual User Doctor { get; set; }

        public int HistoryId { get; set; }
        public virtual History History { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public virtual ICollection<PrescriptionMedicine> Medicines { get; set; }
    }
}
