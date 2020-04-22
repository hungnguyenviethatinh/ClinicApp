using DAL.Core;
using DAL.Models.Interfaces;
using DAL.Models.ServiceForm;
using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class Patient : IAuditableEntity
    {
        public int Id { get; set; }
        public string IdCode { get; set; }
        public int OrderNumber { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public Gender Gender { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string RelativePhoneNumber { get; set; }

        public DateTime? AppointmentDate { get; set; }
        public DateTime CheckedDate { get; set; }
        public PatientStatus Status { get; set; }
        public bool IsDeleted { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public virtual ICollection<History> Histories { get; set; }
        public virtual ICollection<Prescription> Prescriptions { get; set; }
        public virtual ICollection<CtForm> CtForms { get; set; }
        public virtual ICollection<MriForm> MriForms { get; set; }
        public virtual ICollection<TestForm> TestForms { get; set; }
        public virtual ICollection<XqForm> XqForms { get; set; }
        public virtual ICollection<XRayImage> XRayImages { get; set; }
        public virtual ICollection<DoctorPatientHistory> Doctors { get; set; }
    }
}
