using ClinicAPI.DAL.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace ClinicAPI.DAL.Models
{
    public class Right : IAuditableEntity
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public virtual ICollection<RoleRight> Roles { get; }
    }
}
