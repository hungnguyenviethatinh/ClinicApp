namespace DAL.Models.ServiceForm
{
    public class MriForm : BaseForm
    {
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
}
