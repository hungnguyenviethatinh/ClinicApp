﻿using DAL.Core;

namespace ClinicAPI.ViewModels
{
    public class PrescriptionModel
    {
        public string IdCode { get; set; }
        public string Diagnosis { get; set; }
        public string OtherDiagnosis { get; set; }
        public string Note { get; set; }
        public PrescriptionStatus Status { get; set; }

        public int PatientId { get; set; }
        //public string DoctorId { get; set; }
        public int HistoryId { get; set; }
    }

    public class PrescriptionMedicineModel
    {
        public int PrescriptionId { get; set; }
        public int MedicineId { get; set; }

        public string Ingredient { get; set; }
        public string NetWeight { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }

        public string TakePeriod { get; set; }
        public string TakeMethod { get; set; }
        public int TakeTimes { get; set; }
        public int? AmountPerTime { get; set; }
        public int? AfterBreakfast { get; set; }
        public int? AfterLunch { get; set; }
        public int? Afternoon { get; set; }
        public int? AfterDinner { get; set; }
        public string Note { get; set; }
    }
}
