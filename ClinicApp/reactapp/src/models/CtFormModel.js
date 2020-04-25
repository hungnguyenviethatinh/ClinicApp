import {
    PrescriptionStatusEnum,
    PrescriptionStatus,
    CtRequestType,
} from "../constants";
import moment from 'moment';

export const CtFormModel = {
    IdCode: '',
    // Chẩn đoán
    DiagnosisName: '',
    // Ngày kê đơn
    DateCreated: moment(),
    Status: PrescriptionStatusEnum[PrescriptionStatus.IsNew],

    // Phiếu chỉ định chụp CT
    // Loại yêu cầu
    Type: CtRequestType.Normal,
    // Thuốc cản quang
    IsContrastMedicine: false,
    // Sọ não
    IsSkull: false,
    // Tai mũi họng
    IsEarNoseThroat: false,
    // CS Cổ
    IsCsNeck: false,
    // CS Ngực
    IsCsChest: false,
    // CS Thắt lưng
    IsCsWaist: false,
    // Vai
    IsShoulder: false,
    // Khuỷa tay
    IsElbow: false,
    // Cổ tay
    IsWrist: false,
    // Xoang
    IsSinus: false,
    // Háng
    IsGroin: false,
    // Gối
    IsKnee: false,
    // Cổ chân
    IsAnkle: false,
    // Cổ
    IsNeck: false,
    // Bàn chân
    IsFoot: false,
    // Khung chậu
    IsPelvis: false,
    // Ngực
    IsChest: false,
    // Bụng
    IsStomach: false,
    // Hệ niệu
    IsUrinary: false,
    // Mạch máu chi trên
    IsUpperVein: false,
    UpperVein: '',
    // Mạch máu chi dưới
    IsLowerVein: false,
    LowerVein: '',
    // Khác
    IsOther: false,
    Other: '',
    // Có thai
    IsPregnant: false,
    // Dị ứng
    IsAllergy: false,
    // Bệnh lí tim mạch
    IsHeartDisease: false,
    // Bệnh lí mạch máu vùng ngoại biên
    IsBloodDisease: false,
    // Bệnh suy thận
    IsKidneyFailure: false,
    // Đái tháo đường
    IsDiabetesMellitus: false,
    // Rối loạn đông máu
    IsCoagulopathy: false,
};
