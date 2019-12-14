using DAL.Models;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
    public interface IHistoryRepository : IRepository<History>
    {

    }

    public class HistoryRepository : Repository<History>, IHistoryRepository
    {
        public HistoryRepository(ApplicationDbContext context) : base(context)
        {

        }
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

    public interface  IUnitRepository : IRepository<Unit>
    {

    }

    public class UnitRepository : Repository<Unit>, IUnitRepository
    {
        public UnitRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}
