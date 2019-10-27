using ClinicAPI.DAL.Models;
using ClinicAPI.DAL.Repositories.Interfaces;

namespace ClinicAPI.DAL.Repositories
{
    public interface IUserRepository : IRepository<User>
    { }

    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ClinicDbContext context) : base(context)
        { }
    }
}
