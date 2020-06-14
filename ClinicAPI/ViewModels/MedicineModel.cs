using DAL.Core;

namespace ClinicAPI.ViewModels
{
    public class MedicineModel
    {
        public string Name { get; set; }
        public string IdCode { get; set; }
        public string ExpiredDate { get; set; }
        public string NetWeight { get; set; }
        public int? Quantity { get; set; }
        public string Unit { get; set; }
    }

    public class MedicinePartialViewModel : MedicineModel
    {
        public int Id { get; set; }
        public MedicineStatus Status { get; set; }
    }

    public class MedicineViewModel : MedicineModel
    {
        public int Id { get; set; }
        public string Ingredient { get; set; }
        public MedicineStatus Status { get; set; }
    }

    public class MedicineUpdateModel
    {
        public int Id { get; set; }
        public int? Quantity { get; set; }
    }

    public class MedicineRestoreModel : MedicineUpdateModel
    {
    }

    public class MedicineOptionModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Ingredient { get; set; }
        public string NetWeight { get; set; }
        public int? Quantity { get; set; }
        public string Unit { get; set; }
    }
}
