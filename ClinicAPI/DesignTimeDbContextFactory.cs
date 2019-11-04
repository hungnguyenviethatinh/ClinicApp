using System.IO;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using ClinicAPI.DAL;

namespace QuickApp
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ClinicDbContext>
    {
        public ClinicDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<ClinicDbContext>();

            builder.UseSqlServer(configuration["ConnectionStrings:DefaultConnection"], b => b.MigrationsAssembly("ClinicAPI"));

            return new ClinicDbContext(builder.Options);
        }
    }
}
