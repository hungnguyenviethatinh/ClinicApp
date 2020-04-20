using System;
using System.Collections.Generic;

namespace ClinicAPI.ViewModels
{
    public class HistoryModel : HistoryPatchModel
    {
        public int PatientId { get; set; }
    }

    public class HistoryViewModel
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
    }

    public class HistoryFullViewModel : HistoryViewModel
    {
        public IEnumerable<PrescriptionViewModel> Prescriptions { get; set; }
        public IEnumerable<DoctorPatientHistoryViewModel> Doctors { get; set; }
        public IEnumerable<XRayViewModel> XRayImages { get; set; }
    }

    public class HistoryPatchModel
    {
        public string Height { get; set; }
        public string Weight { get; set; }
        public string BloodPressure { get; set; }
        public string Pulse { get; set; }
        public string Other { get; set; }
        public string Note { get; set; }
        public DateTime CheckedDate { get; set; }
        public bool IsChecked { get; set; }
    }
}
