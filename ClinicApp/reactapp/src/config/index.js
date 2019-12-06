export const ApiUrl = process.env.DRKHOACLINICAPP_APIURL;
export const ClientSecret = process.env.DRKHOACLINICAPP_SECRET;

export const Audiance = 'clinicapi';
export const ClientId = 'clinicapp';

export const LoginUrl = '/connect/token';
export const EndSessionUrl = '/connect/endsession';
export const UserInfoUrl = '/connect/userinfo';

// Receptionist Api:
export const GetDoctorsUrl = '/api/receptionist/doctors';
export const GetPatientUrl = 'api/receptionist/patients';
export const AddPatientUrl = '/api/receptionist/patients';
export const AddHistoryUrl = '/api/receptionist/histories';
export const AddXrayUrl = '/api/receptionist/xrays';
export const UpdatePatientUrl = '/api/receptionist/patients';
export const GetPatientInQueueUrl = '/api/receptionist/patients/queue';
export const GetPrescriptionsUrl = '/api/receptionist/prescriptions';
export const GetPrescriptionsInQueueUrl = '/api/receptionist/prescriptions/queue';
// Doctor Api:
export const GetPatientsByDoctorUrl = '/api/doctor/patients';
export const GetPatientInQueueByDoctorUrl = '/api/doctor/patients/queue'; 
export const GetPrescriptionsInQueueByDoctorUrl = '/api/doctor/prescriptions/queue';
export const GetMedicineNameOptionsUrl = '/api/doctor/medicines';
export const GetCurrentPatientUrl = '/api/doctor/patients/current';
export const AddPrescriptionUrl = 'api/doctor/prescriptions'
export const AddMedicinesUrl = 'api/doctor/medicines';
