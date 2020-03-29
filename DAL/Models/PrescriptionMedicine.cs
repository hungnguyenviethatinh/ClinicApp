namespace DAL.Models
{
    public class PrescriptionMedicine
    {
        public int PrescriptionId { get; set; }
        public virtual Prescription Prescription { get; set; }
        public int MedicineId { get; set; }
        public virtual Medicine Medicine { get; set; }

        public string Ingredient { get; set; }

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

        public bool IsDeleted { get; set; }
    }
}
