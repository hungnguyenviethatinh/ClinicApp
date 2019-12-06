using AutoMapper;
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

            CreateMap<Medicine, MedicineModel>();
            CreateMap<MedicineModel, Medicine>();

            CreateMap<Medicine, MedicineViewModel>()
                .ForMember(m => m.Status, map => map.Ignore());
        }
    }
}
