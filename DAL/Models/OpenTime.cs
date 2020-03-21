using DAL.Models.Interfaces;
using System;

namespace DAL.Models
{
    public class OpenTime : IAuditableEntity
    {
        public int Id { get; set; }
        public string OpenClosedTime { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
