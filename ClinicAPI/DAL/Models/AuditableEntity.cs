using ClinicAPI.DAL.Models.Interfaces;
using System;

namespace ClinicAPI.DAL.Models
{
    public class AuditableEntity : IAuditableEntity
    {
        public DateTime UpdatedDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
