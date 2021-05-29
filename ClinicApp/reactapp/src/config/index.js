// App configuration:
export const ApiUrl = window.DRKHOACLINICAPP_APIURL || process.env.DRKHOACLINICAPP_APIURL;
export const ClientSecret = window.DRKHOACLINICAPP_SECRET || process.env.DRKHOACLINICAPP_SECRET;

export const Audience = 'DrKhoaClinicApi';
export const ClientId = 'DrKhoaClinicApp';

export const LoginUrl = '/connect/token';
export const EndSessionUrl = '/connect/endsession';
export const UserInfoUrl = '/connect/userinfo';

// Receptionist Api:
export const GetDoctorsUrl = '/api/receptionist/doctors';
export const GetPatientUrl = 'api/receptionist/patients';
export const AddPatientUrl = '/api/receptionist/patients';
export const AddHistoryUrl = '/api/receptionist/histories';
export const AddXRayUrl = '/api/receptionist/xRays';
export const UpdatePatientUrl = '/api/receptionist/patients';
export const UpdateHistoryUrl = '/api/receptionist/histories';
export const UpdateXRayUrl = '/api/receptionist/xRays';
export const DeletePatientUrl = '/api/receptionist/patients';
export const DeleteXRayUrl = '/api/receptionist/xRays';
export const GetPatientInQueueUrl = '/api/receptionist/patients/queue';
export const GetPrescriptionsUrl = '/api/receptionist/prescriptions';
export const GetPrescriptionsInQueueUrl = '/api/receptionist/prescriptions/queue';
export const AddDoctorsUrl = '/api/receptionist/doctors';
export const UpdateDoctorsUrl = '/api/receptionist/doctors';

// Doctor Api:
export const GetPatientsByDoctorUrl = '/api/doctor/patients';
export const GetPatientOptionsUrl = '/api/doctor/patients/options';
export const GetPatientInQueueByDoctorUrl = '/api/doctor/patients/queue';
export const UpdatePatientStatusUrl = '/api/doctor/patients/update';
export const GetPrescriptionsInQueueByDoctorUrl = '/api/doctor/prescriptions/queue';
export const GetMedicineNameOptionsUrl = '/api/doctor/medicines';
export const GetDiagnosisNameOptionsUrl = '/api/doctor/diagnoses';
export const GetUnitNameOptionsUrl = '/api/doctor/units';
export const GetCurrentPatientUrl = '/api/doctor/patients/current';
export const AddPrescriptionsUrl = 'api/doctor/prescriptions';
export const GetPrescriptionUrl = 'api/doctor/prescriptions';
export const UpdatePrescriptionsUrl = 'api/doctor/prescriptions';
export const DeletePrescriptionsUrl = 'api/doctor/prescriptions';
export const AddMedicinesUrl = 'api/doctor/medicines';
export const UpdatePatientHistoryUrl = 'api/doctor/patients';
export const UpdateMedicinesUrl = 'api/doctor/medicines';
export const DeleteMedicinesUrl = 'api/doctor/medicines';
export const UpdateMedicinesQuantityUrl = 'api/doctor/medicines/quantity';
export const RestoreMedicinesQuantityUrl = 'api/doctor/medicines/restore';
export const GetIngredientOptionsUrl = 'api/doctor/ingredients';
export const GetPrescriptionListUrl = 'api/doctor/prescriptionList';
export const GetMedicineListUrl = 'api/doctor/medicineList';
export const GetDoctorCtFormsUrl = "/api/doctor/ctForms";
export const GetDoctorMriFormsUrl = "/api/doctor/mriForms";
export const GetDoctorTestFormsUrl = "/api/doctor/testForms";
export const GetDoctorXqFormsUrl = "/api/doctor/xqForms";

