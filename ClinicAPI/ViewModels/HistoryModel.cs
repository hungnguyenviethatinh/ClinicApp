using DAL.Models;
using System;
using System.Collections.Generic;

namespace ClinicAPI.ViewModels
{
    public class HistoryModel
    {
        public string Height { get; set; }
        public string Weight { get; set; }
        public string BloodPresure { get; set; }
        public string Pulse { get; set; }
        public bool IsChecked { get; set; }

        public string DoctorId { get; set; }
        public int PatientId { get; set; }
    }

    public class HistoryViewModel
    {
        public int Id { get; set; }
        public string Height { get; set; }
        public string Weight { get; set; }
        public string BloodPresure { get; set; }
        public string Pulse { get; set; }
        public bool IsChecked { get; set; }
        public string DoctorId { get; set; }
        public User Doctor { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public List<Prescription> Prescriptions { get; }
        public List<XRayImage> XRayImages { get; }
    }
}
