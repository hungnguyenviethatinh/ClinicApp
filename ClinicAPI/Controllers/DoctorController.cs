using System;
using System.Threading.Tasks;
using ClinicAPI.Authorization;
using ClinicAPI.Helpers;
using DAL;
using DAL.Core;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(
        AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme,
        Roles = RoleConstants.DoctorRoleName)]
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public DoctorController(IUnitOfWork unitOfWork, ILogger logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("patients")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatients()
        {
            var patients = _unitOfWork.Patients.Where(p => p.DoctorId == GetCurrentUserId());

            return Ok(patients);
        }

        [HttpGet("patients/{id}")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _unitOfWork.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }

        [HttpGet("prescriptions")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptions()
        {
            var prescriptions = _unitOfWork.Prescriptions.Where(p => p.DoctorId == GetCurrentUserId());

            foreach (var prescription in prescriptions)
            {
                prescription.Patient = _unitOfWork.Patients.Find(prescription.PatientId);
            }

            return Ok(prescriptions);
        }

        [HttpGet("prescriptions/{id}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public async Task<IActionResult> GetPrescription(int id)
        {
            var prescription = await _unitOfWork.Prescriptions.FindAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }

            prescription.Patient = _unitOfWork.Patients.Find(prescription.PatientId);

            return Ok(prescription);
        }

        [HttpPost("prescriptions")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> AddPrescription()
        {
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 0)
            {
                throw new Exception($"Error(s) occurred while adding");
            }

            return Ok();
        }

        [HttpPut("prescriptions/{id}")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> UpdatePrescription(int id)
        {
            var prescription = await _unitOfWork.Prescriptions.FindAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }

            _unitOfWork.Prescriptions.Update(prescription);

            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 0)
            {
                throw new Exception($"Error(s) occurred while updating {id}.");
            }

            return Ok(prescription);
        }

        private string GetCurrentUserId()
        {
            return Utilities.GetUserId(User);
        }
    }
}
