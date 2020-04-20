using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using ClinicAPI.Authorization;
using ClinicAPI.ViewModels;
using DAL;
using DAL.Core;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public PrescriptionController(IMapper mapper, IUnitOfWork unitOfWork, ILogger<PrescriptionController> logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("{id}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public async Task<IActionResult> GetPrescription(int id)
        {
            var prescription = await _unitOfWork.Prescriptions.GetPrescription(id);
            if (prescription == null)
            {
                return NotFound();
            }

            var prescriptionVM = _mapper.Map<PrescriptionPartialViewModel>(prescription);
            var medicines = _mapper.Map <IEnumerable<PrescriptionMedicineViewModel>>(prescription.Medicines);

            prescriptionVM.Medicines = medicines;

            return Ok(new[] { prescriptionVM, });
        }

        [HttpGet("opentimes")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetOpenTimes()
        {
            var openTimes = _unitOfWork.OpenTimes.GetAll();
            var openTimeVMs = _mapper.Map<IEnumerable<OpenTimeModel>>(openTimes);

            return Ok(openTimeVMs);
        }

        [HttpGet("status/{id}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public async Task<IActionResult> UpdatePrescriptionStatus(int id)
        {
            var prescription = _unitOfWork.Prescriptions.Find(id);
            if (prescription == null)
            {
                return NotFound();
            }

            if (prescription.Status == PrescriptionStatus.IsPrinted)
            {
                return Ok();
            }

            prescription.Status = PrescriptionStatus.IsPrinted;
            _unitOfWork.Prescriptions.Update(prescription);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok();
        }
    }
}
