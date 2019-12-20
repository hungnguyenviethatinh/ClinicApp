namespace ClinicApp.Models
{
    public class Medicine
    {
        public string MedicineName { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public int? TimesPerDay { get; set; }
        public int? AfterBreakfast { get; set; }
        public int? AfterLunch { get; set; }
        public int? Afternoon { get; set; }
        public int? AfterDinner { get; set; }
        public string Note { get; set; }
    }
}
