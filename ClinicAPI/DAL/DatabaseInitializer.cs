using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace ClinicAPI.DAL
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }
    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly ClinicDbContext _context;
        private readonly ILogger _logger;
        public DatabaseInitializer(ClinicDbContext context, ILogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            await _context.Database.MigrateAsync().ConfigureAwait(false);

            if (!await _context.Users.AnyAsync())
            {
                _logger.LogInformation("Generating inbuilt accounts");

                _logger.LogInformation("Inbuilt account generation completed");
            }
        }
    }
}
