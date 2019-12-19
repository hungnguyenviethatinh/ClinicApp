using ClinicApp.Models;
using System.Collections.Generic;

namespace ClinicApp.ViewModels
{
    public class PrescriptionViewModel
    {
        public Doctor Doctor { get; set; }
        public Patient Patient { get; set; }
        public Prescription Prescription { get; set; }
        public List<Medicine> Medicines { get; set; }
    }
}
