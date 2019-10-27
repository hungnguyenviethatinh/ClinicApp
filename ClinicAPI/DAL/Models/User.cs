using ClinicAPI.DAL.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace ClinicAPI.DAL.Models
{
    public class User : IAuditableEntity
    {
        public Guid ID { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public virtual ICollection<UserRole> Roles { get; }
    }
}
