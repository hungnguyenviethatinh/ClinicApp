namespace ClinicApp.Models
{
    public class Medicine
    {
        public string MedicineName { get; set; }
        public string Ingredient { get; set; }
        public string NetWeight { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public int Price { get; set; }
        public string TakePeriod { get; set; }
        public string TakeMethod { get; set; }
        public int TakeTimes { get; set; }
        public int? AmountPerTime { get; set; }
        public int? AfterBreakfast { get; set; }
        public int? AfterLunch { get; set; }
        public int? Afternoon { get; set; }
        public int? AfterDinner { get; set; }
        public string MealTime { get; set; }
        public string Note { get; set; }
    }
}
