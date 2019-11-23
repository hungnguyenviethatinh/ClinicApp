using DAL.Repositories;
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
        IDrugRepository Drugs { get; }
        IHistoryRepository Histories { get; }
        IPhotoRepository Photos { get; }
        IQueueRepository Queues { get; }
        IRequestRepository Requests { get; }

        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
