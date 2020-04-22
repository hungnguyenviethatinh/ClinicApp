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
        private IDiagnosisRepository _diagnoses;
        private IUnitRepository _units;
        private IIngredientRepository _ingredients;
        private IOpenTimeRepository _openTimes;
        private IDoctorPatientHistoryRepository _doctorPatients;
        private ICtFormRepository _ctForms;
        private IMriFormRepository _mriForms;
        private ITestFormRepository _testForms;
        private IXqFormRepository _xqForms;

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

        public IDiagnosisRepository Diagnoses
        {
            get
            {
                if (_diagnoses == null)
                {
                    _diagnoses = new DiagnosisRepository(_context);
                }

                return _diagnoses;
            }
        }

        public IUnitRepository Units
        {
            get
            {
                if (_units == null)
                {
                    _units = new UnitRepository(_context);
                }

                return _units;
            }
        }

        public IIngredientRepository Ingredients
        {
            get
            {
                if (_ingredients == null)
                {
                    _ingredients = new IngredientRepository(_context);
                }

                return _ingredients;
            }
        }

        public IOpenTimeRepository OpenTimes
        {
            get
            {
                if (_openTimes == null)
                {
                    _openTimes = new OpenTimeRepository(_context);
                }

                return _openTimes;
            }
        }

        public IDoctorPatientHistoryRepository DoctorPatientHistories
        {
            get
            {
                if (_doctorPatients == null)
                {
                    _doctorPatients = new DoctorPatientHistoryRepository(_context);
                }

                return _doctorPatients;
            }
        }

        public ICtFormRepository CtForms
        {
            get
            {
                if (_ctForms == null)
                {
                    _ctForms = new CtFormRepository(_context);
                }

                return _ctForms;
            }
        }

        public IMriFormRepository MriForms
        {
            get
            {
                if (_mriForms == null)
                {
                    _mriForms = new MriFormRepository(_context);
                }

                return _mriForms;
            }
        }

        public ITestFormRepository TestForms
        {
            get
            {
                if (_testForms == null)
                {
                    _testForms = new TestFormRepository(_context);
                }

                return _testForms;
            }
        }

        public IXqFormRepository XqForms
        {
            get
            {
                if (_xqForms == null)
                {
                    _xqForms = new XqFormRepository(_context);
                }

                return _xqForms;
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
