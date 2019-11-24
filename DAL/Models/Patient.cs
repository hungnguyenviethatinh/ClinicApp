using DAL.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class Patient : IAuditableEntity
    {
        public string ID { get; set; }
        public string FullName { get; set; }
        public int YearOfBirth { get; set; }
        public virtual int Age
        {
            get
            {
                return DateTime.Now.Year - YearOfBirth;
            }
        }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Job { get; set; }
        public string DoctorID { get; set; }
        public int StatusCode { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public virtual ICollection<History> Histories  { get; }
        public virtual ICollection<Photo> Photos { get; }
        public virtual ICollection<Prescription> Prescriptions { get; set; }
    }
}
