using DAL.Core;
using System;

namespace ClinicAPI.ViewModels.ServiceForm
{
    public class MriFormModel
    {
        public string IdCode { get; set; }
        // Chẩn đoán
        public string DiagnosisName { get; set; }
        // Ngày kê đơn
        public DateTime DateCreated { get; set; }
        public PrescriptionStatus Status { get; set; }

        // Phiếu chỉ định MRI scan
        // Sọ não
        public bool IsSkull { get; set; }
        // Phần mềm đầu và cổ
        public bool IsHeadNeck { get; set; }
        // Ngực
        public bool IsChest { get; set; }
        // Bụng và chậu
        public bool IsStomachGroin { get; set; }
        // Chi
        public bool IsLimbs { get; set; }
        // Cột sống cổ
        public bool IsNeckSpine { get; set; }
        // Cột sống ngực
        public bool IsChestSpine { get; set; }
        // Cột sống thắt lưng
        public bool IsPelvisSpine { get; set; }
        // Mạch máu
        public bool IsBloodVessel { get; set; }
        // Yêu cầu khác
        public bool IsOther { get; set; }
        public string Other { get; set; }
        // Dùng chất đối quang
        public bool IsContrastAgent { get; set; }
    }

    public class MriFormAddModel : MriFormModel
    {
        public int PatientId { get; set; }
        public int HistoryId { get; set; }
    }

    public class MriFormViewModel : MriFormModel
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public PatientPartialViewModel Patient { get; set; }
        public string DoctorId { get; set; }
        public DoctorViewModel Doctor { get; set; }
    }

    public class MriFormUpdateModel : MriFormModel
    {
    }
}
