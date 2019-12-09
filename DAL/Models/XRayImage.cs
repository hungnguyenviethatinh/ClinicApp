using System;

namespace DAL.Models
{
    public class XRayImage
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Data { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public bool IsDeleted { get; set; }

        public int HistoryId { get; set; }
        public History History { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }
    }
}
