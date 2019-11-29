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
        public DbSet<History> Histories { get; set; }
        public DbSet<PrescriptionMedicine> PrescriptionMedicines { get; set; }
        public DbSet<XRayImage> XRayImages { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            const string decimalType = "decimal(18,2)";

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

            builder.Entity<Patient>()
                .Property(p => p.FullName).IsRequired().HasMaxLength(30);
            builder.Entity<Patient>()
                .Property(p => p.Address).HasMaxLength(150);
            builder.Entity<Patient>()
                .Property(p => p.Email).HasMaxLength(50);
            builder.Entity<Patient>()
                .Property(p => p.PhoneNumber).IsUnicode(false).HasMaxLength(20);
            builder.Entity<Patient>()
                .HasMany(p => p.Histories)
                .WithOne().HasForeignKey(h => h.PatientId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Prescription>()
                .HasMany(p => p.PrescriptionMedicines)
                .WithOne().HasForeignKey(pm => pm.PrescriptionId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Medicine>()
                .Property(m => m.Name).IsRequired().HasMaxLength(100);
            builder.Entity<Medicine>()
                .HasIndex(m => m.Name).IsUnique();
            builder.Entity<Medicine>()
                .Property(m => m.Price).HasColumnType(decimalType);

            builder.Entity<History>()
                .Property(h => h.HeartBeat).HasColumnType(decimalType);
            builder.Entity<History>()
                .Property(h => h.BloodPresure).HasColumnType(decimalType);
            builder.Entity<History>()
                .Property(h => h.Pulse).HasColumnType(decimalType);

            builder.Entity<PrescriptionMedicine>()
                .HasKey(pm => new { pm.PrescriptionId, pm.MedicineId });
            builder.Entity<PrescriptionMedicine>()
                .Property(pm => pm.Price).HasColumnType(decimalType);

            builder.Entity<XRayImage>()
                .Property(x => x.Image).IsUnicode(false).IsRequired();
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
