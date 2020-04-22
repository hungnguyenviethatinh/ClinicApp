using System;
namespace ClinicAPI.ViewModels.ServiceForm
{
    public class XqFormModel
    {
        // Phiếu chụp X Quang
        // Yêu cầu
        public string Request { get; set; }
        // Ghi chú
        public string Note { get; set; }
    }

    public class XqFormAddModel : XqFormModel
    {
        // Chẩn đoán
        public string DiagnosisName { get; set; }
        // Ngày kê đơn
        public DateTime DateCreated { get; set; }

        public int PatientId { get; set; }
        public string DoctorId { get; set; }
        public int HistoryId { get; set; }
    }

    public class XqFormViewModel : XqFormModel
    {
        public int Id { get; set; }
        // Chẩn đoán
        public string DiagnosisName { get; set; }
        // Ngày kê đơn
        public DateTime DateCreated { get; set; }

        public int PatientId { get; set; }
        public PatientBasicViewModel Patient { get; set; }
        public string DoctorId { get; set; }
        public DoctorViewModel Doctor { get; set; }
    }

    public class XqFormUpdateModel : XqFormModel
    {
        // Chẩn đoán
        public string DiagnosisName { get; set; }
        // Ngày kê đơn
        public DateTime DateCreated { get; set; }
    }
}
