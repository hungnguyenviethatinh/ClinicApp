using DAL.Core;

namespace ClinicAPI.ViewModels
{
    public class MedicineModel
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }
    }

    public class MedicineViewModel : MedicineModel
    {
        public MedicineStatus Status { get; set; }
    }
}
