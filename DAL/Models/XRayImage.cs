using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class XRayImage
    {
        public int Id { get; set; }
        public string Image { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }
    }
}
