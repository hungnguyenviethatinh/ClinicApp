using DAL.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class Medicine : IAuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public ICollection<PrescriptionMedicine> PrescriptionMedicines { get; set; }
    }
}
