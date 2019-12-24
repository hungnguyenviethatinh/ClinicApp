using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public interface IPatientRepository : IRepository<Patient>
    {
        IEnumerable<Patient> GetPatients();
        Task<Patient> GetPatient(int id);
    }

    public class PatientRepository : Repository<Patient>, IPatientRepository
    {
        public PatientRepository(ApplicationDbContext context) : base(context)
        {

        }

        public IEnumerable<Patient> GetPatients()
        {
            return _appContext.Patients
                 .Include(p => p.Doctor)
                 .Where(p => !p.IsDeleted);
        }

        public async Task<Patient> GetPatient(int id)
        {
            return await _appContext.Patients
                .Include(p => p.Doctor)
                .Where(p => !p.IsDeleted && p.Id == id)
                .SingleOrDefaultAsync();
        }
        ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
