using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
    public interface IMedicineRepository : IRepository<Medicine>
    {
        IEnumerable<Medicine> GetMedicines();
    }

    public class MedicineRepository : Repository<Medicine>, IMedicineRepository
    {
        public MedicineRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<Medicine> GetMedicines()
        {
            return _appContext.Medicines
                .Include(m => m.Ingredients)
                .Where(m => !m.IsDeleted)
                .OrderBy(m => m.Name);
        }

        ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
