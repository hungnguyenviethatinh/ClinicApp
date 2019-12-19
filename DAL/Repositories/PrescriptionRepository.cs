using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public interface IPrescriptionRepository : IRepository<Prescription>
    {
        Task<Prescription> GetPrescription(int id);
    }

    public class PrescriptionRepository : Repository<Prescription>, IPrescriptionRepository
    {
        public PrescriptionRepository(ApplicationDbContext context) : base(context)
        {

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

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
