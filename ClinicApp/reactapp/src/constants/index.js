export const RoleConstants = {
    AdministratorRoleName: 'Administrator',
    ReceptionistRoleName: 'Receptionist',
    DoctorRoleName: 'Doctor',
};

export const PatientStatus = {
    IsNew: 'Mới',
    IsAppointed: 'Đặt lịch hẹn',
    IsChecking: 'Đang khám',
    IsChecked: 'Đã khám',
    IsRechecking: 'Tái khám',
};

export const PatientStatusEnum = {
    'Mới': 0,
    'Đặt lịch hẹn': 1,
    'Đang khám': 2,
    'Đã khám': 3,
    'Tái khám': 4,
};

export const PrescriptionStatus = {
    IsNew: 'Mới',
    IsPending: 'Đang hoãn',
    IsPrinted: 'Đã in',
};

export const PrescriptionStatusEnum = {
    'Mới': 0,
    'Đã in': 1,
    'Đang hoãn': 2,
};

export const DrugStatus = {
    Yes: 'Còn',
    No: 'Hết',
};

export const UserStatus = {
    Active: 'Có mặt',
    Inactive: 'Vắng mặt',
};

export const Gender = {
    None: 'Khác',
    Male: 'Nam',
    Female: 'Nữ',
};

export const GenderEnum = {
    'Khác': 0,
    'Nam': 1,
    'Nữ': 2,
};

export const color = {
    neutral: 'neutral',
    primary: 'primary',
    secondary: 'secondary',
    info: 'info',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
};

export const IdPrefix = {
    Patient: 'DKC-BN',
};

export const ExpiredSessionMsg = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!';
export const NotFoundMsg = 'Không tìm thấy thông tin!';
