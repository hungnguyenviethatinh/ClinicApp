using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Core.Interfaces;

namespace DAL
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }

    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly IAccountManager _accountManager;
        private readonly ILogger _logger;

        public DatabaseInitializer(
            ApplicationDbContext context,
            IAccountManager accountManager,
            ILogger<DatabaseInitializer> logger)
        {
            _accountManager = accountManager;
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            await _context.Database.MigrateAsync().ConfigureAwait(false);

            if (!await _context.Users.AnyAsync())
            {
                _logger.LogInformation("Generating inbuilt accounts...");

                await EnsureRoleAsync(
                    RoleConstants.AdministratorRoleName, ApplicationPermissions.GetAdministrativePermissionValues());
                await EnsureRoleAsync(
                    RoleConstants.DoctorRoleName, ApplicationPermissions.GetDoctorPermissionValues());
                await EnsureRoleAsync(
                    RoleConstants.ReceptionistRoleName, ApplicationPermissions.GetReceptionistPermissionValues());

                await CreateUserAsync(
                    "admin", "pass@123", "Inbuilt Administrator", "admin@gmail.com", "09999999", 
                    new string[] { RoleConstants.AdministratorRoleName });
                await CreateUserAsync(
                    "doctor", "pass@123", "Inbuilt Doctor", "doctor@gmail.com", "09999999", 
                    new string[] { RoleConstants.DoctorRoleName });
                await CreateUserAsync(
                    "receptionist", "pass@123", "Inbuilt Receptionist", "receptionist@gmail.com", "09999999", 
                    new string[] { RoleConstants.ReceptionistRoleName });

                _logger.LogInformation("Inbuilt account generation completed.");
            }
        }

        private async Task EnsureRoleAsync(string roleName, string[] claims)
        {
            if ((await _accountManager.GetRoleByNameAsync(roleName)) == null)
            {
                Role applicationRole = new Role(roleName);

                var (Succeeded, Errors) = await _accountManager.CreateRoleAsync(applicationRole, claims);

                if (!Succeeded)
                {
                    throw new Exception(
                        $"Seeding \"{roleName}\" role failed. Errors: {string.Join(Environment.NewLine, Errors)}");
                }
            }
        }

        private async Task<User> CreateUserAsync(
            string userName, 
            string password, 
            string fullName,
            string email, 
            string phoneNumber,
            string[] roles)
        {
            User applicationUser = new User
            {
                UserName = userName,
                FullName = fullName,
                Email = email,
                PhoneNumber = phoneNumber,
                EmailConfirmed = true,
            };

            var (Succeeded, Errors) = await _accountManager.CreateUserAsync(applicationUser, roles, password);

            if (!Succeeded)
            {
                throw new Exception(
                    $"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, Errors)}");
            }

            return applicationUser;
        }
    }
}
