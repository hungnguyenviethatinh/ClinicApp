using DAL.Models;
using DAL.Models.Interfaces;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DAL
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, string>
    {
        public string CurrentUserId { get; set; }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Drug> Drugs { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Queue> Queues { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasMany(u => u.Claims)
                .WithOne().HasForeignKey(c => c.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithOne().HasForeignKey(r => r.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Role>()
                .HasMany(r => r.Claims)
                .WithOne().HasForeignKey(c => c.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Role>()
                .HasMany(r => r.Users)
                .WithOne().HasForeignKey(r => r.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<User>().Property(u => u.StatusCode).HasDefaultValue(0);
            builder.Entity<User>().Property(u => u.IsDeleted).HasDefaultValue(false);

            builder.Entity<Patient>().HasKey(p => p.ID);
            builder.Entity<Patient>()
                .HasMany(p => p.Histories)
                .WithOne().HasForeignKey(h => h.PatientID).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.Photos)
                .WithOne().HasForeignKey(p => p.PatientID).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.Prescriptions)
                .WithOne().HasForeignKey(p => p.PatientID).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>().ToTable("DanhSachBenhNhan");

            builder.Entity<Prescription>().HasKey(p => p.ID);
            builder.Entity<Prescription>().ToTable("DanhSachToaThuoc");

            builder.Entity<Medicine>().HasKey(m => m.ID);
            builder.Entity<Medicine>().ToTable("DanhSachThuoc");

            builder.Entity<Drug>().HasKey(d => d.ID);
            builder.Entity<Drug>().Property(d => d.ID).ValueGeneratedOnAdd();
            builder.Entity<Drug>().ToTable("DonThuoc");

            builder.Entity<Request>().HasKey(r => r.ID);
            builder.Entity<Request>().Property(r => r.ID).ValueGeneratedOnAdd();
            builder.Entity<Request>().ToTable("DonChiDinh");

            builder.Entity<History>().HasKey(h => h.ID);
            builder.Entity<History>().Property(h => h.ID).ValueGeneratedOnAdd();
            builder.Entity<History>().ToTable("LichSuKhamBenh");

            builder.Entity<Photo>().HasKey(p => p.ID);
            builder.Entity<Photo>().Property(p => p.ID).ValueGeneratedOnAdd();
            builder.Entity<Photo>().ToTable("HinhAnh");

            builder.Entity<Queue>().HasKey(q => q.ID);
            builder.Entity<Queue>().ToTable("HangChoKhamBenh");
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

        public override Task<int> SaveChangesAsync(
            bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = default)
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
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }

                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }
    }
}
