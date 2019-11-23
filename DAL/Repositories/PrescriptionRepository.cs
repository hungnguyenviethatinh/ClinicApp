using DAL.Models;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public interface IPrescriptionRepository : IRepository<Prescription>
    {

    }

    public class PrescriptionRepository : Repository<Prescription>, IPrescriptionRepository
    {
        public PrescriptionRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}
