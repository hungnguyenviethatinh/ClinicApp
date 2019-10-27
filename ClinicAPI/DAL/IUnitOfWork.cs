using ClinicAPI.DAL.Repositories;
using System.Threading.Tasks;

namespace ClinicAPI.DAL
{
    public interface IUnitOfWork
    {
        IUserRepository Users { get; }
        IRoleRepository Roles { get; }
        IRightRepository Rights { get; }
        IUserRoleRepository UserRoles { get; }
        IRoleRightRepository RoleRights { get; }

        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
