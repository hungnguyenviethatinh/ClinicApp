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

            CreateMap<History, HistoryViewModel>()
                .ForMember(h => h.Doctor, map => map.Ignore())
                .ForMember(h => h.Prescriptions, map => map.Ignore())
                .ForMember(h => h.XRayImages, map => map.Ignore());

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
            CreateMap<MedicineModel, Medicine>();
            CreateMap<MedicineUpdateModel, Medicine>()
                .ForMember(m => m.Quantity,
                map => map.MapFrom((medicineModel, medicine) => medicine.Quantity - medicineModel.Quantity));

            CreateMap<Medicine, MedicineViewModel>()
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

            CreateMap<DoctorPatient, DoctorPatientModel>();
            CreateMap<DoctorPatientModel, DoctorPatient>();
        }
    }
}
