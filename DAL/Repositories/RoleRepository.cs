using DAL.Models;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public interface IRoleRepository : IRepository<Role>
    {
    }

    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
