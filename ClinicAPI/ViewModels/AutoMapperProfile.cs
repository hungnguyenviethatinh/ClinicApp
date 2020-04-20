using AutoMapper;
using DAL.Core;
using DAL.Models;

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
                .ForMember(m => m.Quantity,
                map => map.MapFrom(
                    (medicineModel, medicine) =>
                    medicine.Quantity.GetValueOrDefault(0) + medicineModel.Quantity.GetValueOrDefault(0)));

            CreateMap<MedicineUpdateModel, Medicine>()
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
                .ForMember(p => p.Patient, map => map.MapFrom((viewModel) => new PatientBasicViewModel()
                {
                    Id = viewModel.Patient.Id,
                    FullName = viewModel.Patient.FullName,
                }))
                .ForMember(p => p.Doctor, map => map.MapFrom((viewModel) => new DoctorViewModel()
                {
                    Id = viewModel.Doctor.Id,
                    FullName = viewModel.Doctor.FullName,
                }));
            CreateMap<Prescription, PrescriptionFullViewModel>()
                .ForMember(p => p.Patient, map => map.MapFrom((viewModel) => new PatientBasicViewModel()
                {
                    Id = viewModel.Patient.Id,
                    FullName = viewModel.Patient.FullName,
                }))
                .ForMember(p => p.Doctor, map => map.MapFrom((viewModel) => new DoctorViewModel()
                {
                    Id = viewModel.Doctor.Id,
                    FullName = viewModel.Doctor.FullName,
                }))
                .ForMember(p => p.Medicines, map => map.Ignore());
            CreateMap<Prescription, PrescriptionPartialViewModel>()
                .ForMember(p => p.Patient, map => map.MapFrom((viewModel) => new PatientPartialViewModel()
                {
                    Id = viewModel.Patient.Id,
                    IdCode = viewModel.Patient.IdCode,
                    FullName = viewModel.Patient.FullName,
                    Age = viewModel.Patient.Age,
                    Gender = viewModel.Patient.Gender,
                    Address = viewModel.Patient.Address,
                    PhoneNumber = viewModel.Patient.PhoneNumber,
                    RelativePhoneNumber = viewModel.Patient.RelativePhoneNumber,
                    AppointmentDate = viewModel.Patient.AppointmentDate,
                    CheckedDate = viewModel.Patient.CheckedDate,
                    Status = viewModel.Patient.Status,
                }))
                .ForMember(p => p.Doctor, map => map.MapFrom((viewModel) => new DoctorViewModel()
                {
                    Id = viewModel.Doctor.Id,
                    FullName = viewModel.Doctor.FullName,
                }))
                .ForMember(p => p.Medicines, map => map.Ignore());

            CreateMap<Medicine, MedicinePartialViewModel>()
                .ForMember(m => m.Quantity,
                map => map.MapFrom((medicine) => medicine.Quantity.GetValueOrDefault(0)))
                .ForMember(m => m.Status,
                map => map.MapFrom((medicine) => medicine.Quantity > 0 ? MedicineStatus.Yes : MedicineStatus.No));
            CreateMap<PrescriptionMedicine, PrescriptionMedicineViewModel>()
                .ForMember(pm => pm.Medicine, map => map.MapFrom((viewModel) => new MedicinePartialViewModel()
                {
                    Id = viewModel.Medicine.Id,
                    IdCode = viewModel.Medicine.IdCode,
                    Name = viewModel.Medicine.Name,
                    ExpiredDate = viewModel.Medicine.ExpiredDate,
                    NetWeight = viewModel.Medicine.NetWeight,
                    Quantity = viewModel.Medicine.Quantity,
                    Unit = viewModel.Medicine.Unit,
                    Status = viewModel.Medicine.Quantity > 0 ? MedicineStatus.Yes : MedicineStatus.No,
                }));

            CreateMap<History, HistoryFullViewModel>()
                .ForMember(h => h.Prescriptions, map => map.Ignore())
                .ForMember(h => h.Doctors, map => map.Ignore())
                .ForMember(h => h.XRayImages, map => map.Ignore());
            CreateMap<XRayImage, XRayViewModel>();
        }
    }
}
