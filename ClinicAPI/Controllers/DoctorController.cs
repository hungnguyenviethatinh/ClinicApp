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
            var medicines = _unitOfWork.Medicines
                .Where(m => !m.IsDeleted)
                .Select(m => new { m.Id, m.Name, m.NetWeight, m.Quantity, m.Unit });

            return Ok(medicines);
        }

        [HttpGet("diagnoses")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public IActionResult GetDiagnoses()
        {
            var diagnoses = _unitOfWork.Diagnoses
                .Where(d => !d.IsDeleted)
                .Select(d => new { d.Name });

            return Ok(diagnoses);
        }

        [HttpGet("units")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public IActionResult GetUnits()
        {
            var units = _unitOfWork.Units
                .Where(u => !u.IsDeleted)
                .Select(u => new { u.Name });

            return Ok(units);
        }

        [HttpGet("ingredients")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public IActionResult GetIngredients()
        {
            var ingredients = _unitOfWork.Ingredients
                .GetAll()
                .Select(i => new { i.MedicineId, i.Name });

            return Ok(ingredients);
        }

        //[HttpGet("ingredients/{medicineId}")]
        //[Authorize(Policies.ManageAllPrescriptionsPolicy)]
        //public IActionResult GetIngredients(int medicineId)
        //{
        //    var ingredients = _unitOfWork.Ingredients
        //        .Where(i => i.MedicineId == medicineId)
        //        .Select(i => new { i.Name });

        //    return Ok(ingredients);
        //}

        [HttpGet("patients")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatients([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var patients = GetCurrentDoctorPatients();
            int totalCount = patients.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                //int.TryParse(query, out int id);

                patients = patients
                    .Where(p => (
                        //p.Id == id ||
                        ($"{p.IdCode}{p.Id}".Equals(query, StringComparison.OrdinalIgnoreCase)) ||
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
            var patients = GetCurrentDoctorPatients()
                .Where(p =>
                (p.Status != PatientStatus.IsChecked &&
                (p.AppointmentDate == null || p.AppointmentDate <= DateTime.Now)))
                .OrderBy(p => p.UpdatedDate);

            return Ok(patients);
        }

        [HttpGet("patients/current/{id}")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetCurrentPatient(int id)
        {
            //var patient = GetCurrentDoctorPatients()
            //    .Where(p => (p.Status == PatientStatus.IsChecking))
            //    .OrderBy(p => p.UpdatedDate)
            //    .FirstOrDefault();
            var patient = _unitOfWork.Patients.Find(id);

            if (patient == null)
            {
                return NotFound();
            }

            var history = _unitOfWork.Histories
                .Where(h => (h.PatientId == id && !h.IsChecked))
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

        [HttpGet("patients/update/{id}/{status}")]
        public async Task<IActionResult> UpdatePatientStatus(int id, PatientStatus status)
        {
            if (status == PatientStatus.IsChecking)
            {
                var patients = GetCurrentDoctorPatients()
                    .Where(p => (p.Status == PatientStatus.IsChecking));
                if (patients.Any())
                {
                    return NoContent();
                }
            }

            var patient = _unitOfWork.Patients.Find(id);
            if (patient == null)
            {
                return NotFound();
            }

            patient.Status = status;
            _unitOfWork.Patients.Update(patient);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok();
        }

        [HttpPatch("patients/{id}")]
        public async Task<IActionResult> UpdatePatientHistory(int id, [FromBody] PatientHistoryUpdateModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var patient = _unitOfWork.Patients.Find(id);
                if (patient == null)
                {
                    return NotFound();
                }

                _mapper.Map(model, patient);
                _unitOfWork.Patients.Update(patient);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                var history = _unitOfWork.Histories
                    .Where(h => (h.PatientId == id && !h.IsChecked))
                    .FirstOrDefault();
                if (history == null)
                {
                    return Ok();
                }

                history.IsChecked = true;
                _unitOfWork.Histories.Update(history);
                result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest();
        }

        [HttpGet("prescriptions")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptions()
        {
            var prescriptions = GetCurrentDoctorPrescriptions();

            return Ok(prescriptions);
        }

        [HttpGet("prescriptions/queue")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptionsInQueue()
        {
            var prescriptions = GetCurrentDoctorPrescriptions()
                .Where(p => (p.Status == PrescriptionStatus.IsNew))
                .OrderBy(p => p.UpdatedDate);

            return Ok(prescriptions);
        }

        [HttpGet("prescriptions/{id}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public async Task<IActionResult> GetPrescription(int id)
        {
            var prescription = await _unitOfWork.Prescriptions.GetDoctorPrescription(id);
            if (prescription == null)
            {
                return NotFound();
            }

            return Ok(new[] { prescription, });
        }

        [HttpGet("prescriptionlist/{patientId}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptionList(int patientId, [FromQuery] int page, [FromQuery] int pageSize)
        {
            var prescriptions = _unitOfWork.Prescriptions.GetPrescriptionList(patientId);
            int totalCount = prescriptions.Count();

            prescriptions = prescriptions.Skip((page - 1) * pageSize).Take(pageSize);

            return Ok(new[] {
                new
                {
                    totalCount,
                    prescriptions,
                }
            });
        }

        [HttpGet("medicinelist/{prescriptionId}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetMedicineList(int prescriptionId)
        {
            var medicines = _unitOfWork.PrescriptionMedicines.Where(pm => !pm.IsDeleted && pm.PrescriptionId == prescriptionId);

            return Ok(medicines);
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
                prescription.DoctorId = GetCurrentUserId();
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

        [HttpPatch("medicines/quantity")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> UpdateMedicinesQuantity([FromBody] IEnumerable<MedicineUpdateModel> medicineUpdateModels)
        {
            if (ModelState.IsValid)
            {
                if (medicineUpdateModels == null)
                {
                    return BadRequest($"{nameof(medicineUpdateModels)} can not be null.");
                }

                var medicineIds = medicineUpdateModels.Select(m => m.Id);
                var medicines = _unitOfWork.Medicines.Where(m => !m.IsDeleted && medicineIds.Contains(m.Id));

                foreach (var medicine in medicines)
                {
                    foreach (var model in medicineUpdateModels)
                    {
                        if (medicine.Id == model.Id)
                        {
                            medicine.Quantity -= model.Quantity;
                            break;
                        }
                    }
                }

                _unitOfWork.Medicines.UpdateRange(medicines);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(medicines);
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

        private IEnumerable<Patient> GetCurrentDoctorPatients()
        {
            string currentDoctorId = GetCurrentUserId();
            var patientIds = _unitOfWork.DoctorPatientHistories
                .Where(dp => dp.DoctorId == currentDoctorId)
                .Select(dp => dp.PatientId);
            var patients = _unitOfWork.Patients
                .Where(p => (!p.IsDeleted && patientIds.Contains(p.Id)));

            return patients;
        }

        private IEnumerable<Prescription> GetCurrentDoctorPrescriptions()
        {
            string currentDoctorId = GetCurrentUserId();
            var prescriptions = _unitOfWork.Prescriptions.GetDoctorPrescriptions(currentDoctorId);

            return prescriptions;
        }
    }
}
