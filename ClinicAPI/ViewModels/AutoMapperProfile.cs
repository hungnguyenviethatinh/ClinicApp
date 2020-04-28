using AutoMapper;
using ClinicAPI.ViewModels.ServiceForm;
using DAL.Core;
using DAL.Models;
using DAL.Models.ServiceForm;

namespace ClinicAPI.ViewModels
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Patient, PatientModel>();
            CreateMap<PatientModel, Patient>();

            CreateMap<History, HistoryModel>();
            CreateMap<HistoryModel, History>();
            CreateMap<HistoryPatchModel, History>();
            CreateMap<History, HistoryViewModel>();

            CreateMap<XRayImage, XRayModel>();
            CreateMap<XRayModel, XRayImage>();

            CreateMap<Prescription, PrescriptionModel>();
            CreateMap<PrescriptionModel, Prescription>();

            CreateMap<PrescriptionUpdateModel, Prescription>();

            CreateMap<Medicine, MedicineModel>();
            CreateMap<MedicineModel, Medicine>();

            CreateMap<PrescriptionMedicine, PrescriptionMedicineModel>();
            CreateMap<PrescriptionMedicineModel, PrescriptionMedicine>();

            CreateMap<User, UserViewModel>()
                .ForMember(u => u.RoleName, map => map.Ignore());
            CreateMap<User, UserEditModel>()
                .ForMember(u => u.RoleName, map => map.Ignore())
                .ForMember(u => u.Password, map => map.Ignore());
            CreateMap<UserEditModel, User>();
            CreateMap<UserUpdateModel, User>();

            CreateMap<Medicine, MedicineModel>();
            CreateMap<MedicineModel, Medicine>()
                .ForMember(m => m.TotalQuantity, map => map.MapFrom(
                    (medicineModel, medicine) =>
                    medicine.TotalQuantity.GetValueOrDefault(0) + medicineModel.Quantity.GetValueOrDefault(0)))
                .ForMember(m => m.Quantity,
                map => map.MapFrom(
                    (medicineModel, medicine) =>
                    medicine.Quantity.GetValueOrDefault(0) + medicineModel.Quantity.GetValueOrDefault(0)));
            CreateMap<MedicineUpdateModel, Medicine>()
                .ForMember(m => m.TotalQuantity, map => map.MapFrom(
                    (medicineModel, medicine) =>
                    medicine.TotalQuantity.GetValueOrDefault(0) + medicineModel.Quantity))
                .ForMember(m => m.Quantity,
                map => map.MapFrom((medicineModel, medicine) =>
                {
                    int quantity = medicine.Quantity.GetValueOrDefault(0) - medicineModel.Quantity;

                    return quantity > 0 ? quantity : 0;
                }));
            CreateMap<MedicineRestoreModel, Medicine>()
                .ForMember(m => m.Quantity,
                map => map.MapFrom((medicineModel, medicine) =>
                {
                    return medicine.Quantity != null ? medicine.Quantity.Value + medicineModel.Quantity : 0;
                }));
            CreateMap<Medicine, MedicineViewModel>()
                .ForMember(m => m.Ingredient, map => map.Ignore())
                .ForMember(m => m.Quantity,
                map => map.MapFrom((medicine) => medicine.Quantity.GetValueOrDefault(0)))
                .ForMember(m => m.Status,
                map => map.MapFrom((medicine) => medicine.Quantity > 0 ? MedicineStatus.Yes : MedicineStatus.No));

            CreateMap<Diagnosis, DiagnosisModel>();
            CreateMap<DiagnosisModel, Diagnosis>();

            CreateMap<Unit, UnitModel>();
            CreateMap<UnitModel, Unit>();

            CreateMap<Ingredient, IngredientModel>();
            CreateMap<IngredientModel, Ingredient>();

            CreateMap<OpenTime, OpenTimeModel>();
            CreateMap<OpenTimeModel, OpenTime>();

            CreateMap<DoctorPatientHistory, DoctorPatientHistoryModel>();
            CreateMap<DoctorPatientHistoryModel, DoctorPatientHistory>();

            CreateMap<PatientHistoryUpdateModel, Patient>();

            CreateMap<User, DoctorViewModel>();
            CreateMap<DoctorPatientHistory, DoctorPatientHistoryViewModel>()
                .ForMember(viewModel => viewModel.Doctor,
                map => map.MapFrom((model) => new DoctorViewModel()
                {
                    Id = model.Doctor.Id,
                    FullName = model.Doctor.FullName,
                }));
            CreateMap<Patient, PatientViewModel>()
                .ForMember(viewModel => viewModel.Doctors,
                map => map.Ignore());

            CreateMap<Patient, PatientBasicViewModel>();
            CreateMap<Patient, PatientPartialViewModel>();
            CreateMap<Prescription, PrescriptionViewModel>()
                .ForMember(viewModel => viewModel.Patient, map => map.MapFrom((model) => new PatientBasicViewModel()
                {
                    Id = model.Patient.Id,
                    FullName = model.Patient.FullName,
                }))
                .ForMember(viewModel => viewModel.Doctor, map => map.MapFrom((model) => new DoctorViewModel()
                {
                    Id = model.Doctor.Id,
                    FullName = model.Doctor.FullName,
                }));
            CreateMap<Prescription, PrescriptionFullViewModel>()
                .ForMember(viewModel => viewModel.Patient, map => map.MapFrom((model) => new PatientBasicViewModel()
                {
                    Id = model.Patient.Id,
                    FullName = model.Patient.FullName,
                }))
                .ForMember(viewModel => viewModel.Doctor, map => map.MapFrom((model) => new DoctorViewModel()
                {
                    Id = model.Doctor.Id,
                    FullName = model.Doctor.FullName,
                }))
                .ForMember(viewModel => viewModel.Medicines, map => map.Ignore());
            CreateMap<Prescription, PrescriptionPartialViewModel>()
                .ForMember(viewModel => viewModel.Patient, map => map.MapFrom((model) => new PatientPartialViewModel()
                {
                    Id = model.Patient.Id,
                    IdCode = model.Patient.IdCode,
                    FullName = model.Patient.FullName,
                    OrderNumber = model.Patient.OrderNumber,
                    Age = model.Patient.Age,
                    Gender = model.Patient.Gender,
                    Address = model.Patient.Address,
                    PhoneNumber = model.Patient.PhoneNumber,
                    RelativePhoneNumber = model.Patient.RelativePhoneNumber,
                    AppointmentDate = model.Patient.AppointmentDate,
                    CheckedDate = model.Patient.CheckedDate,
                    Status = model.Patient.Status,
                }))
                .ForMember(viewModel => viewModel.Doctor, map => map.MapFrom((model) => new DoctorViewModel()
                {
                    Id = model.Doctor.Id,
                    FullName = model.Doctor.FullName,
                }))
                .ForMember(viewModel => viewModel.Medicines, map => map.Ignore());

            CreateMap<Medicine, MedicinePartialViewModel>()
                .ForMember(viewModel => viewModel.Quantity,
                map => map.MapFrom((model) => model.Quantity.GetValueOrDefault(0)))
                .ForMember(viewModel => viewModel.Status,
                map => map.MapFrom((model) => model.Quantity > 0 ? MedicineStatus.Yes : MedicineStatus.No));
            CreateMap<PrescriptionMedicine, PrescriptionMedicineViewModel>()
                .ForMember(viewModel => viewModel.Medicine, map => map.MapFrom((model) => new MedicinePartialViewModel()
                {
                    Id = model.Medicine.Id,
                    IdCode = model.Medicine.IdCode,
                    Name = model.Medicine.Name,
                    ExpiredDate = model.Medicine.ExpiredDate,
                    NetWeight = model.Medicine.NetWeight,
                    Quantity = model.Medicine.Quantity,
                    Unit = model.Medicine.Unit,
                    Status = model.Medicine.Quantity > 0 ? MedicineStatus.Yes : MedicineStatus.No,
                }));

            CreateMap<History, HistoryFullViewModel>()
                .ForMember(viewModel => viewModel.Prescriptions, map => map.Ignore())
                .ForMember(viewModel => viewModel.Doctors, map => map.Ignore())
                .ForMember(viewModel => viewModel.XRayImages, map => map.Ignore());
            CreateMap<XRayImage, XRayViewModel>();

            CreateMap<CtFormAddModel, CtForm>();
            CreateMap<CtForm, CtFormViewModel>()
                .ForMember(viewModel => viewModel.Patient, map => map.MapFrom((model) => new PatientPartialViewModel()
                {
                    Id = model.Patient.Id,
                    IdCode = model.Patient.IdCode,
                    FullName = model.Patient.FullName,
                    OrderNumber = model.Patient.OrderNumber,
                    Age = model.Patient.Age,
                    Gender = model.Patient.Gender,
                    Address = model.Patient.Address,
                    PhoneNumber = model.Patient.PhoneNumber,
                    RelativePhoneNumber = model.Patient.RelativePhoneNumber,
                    AppointmentDate = model.Patient.AppointmentDate,
                    CheckedDate = model.Patient.CheckedDate,
                    Status = model.Patient.Status,
                }))
                .ForMember(viewModel => viewModel.Doctor, map => map.MapFrom((model) => new DoctorViewModel()
                {
                    Id = model.Doctor.Id,
                    FullName = model.Doctor.FullName,
                }));
            CreateMap<CtFormUpdateModel, CtForm>();

            CreateMap<MriFormAddModel, MriForm>();
            CreateMap<MriForm, MriFormViewModel>()
                .ForMember(viewModel => viewModel.Patient, map => map.MapFrom((model) => new PatientPartialViewModel()
                {
                    Id = model.Patient.Id,
                    IdCode = model.Patient.IdCode,
                    FullName = model.Patient.FullName,
                    OrderNumber = model.Patient.OrderNumber,
                    Age = model.Patient.Age,
                    Gender = model.Patient.Gender,
                    Address = model.Patient.Address,
                    PhoneNumber = model.Patient.PhoneNumber,
                    RelativePhoneNumber = model.Patient.RelativePhoneNumber,
                    AppointmentDate = model.Patient.AppointmentDate,
                    CheckedDate = model.Patient.CheckedDate,
                    Status = model.Patient.Status,
                }))
                .ForMember(viewModel => viewModel.Doctor, map => map.MapFrom((model) => new DoctorViewModel()
                {
                    Id = model.Doctor.Id,
                    FullName = model.Doctor.FullName,
                }));
            CreateMap<MriFormUpdateModel, MriForm>();

            CreateMap<TestFormAddModel, TestForm>();
            CreateMap<TestForm, TestFormViewModel>()
                .ForMember(viewModel => viewModel.Patient, map => map.MapFrom((model) => new PatientPartialViewModel()
                {
                    Id = model.Patient.Id,
                    IdCode = model.Patient.IdCode,
                    FullName = model.Patient.FullName,
                    OrderNumber = model.Patient.OrderNumber,
                    Age = model.Patient.Age,
                    Gender = model.Patient.Gender,
                    Address = model.Patient.Address,
                    PhoneNumber = model.Patient.PhoneNumber,
                    RelativePhoneNumber = model.Patient.RelativePhoneNumber,
                    AppointmentDate = model.Patient.AppointmentDate,
                    CheckedDate = model.Patient.CheckedDate,
                    Status = model.Patient.Status,
                }))
                .ForMember(viewModel => viewModel.Doctor, map => map.MapFrom((model) => new DoctorViewModel()
                {
                    Id = model.Doctor.Id,
                    FullName = model.Doctor.FullName,
                }));
            CreateMap<TestFormUpdateModel, TestForm>();

            CreateMap<XqFormAddModel, XqForm>();
            CreateMap<XqForm, XqFormViewModel>()
                .ForMember(viewModel => viewModel.Patient, map => map.MapFrom((model) => new PatientPartialViewModel()
                {
                    Id = model.Patient.Id,
                    IdCode = model.Patient.IdCode,
                    FullName = model.Patient.FullName,
                    OrderNumber = model.Patient.OrderNumber,
                    Age = model.Patient.Age,
                    Gender = model.Patient.Gender,
                    Address = model.Patient.Address,
                    PhoneNumber = model.Patient.PhoneNumber,
                    RelativePhoneNumber = model.Patient.RelativePhoneNumber,
                    AppointmentDate = model.Patient.AppointmentDate,
                    CheckedDate = model.Patient.CheckedDate,
                    Status = model.Patient.Status,
                }))
                .ForMember(viewModel => viewModel.Doctor, map => map.MapFrom((model) => new DoctorViewModel()
                {
                    Id = model.Doctor.Id,
                    FullName = model.Doctor.FullName,
                }));
            CreateMap<XqFormUpdateModel, XqForm>();
        }
    }
}
