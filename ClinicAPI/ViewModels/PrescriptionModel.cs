using DAL.Core;

namespace ClinicAPI.ViewModels
{
    public class PrescriptionModel
    {
        public string Diagnosis { get; set; }
        public PrescriptionStatus Status { get; set; }

        public int PatientId { get; set; }
        public string DoctorId { get; set; }
        public int HistoryId { get; set; }
    }

    public class PrescriptionMedicineModel
    {
        public int PrescriptionId { get; set; }
        public int MedicineId { get; set; }

        public int Quantity { get; set; }
        public int Unit { get; set; }
        public decimal Price { get; set; }

        public int TimesPerDay { get; set; }
        public int? AfterBreakfast { get; set; }
        public int? AfterLunch { get; set; }
        public int? AfterDinner { get; set; }
        public string Note { get; set; }
    }
}
