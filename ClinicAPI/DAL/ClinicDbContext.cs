using ClinicAPI.DAL.Models;
using ClinicAPI.DAL.Models.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ClinicAPI.DAL
{
    public class ClinicDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Right> Rights { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RoleRight> RoleRights { get; set; }

        public ClinicDbContext(DbContextOptions options) : base(options)
        { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasKey(u => u.ID);
            modelBuilder.Entity<Role>().HasKey(r => r.ID);
            modelBuilder.Entity<Right>().HasKey(r => r.ID);
            modelBuilder.Entity<UserRole>().HasKey(u => new { u.UserID, u.RoleID });
            modelBuilder.Entity<RoleRight>().HasKey(r => new { r.RoleID, r.RightID });

            modelBuilder.Entity<User>().HasMany(u => u.Roles)
                .WithOne().HasForeignKey(r => r.UserID).IsRequired().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Role>().HasMany(r => r.Users)
                .WithOne().HasForeignKey(u => u.RoleID).IsRequired().OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Role>().HasMany(r => r.Rights)
                .WithOne().HasForeignKey(r => r.RoleID).IsRequired().OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>().HasIndex(u => u.UserName).IsUnique();
            modelBuilder.Entity<Role>().HasIndex(r => r.Name).IsUnique();
            modelBuilder.Entity<Right>().HasIndex(r => r.Name).IsUnique();

            modelBuilder.Entity<User>().Property(u => u.UserName).IsRequired();
            modelBuilder.Entity<Role>().Property(r => r.Name).IsRequired();
            modelBuilder.Entity<Right>().Property(r => r.Name).IsRequired();
        }

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }


        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }


        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.Now;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                }
                else
                {
                    Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }

                entity.UpdatedDate = now;
            }
        }
    }
}