// Admin Api:
export const GetAllPatientsUrl = '/api/admin/patients';
export const GetAllPrescriptionsUrl = '/api/admin/prescriptions';
export const GetAllMedicinesUrl = '/api/admin/medicines';
export const GetAllEmployeesUrl = '/api/admin/employees';
export const GetMedicineUrl = '/api/admin/medicines';
export const AddMedicineUrl = '/api/admin/medicines';
export const UpdateMedicineUrl = '/api/admin/medicines';
export const DeleteMedicineUrl = '/api/admin/medicines';
export const GetEmployeeUrl = '/api/admin/employees';
export const AddEmployeeUrl = '/api/admin/employees';
export const UpdateEmployeeUrl = '/api/admin/employees';
export const DeleteEmployeeUrl = '/api/admin/employees';
export const GetPatientStatUrl = '/api/admin/stat/patient';
export const GetPrescriptionStatUrl = '/api/admin/stat/prescription';
export const GetMedicineStatUrl = '/api/admin/stat/medicine';
export const GetDiagnosesUrl = '/api/admin/diagnoses';
export const GetDiagnosisUrl = '/api/admin/diagnoses';
export const AddDiagnosisUrl = '/api/admin/diagnoses';
export const UpdateDiagnosisUrl = '/api/admin/diagnoses';
export const DeleteDiagnosisUrl = '/api/admin/diagnoses';
export const GetUnitsUrl = '/api/admin/units';
export const GetUnitUrl = '/api/admin/units';
export const AddUnitUrl = '/api/admin/units';
export const UpdateUnitUrl = '/api/admin/units';
export const DeleteUnitUrl = '/api/admin/units';
export const GetIngredientsUrl = '/api/admin/ingredients';
export const AddIngredientsUrl = '/api/admin/ingredients';
export const UpdateIngredientsUrl = '/api/admin/ingredients';
export const DeleteIngredientsUrl = '/api/admin/ingredients';
export const GetOpenTimesUrl = '/api/admin/openTimes';
export const GetOpenTimeUrl = '/api/admin/openTimes';
export const AddOpenTimeUrl = '/api/admin/openTimes';
export const UpdateOpenTimeUrl = '/api/admin/openTimes';
export const DeleteOpenTimeUrl = '/api/admin/openTimes';

// Service Form:
export const GetCtFormsUrl = "/api/ServiceForm/ctForms";
export const GetMriFormsUrl = "/api/ServiceForm/mriForms";
export const GetTestFormsUrl = "/api/ServiceForm/testForms";
export const GetXqFormsUrl = "/api/ServiceForm/xqForms";
export const GetCtFormUrl = "/api/ServiceForm/ctForm";
export const GetMriFormUrl = "/api/ServiceForm/mriForm";
export const GetTestFormUrl = "/api/ServiceForm/testForm";
export const GetXqFormUrl = "/api/ServiceForm/xqForm";
export const AddCtFormUrl = "/api/ServiceForm/ctForm";
export const AddMriFormUrl = "/api/ServiceForm/mriForm";
export const AddTestFormUrl = "/api/ServiceForm/testForm";
export const AddXqFormUrl = "/api/ServiceForm/xqForm";
export const UpdateCtFormUrl = "/api/ServiceForm/ctForm";
export const UpdateMriFormUrl = "/api/ServiceForm/mriForm";
export const UpdateTestFormUrl = "/api/ServiceForm/testForm";
export const UpdateXqFormUrl = "/api/ServiceForm/xqForm";
export const DeleteCtFormUrl = "/api/ServiceForm/ctForm";
export const DeleteMriFormUrl = "/api/ServiceForm/mriForm";
export const DeleteTestFormUrl = "/api/ServiceForm/testForm";
export const DeleteXqFormUrl = "/api/ServiceForm/xqForm";
export const GetPatientNamesUrl = '/api/ServiceForm/patients/options';
export const GetDiagnosisNamesUrl = '/api/ServiceForm/diagnoses';
export const UpdateStatusCtFormUrl = "/api/ServiceForm/ctForm";
export const UpdateStatusMriFormUrl = "/api/ServiceForm/mriForm";
export const UpdateStatusTestFormUrl = "/api/ServiceForm/testForm";
export const UpdateStatusXqFormUrl = "/api/ServiceForm/xqForm";

// Shared:
export const PatientUrl = '/api/patient';
export const PrescriptionUrl = '/api/prescription';
export const OpenTimesUrl = '/api/prescription/openTimes';
export const UpdatePrescriptionStatusUrl = '/api/prescription/status';
export const HistoryByPatientIdUrl = '/api/history/patient';
export const GetHistoryUrl = '/api/history';
export const PatientCurrentHistoryUrl = 'api/history/patient/current';
export const SetUserStatusUrl = '/api/account/status';
export const GetCurrentUserUrl = '/api/account';
export const UpdateCurrentUserUrl = '/api/account/update';

// ChromeLy controller:
export const PrescriptionPrintUrl = '/prescription/print';
export const GetAppConfigurationUrl = '/app/configuration';
export const PatientPrintUrl = '/patient/print';
export const CtFormPrintUrl = '/ctform/print';
export const MriFormPrintUrl = '/mriform/print';
export const TestFormPrintUrl = '/testform/print';
export const XqFormPrintUrl = '/xqform/print';
