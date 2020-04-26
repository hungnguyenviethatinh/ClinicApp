using ClinicApp.Models;
using System;

namespace ClinicApp.ViewModels
{
    public class XqFormViewModel
    {
        public string IdCode { get; set; }
        // Chẩn đoán
        public string DiagnosisName { get; set; }
        // Ngày kê đơn
        public DateTime DateCreated { get; set; }

        // Phiếu chụp X Quang
        // Yêu cầu
        public string Request { get; set; }
        // Ghi chú
        public string Note { get; set; }
        public Doctor Doctor { get; set; }
        public Patient Patient { get; set; }
    }
}
