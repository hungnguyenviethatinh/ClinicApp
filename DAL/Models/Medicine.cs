using DAL.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace DAL.Models
{
    public class Medicine : IAuditableEntity
    {
        public int Id { get; set; }
        public string IdCode { get; set; }
        public string Name { get; set; }
        public string ExpiredDate { get; set; }
        public string NetWeight { get; set; }
        public int? Quantity { get; set; }
        public int? TotalQuantity { get; set; }
        public string Unit { get; set; }
        public bool IsDeleted { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public virtual ICollection<Ingredient> Ingredients { get; set; }
        public virtual ICollection<PrescriptionMedicine> Prescriptions { get; set; }
    }
}
