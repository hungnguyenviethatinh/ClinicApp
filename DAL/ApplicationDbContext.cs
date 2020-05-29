using DAL.Models;
using DAL.Models.Interfaces;
using DAL.Models.ServiceForm;
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
        public DbSet<Diagnosis> Diagnoses { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<OpenTime> OpenTimes { get; set; }
        public DbSet<DoctorPatientHistory> DoctorPatientHistories { get; set; }
        public DbSet<CtForm> CtForms { get; set; }
        public DbSet<MriForm> MriForms { get; set; }
        public DbSet<TestForm> TestForms { get; set; }
        public DbSet<XqForm> XqForms { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasMany(u => u.Claims)
                .WithOne()
                .HasForeignKey(c => c.UserId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithOne()
                .HasForeignKey(r => r.UserId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(u => u.Patients)
                .WithOne(p => p.Doctor)
                .HasForeignKey(p => p.DoctorId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(u => u.Prescriptions)
                .WithOne(p => p.Doctor)
                .HasForeignKey(p => p.DoctorId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(u => u.CtForms)
                .WithOne(f => f.Doctor)
                .HasForeignKey(f => f.DoctorId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(u => u.MriForms)
                .WithOne(f => f.Doctor)
                .HasForeignKey(f => f.DoctorId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(u => u.TestForms)
                .WithOne(f => f.Doctor)
                .HasForeignKey(f => f.DoctorId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(u => u.XqForms)
                .WithOne(f => f.Doctor)
                .HasForeignKey(f => f.DoctorId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Role>()
                .HasMany(r => r.Claims)
                .WithOne()
                .HasForeignKey(c => c.RoleId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Role>()
                .HasMany(r => r.Users)
                .WithOne()
                .HasForeignKey(r => r.RoleId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Patient>()
                .Property(p => p.FullName).IsRequired().HasMaxLength(100);
            builder.Entity<Patient>()
                .Property(p => p.IdCode).HasMaxLength(30);
            builder.Entity<Patient>()
                .Property(p => p.Address).HasMaxLength(200);
            builder.Entity<Patient>()
                .Property(p => p.PhoneNumber).IsUnicode(false).HasMaxLength(100);
            builder.Entity<Patient>()
                .Property(p => p.RelativePhoneNumber).IsUnicode(false).HasMaxLength(100);
            builder.Entity<Patient>()
                .HasMany(p => p.Doctors)
                .WithOne(d => d.Patient)
                .HasForeignKey(d => d.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.Histories)
                .WithOne(h => h.Patient)
                .HasForeignKey(h => h.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.Prescriptions)
                .WithOne(pr => pr.Patient)
                .HasForeignKey(pr => pr.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.XRayImages)
                .WithOne(x => x.Patient)
                .HasForeignKey(x => x.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.CtForms)
                .WithOne(f => f.Patient)
                .HasForeignKey(f => f.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.MriForms)
                .WithOne(f => f.Patient)
                .HasForeignKey(f => f.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.TestForms)
                .WithOne(f => f.Patient)
                .HasForeignKey(f => f.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Patient>()
                .HasMany(p => p.XqForms)
                .WithOne(f => f.Patient)
                .HasForeignKey(f => f.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Prescription>()
                .Property(p => p.IdCode).HasMaxLength(30);
            builder.Entity<Prescription>()
                .HasOne(p => p.Patient)
                .WithMany(pt => pt.Prescriptions)
                .HasForeignKey(p => p.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Prescription>()
                .HasOne(p => p.Doctor)
                .WithMany(d => d.Prescriptions)
                .HasForeignKey(p => p.DoctorId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Prescription>()
                .HasOne(p => p.History)
                .WithMany(h => h.Prescriptions)
                .HasForeignKey(p => p.HistoryId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Prescription>()
                .HasMany(p => p.Medicines)
                .WithOne(pm => pm.Prescription)
                .HasForeignKey(pm => pm.PrescriptionId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Medicine>()
                .Property(m => m.Name).IsRequired().HasMaxLength(100);
            builder.Entity<Medicine>()
               .Property(m => m.IdCode).HasMaxLength(30);
            builder.Entity<Medicine>()
               .Property(m => m.ExpiredDate).HasMaxLength(30);
            builder.Entity<Medicine>()
                .Property(m => m.NetWeight).HasMaxLength(30);
            builder.Entity<Medicine>()
                .Property(m => m.Unit).HasMaxLength(100);
            builder.Entity<Medicine>()
                .HasMany(m => m.Prescriptions)
                .WithOne(pm => pm.Medicine)
                .HasForeignKey(pm => pm.MedicineId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Medicine>()
                .HasMany(m => m.Ingredients)
                .WithOne(i => i.Medicine)
                .HasForeignKey(i => i.MedicineId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<History>()
                .Property(h => h.Height).HasMaxLength(10);
            builder.Entity<History>()
                .Property(h => h.Weight).HasMaxLength(10);
            builder.Entity<History>()
                .Property(h => h.BloodPressure).HasMaxLength(10);
            builder.Entity<History>()
                .Property(h => h.Pulse).HasMaxLength(10);
            builder.Entity<History>()
                .Property(h => h.Other).HasMaxLength(100);
            builder.Entity<History>()
                .Property(h => h.Note).HasMaxLength(100);
            builder.Entity<History>()
                .HasOne(h => h.Patient)
                .WithMany(p => p.Histories)
                .HasForeignKey(h => h.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);
            builder.Entity<History>()
                .HasMany(h => h.Prescriptions)
                .WithOne(p => p.History)
                .HasForeignKey(p => p.HistoryId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<History>()
                .HasMany(h => h.XRayImages)
                .WithOne(x => x.History)
                .HasForeignKey(x => x.HistoryId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<History>()
                .HasMany(h => h.Doctors)
                .WithOne(d => d.History)
                .HasForeignKey(d => d.HistoryId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PrescriptionMedicine>()
                .HasKey(pm => new { pm.PrescriptionId, pm.MedicineId });
            builder.Entity<PrescriptionMedicine>()
                .Property(pm => pm.Ingredient).HasMaxLength(100);
            builder.Entity<PrescriptionMedicine>()
                .Property(pm => pm.NetWeight).HasMaxLength(30);
            builder.Entity<PrescriptionMedicine>()
                .Property(pm => pm.TakePeriod).HasMaxLength(30);
            builder.Entity<PrescriptionMedicine>()
                .Property(pm => pm.TakeMethod).HasMaxLength(50);
            builder.Entity<PrescriptionMedicine>()
                .Property(pm => pm.Unit).HasMaxLength(100);
            builder.Entity<PrescriptionMedicine>()
                .Property(pm => pm.MealTime).HasMaxLength(30);
            builder.Entity<PrescriptionMedicine>()
                .Property(pm => pm.Note).HasMaxLength(100);
            builder.Entity<PrescriptionMedicine>()
                .HasOne(pm => pm.Prescription)
                .WithMany(p => p.Medicines)
                .HasForeignKey(pm => pm.PrescriptionId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);
            builder.Entity<PrescriptionMedicine>()
                .HasOne(pm => pm.Medicine)
                .WithMany(p => p.Prescriptions)
                .HasForeignKey(pm => pm.MedicineId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);

            builder.Entity<XRayImage>()
                .Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.Entity<XRayImage>()
                .Property(x => x.Data).IsUnicode(false).IsRequired();
            builder.Entity<XRayImage>()
                .HasOne(x => x.Patient)
                .WithMany(p => p.XRayImages)
                .HasForeignKey(x => x.PatientId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);
            builder.Entity<XRayImage>()
                .HasOne(x => x.History)
                .WithMany(h => h.XRayImages)
                .HasForeignKey(x => x.HistoryId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Diagnosis>()
                .Property(d => d.Name).IsRequired().HasMaxLength(100);

            builder.Entity<Unit>()
                .Property(u => u.Name).IsRequired().HasMaxLength(15);

            builder.Entity<Ingredient>()
                .Property(i => i.Name).IsRequired().HasMaxLength(100);
            builder.Entity<Ingredient>()
                .HasOne(i => i.Medicine)
                .WithMany(m => m.Ingredients)
                .HasForeignKey(i => i.MedicineId)
                .IsRequired().OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OpenTime>()
                .Property(o => o.OpenClosedTime).IsRequired().HasMaxLength(100);

            builder.Entity<DoctorPatientHistory>()
                .HasKey(dp => new { dp.DoctorId, dp.PatientId, dp.HistoryId });

            builder.Entity<CtForm>()
                .Property(f => f.IdCode).HasMaxLength(30);
            builder.Entity<CtForm>()
                .HasOne(f => f.Doctor)
                .WithMany(d => d.CtForms)
                .HasForeignKey(f => f.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<CtForm>()
                .HasOne(f => f.Patient)
                .WithMany(p => p.CtForms)
                .HasForeignKey(f => f.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<MriForm>()
                .Property(f => f.IdCode).HasMaxLength(30);
            builder.Entity<MriForm>()
                .HasOne(f => f.Doctor)
                .WithMany(d => d.MriForms)
                .HasForeignKey(f => f.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<MriForm>()
                .HasOne(f => f.Patient)
                .WithMany(p => p.MriForms)
                .HasForeignKey(f => f.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<TestForm>()
                .Property(f => f.IdCode).HasMaxLength(30);
            builder.Entity<TestForm>()
                .HasOne(f => f.Doctor)
                .WithMany(d => d.TestForms)
                .HasForeignKey(f => f.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<TestForm>()
                .HasOne(f => f.Patient)
                .WithMany(p => p.TestForms)
                .HasForeignKey(f => f.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<XqForm>()
                .Property(f => f.IdCode).HasMaxLength(30);
            builder.Entity<XqForm>()
                .HasOne(f => f.Doctor)
                .WithMany(d => d.XqForms)
                .HasForeignKey(f => f.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<XqForm>()
                .HasOne(f => f.Patient)
                .WithMany(p => p.XqForms)
                .HasForeignKey(f => f.PatientId)
                .OnDelete(DeleteBehavior.Restrict);
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
                DateTime now = DateTime.Now;

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
