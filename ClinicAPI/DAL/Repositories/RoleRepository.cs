using ClinicAPI.DAL.Models;
using ClinicAPI.DAL.Repositories.Interfaces;

namespace ClinicAPI.DAL.Repositories
{
    public interface IRoleRepository : IRepository<Role>
    { }

    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(ClinicDbContext context) : base(context)
        { }
    }
}
