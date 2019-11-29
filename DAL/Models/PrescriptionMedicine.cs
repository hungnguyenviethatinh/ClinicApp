using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class PrescriptionMedicine
    {
        public int PrescriptionId { get; set; }
        public int MedicineId { get; set; }
        public Medicine Medicine { get; set; }

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
