using DAL.Models.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class User : IdentityUser, IAuditableEntity
    {
        public string FullName { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public virtual ICollection<IdentityUserRole<string>> Roles { get; set; }
        public virtual ICollection<IdentityUserClaim<string>> Claims { get; set; }

        //public virtual ICollection<Patient> Patients { get; set; }
        public virtual ICollection<DoctorPatientHistory> Patients { get; set; }
        public virtual ICollection<Prescription> Prescriptions { get; set; }
        //public virtual ICollection<History> Histories { get; set; }
        //public virtual ICollection<DoctorPatientHistory> Histories { get; set; }

    }
}
