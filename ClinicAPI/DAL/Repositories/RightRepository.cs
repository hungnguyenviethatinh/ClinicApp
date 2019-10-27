using ClinicAPI.DAL.Models;
using ClinicAPI.DAL.Repositories.Interfaces;

namespace ClinicAPI.DAL.Repositories
{
    public interface IRightRepository : IRepository<Right>
    { }

    public class RightRepository : Repository<Right>, IRightRepository
    {
        public RightRepository(ClinicDbContext context) : base(context)
        { }
    }
}
