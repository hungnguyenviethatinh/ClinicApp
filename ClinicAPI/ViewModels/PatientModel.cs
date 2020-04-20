using DAL.Core;
using System;
using System.Collections.Generic;

namespace ClinicAPI.ViewModels
{
    public class PatientModel
    {
        public string IdCode { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public Gender Gender { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string RelativePhoneNumber { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public DateTime CheckedDate { get; set; }
        public PatientStatus Status { get; set; }
    }

    public class PatientHistoryUpdateModel
    {
        public DateTime? AppointmentDate { get; set; }
        public PatientStatus Status { get; set; }
    }

    public class PatientViewModel : PatientModel
    {
        public int Id { get; set; }
        public int OrderNumber { get; set; }

        public IEnumerable<DoctorPatientHistoryViewModel> Doctors { get; set; }
    }

    public class PatientBasicViewModel
    {
        public int Id { get; set; }
        public string FullName { get; set; }
    }

    public class PatientPartialViewModel : PatientModel
    {
        public int Id { get; set; }
    }
}
