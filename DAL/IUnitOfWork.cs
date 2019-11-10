using System.Threading.Tasks;

namespace DAL
{
    public interface IUnitOfWork
    {
        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
