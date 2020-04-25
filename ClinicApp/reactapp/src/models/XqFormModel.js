import {
    PrescriptionStatusEnum,
    PrescriptionStatus,
} from "../constants";
import moment from 'moment';

export const XqFormModel = {
    IdCode: '',
    // Chẩn đoán
    DiagnosisName: '',
    // Ngày kê đơn
    DateCreated: moment(),
    Status: PrescriptionStatusEnum[PrescriptionStatus.IsNew],

    // Phiếu chụp X Quang
    // Yêu cầu
    Request: '',
    // Ghi chú
    Note: '',
};
