﻿using System;
using System.Collections.Generic;
using DAL.Models.Interfaces;

namespace DAL.Models
{
    public class History : IAuditableEntity
    {
        public int Id { get; set; }
        public string HeartBeat { get; set; }
        public string BloodPresure { get; set; }
        public string Pulse { get; set; }
        public bool IsChecked { get; set; }
        
        public string DoctorId { get; set; }
        public User Doctor { get; set; }
        
        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public ICollection<Prescription> Prescriptions { get; set; }
        public ICollection<XRayImage> XRayImages { get; set; }
    }
}