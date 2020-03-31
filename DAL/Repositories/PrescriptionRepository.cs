using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public interface IPrescriptionRepository : IRepository<Prescription>
    {
        IEnumerable<Prescription> GetPrescriptions();
        Task<Prescription> GetPrescription(int id);
        IEnumerable<Prescription> GetPrescriptionList(int patientId);
        IEnumerable<Prescription> GetDoctorPrescriptions(string doctorId);
        Task<Prescription> GetDoctorPrescription(int id);
        IEnumerable<Prescription> GetRcptPrescriptions();
        Task<Prescription> GetRcptPrescription(int id);
    }

    public class PrescriptionRepository : Repository<Prescription>, IPrescriptionRepository
    {
        public PrescriptionRepository(ApplicationDbContext context) : base(context)
        {

        }

        public IEnumerable<Prescription> GetPrescriptions()
        {
            return _appContext.Prescriptions
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .Include(p => p.Medicines).ThenInclude(m => m.Medicine)
                .Where(p => !p.IsDeleted);
        }
        public async Task<Prescription> GetPrescription(int id)
        {
            return await _appContext.Prescriptions
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .Include(p => p.Medicines).ThenInclude(m => m.Medicine)
                .Where(p => (!p.IsDeleted && p.Id == id))
                .SingleOrDefaultAsync();
        }

        public IEnumerable<Prescription> GetPrescriptionList(int patientId)
        {
            return _appContext.Prescriptions
                .Include(p => p.Doctor)
                .Where(p => (!p.IsDeleted && p.PatientId == patientId));
        }

        public IEnumerable<Prescription> GetDoctorPrescriptions(string doctorId)
        {
            return _appContext.Prescriptions
                .Include(p => p.Patient)
                .Where(p => (!p.IsDeleted && p.DoctorId == doctorId));
        }

        public async Task<Prescription> GetDoctorPrescription(int id)
        {
            return await _appContext.Prescriptions
                .Include(p => p.Patient)
                .Where(p => (!p.IsDeleted && p.Id == id))
                .SingleOrDefaultAsync();
        }

        public IEnumerable<Prescription> GetRcptPrescriptions()
        {
            return _appContext.Prescriptions
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .Where(p => !p.IsDeleted);
        }

        public async Task<Prescription> GetRcptPrescription(int id)
        {
            return await _appContext.Prescriptions
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .Where(p => (!p.IsDeleted && p.Id == id))
                .SingleOrDefaultAsync();
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
