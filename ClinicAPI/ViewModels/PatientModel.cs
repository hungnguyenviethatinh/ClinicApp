using DAL.Core;
using System;

namespace ClinicAPI.ViewModels
{
    public class PatientModel
    {
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string Address { get; set; }
        public string Job { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        public DateTime AppointmentDate { get; set; }
        public PatientStatus Status { get; set; }

        public string DoctorId { get; set; }
    }
}
