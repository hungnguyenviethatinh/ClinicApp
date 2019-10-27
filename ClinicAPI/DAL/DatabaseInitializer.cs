using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ClinicAPI.DAL
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }
    public class DatabaseInitializer
    {
        private readonly ClinicDbContext _context;
        public DatabaseInitializer(ClinicDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            await _context.Database.MigrateAsync().ConfigureAwait(false);

            if (!await _context.Users.AnyAsync())
            {
            }
        }
    }
}
