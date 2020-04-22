using DAL.Models.Interfaces;
using System;

namespace DAL.Models.ServiceForm
{
    public class BaseForm : IAuditableEntity
    {
        public int Id { get; set; }
        // Chẩn đoán
        public string DiagnosisName { get; set; }
        // Ngày kê đơn
        public DateTime DateCreated { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public string DoctorId { get; set; }
        public User Doctor { get; set; }
        public int HistoryId { get; set; }
        public virtual History History { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
