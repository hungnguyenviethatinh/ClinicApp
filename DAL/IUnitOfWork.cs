﻿using DAL.Repositories;
using System.Threading.Tasks;

namespace DAL
{
    public interface IUnitOfWork
    {
        IUserRepository Users { get; }
        IRoleRepository Roles { get; }
        IPatientRepository Patients { get; }
        IPrescriptionRepository Prescriptions { get; }
        IMedicineRepository Medicines { get; }
        IHistoryRepository Histories { get; }
        IPrescriptionMedicineRepository PrescriptionMedicines { get; }
        IXRayImageRepository XRayImages { get; }
        IDiagnosisRepository Diagnoses { get; }
        IUnitRepository Units { get; }
        IIngredientRepository Ingredients { get; }
        IOpenTimeRepository OpenTimes { get;  }
        IDoctorpatientRepository DoctorPatients { get; }

        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
