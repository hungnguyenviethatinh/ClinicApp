import {
    PrescriptionStatusEnum,
    PrescriptionStatus,
} from "../constants";
import moment from 'moment';

export const TestFormModel = {
    IdCode: '',
    // Chẩn đoán
    DiagnosisName: '',
    // Ngày kê đơn
    DateCreated: moment(),
    Status: PrescriptionStatusEnum[PrescriptionStatus.IsNew],

    // Phiếu xét nghiệm
    // Bệnh phẩm
    // Máu
    IsBloodSample: false,
    // Nước tiểu
    IsUrineSample: false,
    // Mủ
    IsPusSample: false,
    // Đờm
    IsSputumSample: false,
    // Phân
    IsShitSample: false,
    // Dịch
    HumourSample: '',
    // Huyết học
    // Nhóm máu
    IsBloodGroup: false,
    // Huyết đồ
    IsBlood: false,
    // Tốc độ máu
    IsVS: false,
    // KST sốt rét
    IsFeverTest: false,
    // Đông máu
    // TS
    IsTs: false,
    // TC
    IsTc: false,
    // PT (TQ)
    IsPt: false,
    // ATPP (TCK)
    IsAtpp: false,
    // Fibrinogen
    IsFibrinogen: false,
    // D-Dimer
    IsDdimer: false,
    // Miễn dịch
    // ASO
    IsAso: false,
    // CRP
    IsCrp: false,
    // RF
    IsRf: false,
    // ANA
    IsAna: false,
    // Anti CCP
    IsAntiCcp: false,
    // Cortisol
    IsCortisol: false,
    // Procalcitonin
    IsProcal: false,
    // FT4 (Free T4)
    IsFt4: false,
    // TSH
    IsTsh: false,
    // Interlukin 6
    IsInterlukin6: false,
    // HBsAg (test nhanh)
    IsHbsAg: false,
    // HBsAg (Elisa)
    IsHbsQgE: false,
    // Anti HIV (test nhanh)
    IsAntiHiv: false,
    // Anti HIV (Elisa)
    IsAnitHivE: false,
    // Anti HCV (test nhanh)
    IsAntiHcv: false,
    // Anit HCV (Elisa)
    IsAntiHcvE: false,
    // RPR
    IsRpr: false,
    // Sinh hóa
    // Glucose
    IsGlucose: false,
    // HbA1C
    IsHpA1c: false,
    // Urea
    IsUrea: false,
    // Creatinine
    IsCreatinine: false,
    // Uric acid
    IsUricAcid: false,
    // AST (SGOT)
    IsAst: false,
    // ALT (SGPT)
    IsAlt: false,
    // Bilirubin toàn phần
    IsFBilirubin: false,
    // Bilirubin trực tiếp
    IsBilirubin: false,
    // GGT
    IsGgt: false,
    // Protein toàn phần
    IsProtein: false,
    // Albumin
    IsAlbumin: false,
    // Triglycerid
    IsTriglycerid: false,
    // Cholesterol toàn phần
    IsCholes: false,
    // HDL Cholesterol
    IsHdlCholes: false,
    // LDL Cholesterol
    IsLdlCholes: false,
    // Điên giải đồ
    IsElectrolytes: false,
    // Ca toàn phần
    IsCa: false,
    // CPK
    IsCpk: false,
    // CK MB
    IsCkMb: false,
    // Troponin
    IsTroponin: false,
    // Ethanol
    IsEthanol: false,
    // Vi sinh
    // Soi trực tiếp
    IsEndoscopy: false,
    // Nhuộm Gram
    IsGram: false,
    // Nhuộm Ziehl tim BK
    IsZiehl: false,
    // Cấy - Kháng sinh đồ
    IsAntibiotic: false,
    // Nước tiểu
    // Tổng phân tích nước tiểu
    IsUrine: false,
    // Cặn Addis
    IsAddis: false,
    // Protein Bence Jones
    IsProteinBj: false,
    // Protein 24h
    IsProtein24h: false,
    // Urea 24h
    IsUrea24h: false,
    // Uric acid 24h
    IsUricAcid24h: false,
    // Creatinine 24h
    IsCreat24h: false,
    // Điện giải đồ 24h
    IsElec24h: false,
    // Ca 24h
    IsCa24h: false,
    // Ký sinh
    // KST đường ruột
    IsKstRuot: false,
    // Máu ẩn/phân
    IsKstMau: false,
    // HC-BC ẩn/phân
    IsHcBc: false,
    // Phân tích dịch
    // Dịch não tủy
    IsDntProtein: false,
    // Glucose
    IsDntGlucose: false,
    // Tế bào CTBC
    IsDntCtbc: false,
    // Cấy + Kháng sinh đồ
    IsDntAnti: false,
    // Dịch khớp
    // Protein
    IsDkProtein: false,
    // Glucose
    IsDkGlucose: false,
    // Tế bào CTBC
    IsDkCtbc: false,
    // Cấy + Kháng sinh đồ
    IsDkAnti: false,
    // Dịch màng phổi - màng bụng
    // Protein
    IsDpbProtein: false,
    // Rivalta
    IsDpbRivalta: false,
    // Tế bào
    IsDpbCell: false,
    // Cấy + Kháng sinh đồ
    IsDpbAnti: false,
    // Xét nghiệm khác
    OtherTest: '',
};
