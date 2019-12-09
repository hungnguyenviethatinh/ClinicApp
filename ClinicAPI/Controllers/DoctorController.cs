using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ClinicAPI.Authorization;
using ClinicAPI.Helpers;
using ClinicAPI.ViewModels;
using DAL;
using DAL.Core;
using DAL.Models;
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
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public DoctorController(IMapper mapper, IUnitOfWork unitOfWork, ILogger<DoctorController> logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("medicines")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public IActionResult GetMedicines()
        {
            var medicines = _unitOfWork.Medicines.Where(m => !m.IsDeleted);

            return Ok(medicines);
        }

        [HttpGet("patients")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatients([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var patients = _unitOfWork.Patients.Where(p => !p.IsDeleted && p.DoctorId == GetCurrentUserId());
            int totalCount = patients.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                int.TryParse(query, out int id);

                patients = patients
                    .Where(p => (
                        p.Id == id ||
                        p.FullName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        p.PhoneNumber.Contains(query, StringComparison.OrdinalIgnoreCase)))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                patients = patients
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            return Ok(new[]
            {
                new
                {
                    totalCount,
                    patients,
                },
            });
        }

        [HttpGet("patients/queue")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatientsInQueue()
        {
            var patients = _unitOfWork.Patients
                .Where(p => (!p.IsDeleted && p.DoctorId == GetCurrentUserId() && p.Status != PatientStatus.IsChecked))
                .OrderBy(p => p.UpdatedDate);

            return Ok(patients);
        }

        [HttpGet("patients/current")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetCurrentPatient()
        {
            var patient = _unitOfWork.Patients
                .Where(p => (p.DoctorId == GetCurrentUserId() && p.Status == PatientStatus.IsChecking))
                .OrderBy(p => p.UpdatedDate)
                .FirstOrDefault();

            if (patient == null)
            {
                return NotFound();
            }

            var history = _unitOfWork.Histories
                .Where(h => (h.PatientId == patient.Id && h.IsChecked == false))
                .OrderByDescending(h => h.UpdatedDate)
                .FirstOrDefault();

            return Ok(new[]
            {
                new
                {
                    history,
                    patient,
                },
            });
        }

        //[HttpGet("patients/{id}")]
        //[Authorize(Policies.ViewAllPatientsPolicy)]
        //public async Task<IActionResult> GetPatient(int id)
        //{
        //    var patient = await _unitOfWork.Patients.FindAsync(id);
        //    if (patient == null)
        //    {
        //        return NotFound();
        //    }

        //    var histories = _unitOfWork.Histories.Where(h => h.PatientId == id);
        //    foreach (var history in histories)
        //    {
        //        var prescriptions = _unitOfWork.Prescriptions.Where(p => p.HistoryId == history.Id);
        //        var xrays = _unitOfWork.XRayImages.Where(p => p.HistoryId == history.Id);
        //        foreach(var prescription in prescriptions)
        //        {
        //            history.Prescriptions.Add(prescription);
        //        }
        //        foreach (var xray in xrays)
        //        {
        //            history.XRayImages.Add(xray);
        //        }
        //    }

        //    return Ok(patient);
        //}

        [HttpGet("prescriptions")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptions()
        {
            var prescriptions = _unitOfWork.Prescriptions.Where(p => !p.IsDeleted && p.DoctorId == GetCurrentUserId());

            foreach (var prescription in prescriptions)
            {
                prescription.Patient = _unitOfWork.Patients.Find(prescription.PatientId);
            }

            return Ok(prescriptions);
        }

        [HttpGet("prescriptions/queue")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptionsInQueue()
        {
            var prescriptions = _unitOfWork.Prescriptions
                .Where(p => (!p.IsDeleted && p.DoctorId == GetCurrentUserId() && p.Status == PrescriptionStatus.IsNew))
                .OrderBy(p => p.UpdatedDate);

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

            return Ok(new[] { prescription, });
        }

        [HttpPost("prescriptions")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> AddPrescription([FromBody] PrescriptionModel prescriptionModel)
        {
            if (ModelState.IsValid)
            {
                if (prescriptionModel == null)
                {
                    return BadRequest($"{nameof(prescriptionModel)} can not be null.");
                }

                var prescription = _mapper.Map<Prescription>(prescriptionModel);
                _unitOfWork.Prescriptions.Add(prescription);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(prescription);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("medicines")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> AddMedicines([FromBody] IEnumerable<PrescriptionMedicineModel> medicineModels)
        {
            if (ModelState.IsValid)
            {
                if (medicineModels == null)
                {
                    return BadRequest($"{nameof(medicineModels)} can not be null.");
                }

                var medicines = _mapper.Map<IEnumerable<PrescriptionMedicine>>(medicineModels);
                _unitOfWork.PrescriptionMedicines.AddRange(medicines);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPut("prescriptions/{id}")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> UpdatePrescription(int id, PrescriptionModel prescriptionModel)
        {
            if (ModelState.IsValid)
            {
                if (prescriptionModel == null)
                {
                    return BadRequest($"{nameof(prescriptionModel)} can not be null.");
                }

                var prescription = await _unitOfWork.Prescriptions.FindAsync(id);
                if (prescription == null)
                {
                    return NotFound();
                }

                _mapper.Map(prescriptionModel, prescription);
                _unitOfWork.Prescriptions.Update(prescription);

                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 0)
                {
                    throw new Exception($"Error(s) occurred while updating {id}.");
                }

                return Ok(prescription);
            }

            return BadRequest(ModelState);
        }

        private string GetCurrentUserId()
        {
            return Utilities.GetUserId(User);
        }
    }
}
