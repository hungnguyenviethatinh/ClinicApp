namespace DAL.Models
{
    public class PrescriptionMedicine
    {
        public int PrescriptionId { get; set; }
        public virtual Prescription Prescription { get; set; }
        public int MedicineId { get; set; }
        public virtual Medicine Medicine { get; set; }

        public int Quantity { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }

        public int TimesPerDay { get; set; }
        public int? AfterBreakfast { get; set; }
        public int? AfterLunch { get; set; }
        public int? Afternoon { get; set; }
        public int? AfterDinner { get; set; }
        public string Note { get; set; }

        public bool IsDeleted { get; set; }
    }
}
