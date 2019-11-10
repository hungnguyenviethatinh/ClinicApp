using System.IO;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using DAL;

namespace ClinicAPI
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

            builder.UseSqlServer(configuration["ConnectionStrings:DefaultConnection"], b => b.MigrationsAssembly("ClinicAPI"));

            return new ApplicationDbContext(builder.Options);
        }
    }
}
