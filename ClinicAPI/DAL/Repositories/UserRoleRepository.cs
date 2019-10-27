using ClinicAPI.DAL.Models;
using ClinicAPI.DAL.Repositories.Interfaces;

namespace ClinicAPI.DAL.Repositories
{
    public interface IUserRoleRepository : IRepository<UserRole>
    { }

    public class UserRoleRepository : Repository<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(ClinicDbContext context) : base(context)
        { }
    }
}
