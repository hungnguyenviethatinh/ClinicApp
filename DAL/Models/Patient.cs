using DAL.Core;
using DAL.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class Patient : IAuditableEntity
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string Address { get; set; }
        public string Job { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        public DateTime? AppointmentDate { get; set; }
        public PatientStatus Status { get; set; }

        public string DoctorId { get; set; }
        public User Doctor { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public ICollection<History> Histories { get; set; }
        public ICollection<Prescription> Prescriptions { get; set; }
        public ICollection<XRayImage> XRayImages { get; set; }
    }
}
