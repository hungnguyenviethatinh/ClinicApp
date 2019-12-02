using System;

namespace ClinicAPI.ViewModels
{
    public class XRayModel
    {
        public string Name { get; set; }
        public string Data { get; set; }
        public DateTime LastModifiedDate { get; set; }

        public int HistoryId { get; set; }

        public int PatientId { get; set; }
    }
}
