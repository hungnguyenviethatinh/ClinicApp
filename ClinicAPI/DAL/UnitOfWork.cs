using ClinicAPI.DAL.Repositories;
using System.Threading.Tasks;

namespace ClinicAPI.DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ClinicDbContext _context;

        IUserRepository _users;
        IRoleRepository _roles;
        IRightRepository _rights;
        IUserRoleRepository _userRoles;
        IRoleRightRepository _roleRights;

        public UnitOfWork(ClinicDbContext context)
        {
            _context = context;
        }

        public IUserRepository Users
        {
            get
            {
                if (_users == null)
                {
                    _users = new UserRepository(_context);
                }

                return _users;
            }
        }

        public IRoleRepository Roles
        {
            get
            {
                if (_roles == null)
                {
                    _roles = new RoleRepository(_context);
                }

                return _roles;
            }
        }

        public IRightRepository Rights
        {
            get
            {
                if (_rights == null)
                {
                    _rights = new RightRepository(_context);
                }

                return _rights;
            }
        }

        public IUserRoleRepository UserRoles
        {
            get
            {
                if (_userRoles == null)
                {
                    _userRoles = new UserRoleRepository(_context);
                }

                return _userRoles;
            }
        }

        public IRoleRightRepository RoleRights
        {
            get
            {
                if (_roleRights == null)
                {
                    _roleRights = new RoleRightRepository(_context);
                }

                return _roleRights;
            }
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public Task<int> SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}
