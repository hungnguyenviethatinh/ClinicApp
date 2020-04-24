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

export const XqFormAddModel = {
    ...XqFormModel,
    PatientId: '',
    HistoryId: '',
};

export const XqFormViewModel = {
    ...XqFormModel,
    Id: '',
    PatientId: '',
    Patient: '',
    DoctorId: '',
    Doctor: '',
};

export const XqFormUpdateModel = {
    ...XqFormModel,
};
