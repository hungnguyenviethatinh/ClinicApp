using System;
using System.Collections.Generic;
using DAL.Models.Interfaces;
using DAL.Models.ServiceForm;

namespace DAL.Models
{
    public class History : IAuditableEntity
    {
        public int Id { get; set; }
        public string Height { get; set; }
        public string Weight { get; set; }
        public string BloodPressure { get; set; }
        public string Pulse { get; set; }
        public string Other { get; set; }
        public string Note { get; set; }
        public DateTime CheckedDate { get; set; }
        public bool IsChecked { get; set; }

        public int PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public virtual ICollection<Prescription> Prescriptions { get; set; }
        public virtual ICollection<CtForm> CtForms { get; set; }
        public virtual ICollection<MriForm> MriForms { get; set; }
        public virtual ICollection<TestForm> TestForms { get; set; }
        public virtual ICollection<XqForm> XqForms { get; set; }
        public virtual ICollection<XRayImage> XRayImages { get; set; }
        public virtual ICollection<DoctorPatientHistory> Doctors { get; set; }
    }
}
