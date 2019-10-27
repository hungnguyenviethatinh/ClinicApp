using ClinicAPI.DAL.Models;
using ClinicAPI.DAL.Repositories.Interfaces;

namespace ClinicAPI.DAL.Repositories
{
    public interface IRoleRightRepository : IRepository<RoleRight>
    { }

    public class RoleRightRepository : Repository<RoleRight>, IRoleRightRepository
    {
        public RoleRightRepository(ClinicDbContext context) : base(context)
        { }
    }
}
