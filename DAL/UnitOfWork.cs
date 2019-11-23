using System.Threading.Tasks;
using DAL.Repositories;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IUserRepository _users;
        private IRoleRepository _roles;
        private IPatientRepository _patients;
        private IPrescriptionRepository _prescriptions;
        private IMedicineRepository _medicines;
        private IDrugRepository _drugs;
        private IHistoryRepository _histories;
        private IPhotoRepository _photos;
        private IQueueRepository _queues;
        private IRequestRepository _requests;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IUserRepository Users
        {
            get
            {
                if (_users == null)
                {
                    _users = new UserRepository(_context);
                }

                return _users;
            }
        }

        public IRoleRepository Roles
        {
            get
            {
                if (_roles == null)
                {
                    _roles = new RoleRepository(_context);
                }

                return _roles;
            }
        }

        public IPatientRepository Patients
        {
            get
            {
                if (_patients == null)
                {
                    _patients = new PatientRepository(_context);
                }

                return _patients;
            }
        }
        public IPrescriptionRepository Prescriptions
        {
            get
            {
                if (_prescriptions == null)
                {
                    _prescriptions = new PrescriptionRepository(_context);
                }

                return _prescriptions;
            }
        }
        public IMedicineRepository Medicines
        {
            get
            {
                if (_medicines == null)
                {
                    _medicines = new MedicineRepository(_context);
                }

                return _medicines;
            }
        }
        public IDrugRepository Drugs
        {
            get
            {
                if (_drugs == null)
                {
                    _drugs = new DrugRepository(_context);
                }

                return _drugs;
            }
        }
        public IHistoryRepository Histories
        {
            get
            {
                if (_histories == null)
                {
                    _histories = new HistoryRepository(_context);
                }

                return _histories;
            }
        }
        public IPhotoRepository Photos
        {
            get
            {
                if (_photos == null)
                {
                    _photos = new PhotoRepository(_context);
                }

                return _photos;
            }
        }
        public IQueueRepository Queues
        {
            get
            {
                if (_queues == null)
                {
                    _queues = new QueueRepository(_context);
                }

                return _queues;
            }
        }
        public IRequestRepository Requests
        {
            get
            {
                if (_requests == null)
                {
                    _requests = new RequestRepository(_context);
                }

                return _requests;
            }
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public Task<int> SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}
