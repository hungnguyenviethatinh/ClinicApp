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
        }
    }
}
