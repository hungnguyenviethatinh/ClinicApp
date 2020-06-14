export const RouteConstants = {
    DashboardView: '/dashboard',
    PatientsView: '/patients',
    PatientDetailView: '/patient/:id',
    PatientManagementView: '/patient-management',
    PrescriptionsView: '/prescriptions',
    PrescriptionDetailView: '/prescription/:id',
    PrescriptionManagementView: '/prescription-management',
    ServiceFormView: '/ServiceForm',
    CtFormView: '/ServiceForm/CtForm/:mode/:formId',
    MriFormView: '/ServiceForm/MriForm/:mode/:formId',
    TestFormView: '/ServiceForm/TestForm/:mode/:formId',
    XqFormView: '/ServiceForm/XqForm/:mode/:formId',
    UserManagementView: '/user-management',
    DrugManagementView: '/drug-management',
    DataInputManagementView: '/datainput-management',
    OpenTimeManagementView: '/opentime-management',
    StatisticsView: '/statistics',
    UserView: '/account/me',
    LoginView: '/login',
};

export const RoleConstants = {
    AdministratorRoleName: 'Quản trị viên',
    ReceptionistRoleName: 'Lễ tân',
    DoctorRoleName: 'Bác sĩ',
};

export const PatientStatus = {
    IsNew: 'Mới',
    IsAppointed: 'Đặt lịch hẹn',
    IsChecking: 'Đang khám',
    IsChecked: 'Đã khám',
    IsRechecking: 'Tái khám',
    IsToAddDocs: 'BS Hồ Sơ',
};

export const PatientStatusEnum = {
    'Mới': 0,
    'Đặt lịch hẹn': 1,
    'Đang khám': 2,
    'Đã khám': 3,
    'Tái khám': 4,
    'BS Hồ Sơ': 5,
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
    No: 'Hết',
    Yes: 'Còn',
};

export const DrugStatusEnum = {
    'Hết': 0,
    'Còn': 1,
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
    Prescription: 'DKC-DT',
};


export const PeriodConstants = {
    Day: 'DAY',
    Week: 'WEEK',
    Month: 'MONTH',
};

export const AccessTokenKey = 'access_token';

export const ExpiredSessionMsg = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!';
export const NotFoundMsg = 'Không tìm thấy dữ liệu!';

export const DataDateTimeFormat = 'YYYY-MM-DD';
export const DisplayDateFormat = 'DD-MM-YYYY';
export const DisplayDateTimeFormat = 'DD-MM-YYYY HH:mm:ss';

export const RefreshDataTimer = 10;

export const AddressSeperator = ',';

export const SnackbarMessage = {
    GetMedicineListError: 'Có lỗi khi sao chép đơn thuốc cũ. Vui lòng thử lại sau!',
    CreatePrescriptionError: 'Có lỗi khi tạo đơn thuốc mới!',
    CreatePrescriptionSuccess: 'Đơn thuốc mới đã được tạo thành công!',
};

export const TakePeriodValue = {
    Day: 'Ngày',
    Week: 'Tuần',
    Month: 'Tháng',
};

export const CurrentCheckingPatientId = 'currentCheckingPatientId';

export const NewPrescriptionId = 'newPrescriptionId';

export const FormMode = {
    Add: 'add',
    Update: 'update',
    View: 'view',
};

export const CtRequestType = {
    Normal: 'Thường',
    Urgent: 'Khẩn',
    Emergency: 'Khẩn cấp',
    None: 'Không',
}

export const CtRequestTypeEnum = {
    'Thường': 0,
    'Khẩn': 1,
    'Khẩn cấp': 2,
    'Không': 3,
}
