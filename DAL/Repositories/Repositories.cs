using DAL.Models;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public interface IDrugRepository : IRepository<Drug>
    {

    }

    public class DrugRepository : Repository<Drug>, IDrugRepository
    {
        public DrugRepository(ApplicationDbContext context) : base(context)
        {

        }
    }

    public interface IHistoryRepository : IRepository<History>
    {

    }

    public class HistoryRepository : Repository<History>, IHistoryRepository
    {
        public HistoryRepository(ApplicationDbContext context) : base(context)
        {

        }
    }

    public interface IPhotoRepository : IRepository<Photo>
    {

    }

    public class PhotoRepository : Repository<Photo>, IPhotoRepository
    {
        public PhotoRepository(ApplicationDbContext context) : base(context)
        {

        }
    }

    public interface IQueueRepository : IRepository<Queue>
    {

    }

    public class QueueRepository : Repository<Queue>, IQueueRepository
    {
        public QueueRepository(ApplicationDbContext context) : base(context)
        {

        }
    }

    public interface IRequestRepository : IRepository<Request>
    {

    }

    public class RequestRepository : Repository<Request>, IRequestRepository
    {
        public RequestRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}
