
## Introduction
This is a freelance project that I got the deal from a doctor. He'd just opened his own clinic, so he wanna have a software to help him manage and operate his clinic.

Firstly, he needed a desktop application that would be used by him and his staff: a receptionist and his assistants. 

He played a role as an admin. He could view a list of patients, a list of prescription, a list  of staff and a list of medicine in store through a dashboard. He could manage staff, medicine and medicine unit with CRUD functions. More, he might also print the prescription. He had a statistics screen that helped him view the reports of his current business.

The receptionist had a screen to proceed procedures to check in patients. He would input the patients' information: name, address, phone, current height, weight, temperature and other images, then he addressed the patients to a doctor. He could print prescriptions which pushed from doctor to his screen.
His assistants in a role as a doctor, he would check the patient and then create a prescription. Besides, he could create other paper forms as CT, MRI and XQ to ask the patient to go to other clinic to get these checked.

As his request to build a desktop app, I would have used Window Forms. However, I am basically a web application developer, Window Forms was rather not familiar to me. So I chose other frameworks more familiar to me.
Those were ASP .NET Core API and [Chromely](https://chromely.net/) to build a desktop app using [Reactjs](https://reactjs.org/).

I built an Web API called ClinicAPI using ASP .NET Core 3.0, recently upgraded to 3.1. This API could run independently on Window without hosting in IIS. And I built a desktop app call ClinicApp using Chromely and Reactjs. This app interacted with the API as a client web.

This project lasted in an discontinuous period from mid October 2019 to May 2020 split into 2 stages: main development (Oct 2019 - Dec 2019) and new changes enhancement and maintenance (Jan 2020 - May 2020) as customer made requests and feedback.

## Demo
Login Screen:
![Login Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/LoginScreen.PNG?raw=true)

Admin Dashboard Screen:
![Admin Dashboard Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/AdminDashboardScreen.PNG?raw=true)

User Management Screen:
![User Management Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/UserManagementScreen.PNG?raw=true)

Medicine Management Screen:
![Medicine Management Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/MedicineManagementScreen.PNG?raw=true)

Input Unit Management Screen:
![Input Unit Management Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/UnitManagementScreen.PNG?raw=true)

Active Time Management Screen:
![Active Time Management Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/ActiveTimeManagementScreen.PNG?raw=true)

Statistics Screen:
![Statistics Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/StatisticsScreen.PNG?raw=true)

Doctor Dashboard Screen:
![Doctor Dashboard Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/DoctorDashboardScreen.PNG?raw=true)

List of Patients:
![List of Patients](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/PatientListScreen.PNG?raw=true)

Patient Profile Screen:
![Patient Profile Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/PatientProfileScreen.PNG?raw=true)

Patient Checked History Screen:
![Patient Checked History Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/PatientHistoryScreen.PNG?raw=true)

Create New Prescription Screen:
![Create New Prescription Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/NewPrescriptionScreen.PNG?raw=true)

Create New Request Papers Screen:
![Create New Request Papers Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/NewRequestFormScreen.PNG?raw=true)

Create New CT Form Screen:
![Create New CT Form Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/NewCTFormScreen.PNG?raw=true)

Create New MRI Form Screen:
![Create New MRI Form Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/NewMRIFormScreen.PNG?raw=true)

Create New Test Form Screen:
![Create New Test Form Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/NewTestFormScreen.PNG?raw=true)

Create New XQ Form Screen:
![Create New XQ Form Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/NewXQFormScreen.PNG?raw=true)

Receptionist Dashboard Screen:
![Receptionist Dashboard Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/ReceptionDashboardScreen.PNG?raw=true)

Patient Management and Checkin:
![Patient Management and Checkin](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/ReceptionManagementScreen.PNG?raw=true)

List of Prescriptions:
![List of Prescriptions](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/PrescriptionListScreen.PNG?raw=true)

Prescription Detail Screen:
![Prescription Detail Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/PrescriptionDetailScreen.PNG?raw=true)

Full Mode Screen:
![Full Mode Screen](https://github.com/hungnguyenviethatinh/ClinicApp/blob/master/Screenshots/FullModeScreen.PNG?raw=true)