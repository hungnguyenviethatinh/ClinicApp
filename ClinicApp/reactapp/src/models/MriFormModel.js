import {
    PrescriptionStatusEnum,
    PrescriptionStatus,
} from "../constants";
import moment from 'moment';

export const MriFormModel = {
    IdCode: '',
    // Chẩn đoán
    DiagnosisName: '',
    // Ngày kê đơn
    DateCreated: moment(),
    Status: PrescriptionStatusEnum[PrescriptionStatus.IsNew],

    // Phiếu chỉ định MRI scan
    // Sọ não
    IsSkull: false,
    // Phần mềm đầu và cổ
    IsHeadNeck: false,
    // Ngực
    IsChest: false,
    // Bụng và chậu
    IsStomachGroin: false,
    // Chi
    IsLimbs: false,
    // Cột sống cổ
    IsNeckSpine: false,
    // Cột sống ngực
    IsChestSpine: false,
    // Cột sống thắt lưng
    IsPelvisSpine: false,
    // Mạch máu
    IsBloodVessel: false,
    // Yêu cầu khác
    IsOther: false,
    Other: '',
    // Dùng chất đối quang
    IsContrastAgent: false,
};
