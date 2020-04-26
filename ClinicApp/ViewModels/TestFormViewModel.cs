using ClinicApp.Models;
using System;

namespace ClinicApp.ViewModels
{
    public class TestFormViewModel
    {
        public string IdCode { get; set; }
        // Chẩn đoán
        public string DiagnosisName { get; set; }
        // Ngày kê đơn
        public DateTime DateCreated { get; set; }

        // Phiếu xét nghiệm
        // Bệnh phẩm
        // Máu
        public bool IsBloodSample { get; set; }
        // Nước tiểu
        public bool IsUrineSample { get; set; }

        // Mủ
        public bool IsPusSample { get; set; }
        // Đờm
        public bool IsSputumSample { get; set; }
        // Phân
        public bool IsShitSample { get; set; }
        // Dịch
        public string HumourSample { get; set; }
        // Huyết học
        // Nhóm máu
        public bool IsBloodGroup { get; set; }
        // Huyết đồ
        public bool IsBlood { get; set; }
        // Tốc độ máu
        public bool IsVS { get; set; }
        // KST sốt rét
        public bool IsFeverTest { get; set; }
        // Đông máu
        // TS
        public bool IsTs { get; set; }
        // TC
        public bool IsTc { get; set; }
        // PT (TQ)
        public bool IsPt { get; set; }
        // ATPP (TCK)
        public bool IsAtpp { get; set; }
        // Fibrinogen
        public bool IsFibrinogen { get; set; }
        // D-Dimer
        public bool IsDdimer { get; set; }
        // Miễn dịch
        // ASO
        public bool IsAso { get; set; }
        // CRP
        public bool IsCrp { get; set; }
        // RF
        public bool IsRf { get; set; }
        // ANA
        public bool IsAna { get; set; }
        // Anti CCP
        public bool IsAntiCcp { get; set; }
        // Cortisol
        public bool IsCortisol { get; set; }
        // Procalcitonin
        public bool IsProcal { get; set; }
        // FT4 (Free T4)
        public bool IsFt4 { get; set; }
        // TSH
        public bool IsTsh { get; set; }
        // Interlukin 6
        public bool IsInterlukin6 { get; set; }
        // HBsAg (test nhanh)
        public bool IsHbsAg { get; set; }
        // HBsAg (Elisa)
        public bool IsHbsQgE { get; set; }
        // Anti HIV (test nhanh)
        public bool IsAntiHiv { get; set; }
        // Anti HIV (Elisa)
        public bool IsAnitHivE { get; set; }
        // Anti HCV (test nhanh)
        public bool IsAntiHcv { get; set; }
        // Anit HCV (Elisa)
        public bool IsAntiHcvE { get; set; }
        // RPR
        public bool IsRpr { get; set; }
        // Sinh hóa
        // Glucose
        public bool IsGlucose { get; set; }
        // HbA1C
        public bool IsHpA1c { get; set; }
        // Urea
        public bool IsUrea { get; set; }
        // Creatinine
        public bool IsCreatinine { get; set; }
        // Uric acid
        public bool IsUricAcid { get; set; }
        // AST (SGOT)
        public bool IsAst { get; set; }
        // ALT (SGPT)
        public bool IsAlt { get; set; }
        // Bilirubin toàn phần
        public bool IsFBilirubin { get; set; }
        // Bilirubin trực tiếp
        public bool IsBilirubin { get; set; }
        // GGT
        public bool IsGgt { get; set; }
        // Protein toàn phần
        public bool IsProtein { get; set; }
        // Albumin
        public bool IsAlbumin { get; set; }
        // Triglycerid
        public bool IsTriglycerid { get; set; }
        // Cholesterol toàn phần
        public bool IsCholes { get; set; }
        // HDL Cholesterol
        public bool IsHdlCholes { get; set; }
        // LDL Cholesterol
        public bool IsLdlCholes { get; set; }
        // Điên giải đồ
        public bool IsElectrolytes { get; set; }
        // Ca toàn phần
        public bool IsCa { get; set; }
        // CPK
        public bool IsCpk { get; set; }
        // CK MB
        public bool IsCkMb { get; set; }
        // Troponin
        public bool IsTroponin { get; set; }
        // Ethanol
        public bool IsEthanol { get; set; }
        // Vi sinh
        // Soi trực tiếp
        public bool IsEndoscopy { get; set; }
        // Nhuộm Gram
        public bool IsGram { get; set; }
        // Nhuộm Ziehl tim BK
        public bool IsZiehl { get; set; }
        // Cấy - Kháng sinh đồ
        public bool IsAntibiotic { get; set; }
        // Nước tiểu
        // Tổng phân tích nước tiểu
        public bool IsUrine { get; set; }
        // Cặn Addis
        public bool IsAddis { get; set; }
        // Protein Bence Jones
        public bool IsProteinBj { get; set; }
        // Protein 24h
        public bool IsProtein24h { get; set; }
        // Urea 24h
        public bool IsUrea24h { get; set; }
        // Uric acid 24h
        public bool IsUricAcid24h { get; set; }
        // Creatinine 24h
        public bool IsCreat24h { get; set; }
        // Điện giải đồ 24h
        public bool IsElec24h { get; set; }
        // Ca 24h
        public bool IsCa24h { get; set; }
        // Ký sinh
        // KST đường ruột
        public bool IsKstRuot { get; set; }
        // Máu ẩn/phân
        public bool IsKstMau { get; set; }
        // HC-BC ẩn/phân
        public bool IsHcBc { get; set; }
        // Phân tích dịch
        // Dịch não tủy
        public bool IsDntProtein { get; set; }
        // Glucose
        public bool IsDntGlucose { get; set; }
        // Tế bào CTBC
        public bool IsDntCtbc { get; set; }
        // Cấy + Kháng sinh đồ
        public bool IsDntAnti { get; set; }
        // Dịch khớp
        // Protein
        public bool IsDkProtein { get; set; }
        // Glucose
        public bool IsDkGlucose { get; set; }
        // Tế bào CTBC
        public bool IsDkCtbc { get; set; }
        // Cấy + Kháng sinh đồ
        public bool IsDkAnti { get; set; }
        // Dịch màng phổi - màng bụng
        // Protein
        public bool IsDpbProtein { get; set; }
        // Rivalta
        public bool IsDpbRivalta { get; set; }
        // Tế bào
        public bool IsDpbCell { get; set; }
        // Cấy + Kháng sinh đồ
        public bool IsDpbAnti { get; set; }
        // Xét nghiệm khác
        public string OtherTest { get; set; }
        public Doctor Doctor { get; set; }
        public Patient Patient { get; set; }
    }
}
