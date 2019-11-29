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
        private IHistoryRepository _histories;
        private IPrescriptionMedicineRepository _prescriptionMedicines;
        private IXRayImageRepository _xRayImages;

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

        public IPrescriptionMedicineRepository PrescriptionMedicines
        {
            get
            {
                if (_prescriptionMedicines == null)
                {
                    _prescriptionMedicines = new PrescriptionMedicineRepository(_context);
                }

                return _prescriptionMedicines;
            }
        }

        public IXRayImageRepository XRayImages
        {
            get
            {
                if (_xRayImages == null)
                {
                    _xRayImages = new XRayImageRepository(_context);
                }

                return _xRayImages;
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
