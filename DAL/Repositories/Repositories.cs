using DAL.Models;
using DAL.Models.ServiceForm;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public interface IHistoryRepository : IRepository<History>
    {
        IEnumerable<History> GetPatientHistories(int patientId);
        Task<History> GetHistory(int id);
    }

    public class HistoryRepository : Repository<History>, IHistoryRepository
    {
        public HistoryRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<History> GetPatientHistories(int patientId)
        {
            return _appContext.Histories
                .Include(h => h.Doctors).ThenInclude(d => d.Doctor)
                .Include(h => h.Prescriptions).ThenInclude(p => p.Patient)
                .Include(h => h.XRayImages)
                .Where(h => h.PatientId == patientId)
                .OrderBy(h => h.Id);
        }

        public async Task<History> GetHistory(int id)
        {
            return await _appContext.Histories
                .Include(h => h.Doctors).ThenInclude(d => d.Doctor)
                .Include(h => h.XRayImages)
                .Where(h => h.Id == id)
                .SingleOrDefaultAsync();
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }

    public interface IXRayImageRepository : IRepository<XRayImage>
    {
    }

    public class XRayImageRepository : Repository<XRayImage>, IXRayImageRepository
    {
        public XRayImageRepository(ApplicationDbContext context) : base(context)
        {
        }
    }

    public interface IPrescriptionMedicineRepository : IRepository<PrescriptionMedicine>
    {
    }

    public class PrescriptionMedicineRepository : Repository<PrescriptionMedicine>, IPrescriptionMedicineRepository
    {
        public PrescriptionMedicineRepository(ApplicationDbContext context) : base(context)
        {
        }
    }

    public interface IDiagnosisRepository : IRepository<Diagnosis>
    {
    }

    public class DiagnosisRepository : Repository<Diagnosis>, IDiagnosisRepository
    {
        public DiagnosisRepository(ApplicationDbContext context) : base(context)
        {
        }
    }

    public interface IUnitRepository : IRepository<Unit>
    {
    }

    public class UnitRepository : Repository<Unit>, IUnitRepository
    {
        public UnitRepository(ApplicationDbContext context) : base(context)
        {
        }
    }

    public interface IIngredientRepository : IRepository<Ingredient>
    {
    }

    public class IngredientRepository : Repository<Ingredient>, IIngredientRepository
    {
        public IngredientRepository(ApplicationDbContext context) : base(context)
        {
        }
    }

    public interface IOpenTimeRepository : IRepository<OpenTime>
    {
    }

    public class OpenTimeRepository : Repository<OpenTime>, IOpenTimeRepository
    {
        public OpenTimeRepository(ApplicationDbContext context) : base(context)
        {
        }
    }

    public interface IDoctorPatientHistoryRepository : IRepository<DoctorPatientHistory>
    {
    }

    public class DoctorPatientHistoryRepository : Repository<DoctorPatientHistory>, IDoctorPatientHistoryRepository
    {
        public DoctorPatientHistoryRepository(ApplicationDbContext context) : base(context)
        {
        }
    }

    public interface ICtFormRepository : IRepository<CtForm>
    {
        IEnumerable<CtForm> GetCtForms();
        IEnumerable<CtForm> GetDoctorCtForms(string doctorId);
        Task<CtForm> GetCtForm(int id);
    }

    public class CtFormRepository : Repository<CtForm>, ICtFormRepository
    {
        public CtFormRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<CtForm> GetCtForms()
        {
            return _appContext.CtForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .ToList();
        }

        public IEnumerable<CtForm> GetDoctorCtForms(string doctorId)
        {
            return _appContext.CtForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .Where(f => f.DoctorId == doctorId);
        }

        public async Task<CtForm> GetCtForm(int id)
        {
            return await _appContext.CtForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .Where(f => f.Id == id)
                .SingleOrDefaultAsync();
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }

    public interface IMriFormRepository : IRepository<MriForm>
    {
        IEnumerable<MriForm> GetMriForms();
        IEnumerable<MriForm> GetDoctorMriForms(string doctorId);
        Task<MriForm> GetMriForm(int id);
    }

    public class MriFormRepository : Repository<MriForm>, IMriFormRepository
    {
        public MriFormRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<MriForm> GetMriForms()
        {
            return _appContext.MriForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient);
        }

        public IEnumerable<MriForm> GetDoctorMriForms(string doctorId)
        {
            return _appContext.MriForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .Where(f => f.DoctorId == doctorId);
        }

        public async Task<MriForm> GetMriForm(int id)
        {
            return await _appContext.MriForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .Where(f => f.Id == id)
                .SingleOrDefaultAsync();
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }

    public interface ITestFormRepository : IRepository<TestForm>
    {
        IEnumerable<TestForm> GetTestForms();
        IEnumerable<TestForm> GetDoctorTestForms(string doctorId);
        Task<TestForm> GetTestForm(int id);
    }

    public class TestFormRepository : Repository<TestForm>, ITestFormRepository
    {
        public TestFormRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<TestForm> GetTestForms()
        {
            return _appContext.TestForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient);
        }

        public IEnumerable<TestForm> GetDoctorTestForms(string doctorId)
        {
            return _appContext.TestForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .Where(f => f.DoctorId == doctorId);
        }

        public async Task<TestForm> GetTestForm(int id)
        {
            return await _appContext.TestForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .Where(f => f.Id == id)
                .SingleOrDefaultAsync();
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }

    public interface IXqFormRepository : IRepository<XqForm>
    {
        IEnumerable<XqForm> GetXqForms();
        IEnumerable<XqForm> GetDoctorXqForms(string doctorId);
        Task<XqForm> GetXqForm(int id);
    }

    public class XqFormRepository : Repository<XqForm>, IXqFormRepository
    {
        public XqFormRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<XqForm> GetXqForms()
        {
            return _appContext.XqForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient);
        }

        public IEnumerable<XqForm> GetDoctorXqForms(string doctorId)
        {
            return _appContext.XqForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .Where(f => f.DoctorId == doctorId);
        }

        public async Task<XqForm> GetXqForm(int id)
        {
            return await _appContext.XqForms
                .Include(f => f.Doctor)
                .Include(f => f.Patient)
                .Where(f => f.Id == id)
                .SingleOrDefaultAsync();
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
    }
}
