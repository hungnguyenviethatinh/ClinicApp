﻿using System;

namespace ClinicApp.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string IdCode { get; set; }
        public string FullName { get; set; }
        public int OrderNumber { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string AppointmentDate { get; set; }
    }
}
