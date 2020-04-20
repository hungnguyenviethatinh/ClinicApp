﻿using System;
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

        [HttpGet("patients/options")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatientOptions()
        {
            DateTime today = DateTime.Today;
            var patients = GetCurrentDoctorPatients()
                .Where(p =>
                (p.AppointmentDate == null && (p.CreatedDate.Date == today || p.UpdatedDate.Date == today)) ||
                (p.AppointmentDate != null && p.AppointmentDate.Value.Date == today))
                .Select(p => new { p.IdCode, p.Id, p.FullName });

            return Ok(patients);
        }

        [HttpGet("patients")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatients([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var patients = GetCurrentDoctorPatients();
            int totalCount = patients.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                patients = patients
                    .Where(p =>
                        $"{p.IdCode}{p.Id}".Equals(query, StringComparison.OrdinalIgnoreCase) ||
                        p.FullName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        p.PhoneNumber.Contains(query, StringComparison.OrdinalIgnoreCase))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                patients = patients
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            var patientVMs = GetPatientViewModels(patients);

            return Ok(new[]
            {
                new
                {
                    totalCount,
                    patients = patientVMs,
                },
            });
        }

        [HttpGet("patients/queue")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatientsInQueue()
        {
            DateTime today = DateTime.Today;
            var patients = GetCurrentDoctorPatients()
                .Where(p =>
                p.Status != PatientStatus.IsChecked &&
                ((p.AppointmentDate == null && (p.CreatedDate.Date == today || p.UpdatedDate.Date == today)) ||
                (p.AppointmentDate != null && p.AppointmentDate.Value.Date == today)))
                .OrderBy(p => p.OrderNumber);

            var patientVMs = GetPatientViewModels(patients);

            return Ok(patientVMs);
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

            var prescriptionVMs = _mapper.Map<IEnumerable<PrescriptionViewModel>>(prescriptions);

            return Ok(prescriptionVMs);
        }

        [HttpGet("prescriptions/queue")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptionsInQueue()
        {
            DateTime today = DateTime.Today;
            var prescriptions = GetCurrentDoctorPrescriptions()
                .Where(p => p.CreatedDate.Date == today || p.UpdatedDate.Date == today)
                .OrderBy(p => p.UpdatedDate);

            var prescriptionVMs = _mapper.Map<IEnumerable<PrescriptionViewModel>>(prescriptions);

            return Ok(prescriptionVMs);
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

            var prescriptionVM = _mapper.Map<PrescriptionViewModel>(prescription);
            var patient = _mapper.Map<PatientBasicViewModel>(prescription.Patient);

            prescriptionVM.Patient = patient;

            return Ok(new[] { prescriptionVM, });
        }

        [HttpGet("prescriptionlist/{patientId}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptionList(int patientId, [FromQuery] int page, [FromQuery] int pageSize)
        {
            var prescriptions = _unitOfWork.Prescriptions.GetPrescriptionList(patientId);
            int totalCount = prescriptions.Count();

            prescriptions = prescriptions.Skip((page - 1) * pageSize).Take(pageSize);

            var prescriptionVMs = _mapper.Map<IEnumerable<PrescriptionViewModel>>(prescriptions);

            return Ok(new[] {
                new
                {
                    totalCount,
                    prescriptions = prescriptionVMs,
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
                            int quantity = medicine.Quantity.GetValueOrDefault(0) - model.Quantity;
                            medicine.Quantity = quantity > 0 ? quantity : 0;
                            break;
                        }
                    }
                }

                //_mapper.Map(medicineUpdateModels, medicines);
                _unitOfWork.Medicines.UpdateRange(medicines);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPatch("medicines/restore")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> RestoreMedicinesQuantity([FromBody] IEnumerable<MedicineRestoreModel> medicineRestoreModels)
        {
            if (ModelState.IsValid)
            {
                if (medicineRestoreModels == null)
                {
                    return BadRequest($"{nameof(medicineRestoreModels)} can not be null.");
                }

                var medicineIds = medicineRestoreModels.Select(m => m.Id);
                var medicines = _unitOfWork.Medicines.Where(m => !m.IsDeleted && medicineIds.Contains(m.Id));

                foreach (var medicine in medicines)
                {
                    foreach (var model in medicineRestoreModels)
                    {
                        if (medicine.Id == model.Id)
                        {
                            medicine.Quantity = medicine.Quantity != null ? medicine.Quantity.Value + model.Quantity : 0;
                            break;
                        }
                    }
                }

                //_mapper.Map(medicineRestoreModels, medicines);
                _unitOfWork.Medicines.UpdateRange(medicines);
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
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPut("medicines/{prescriptionId}")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> UpdateMedicines(int prescriptionId, [FromBody] IEnumerable<PrescriptionMedicineModel> medicineModels)
        {
            if (ModelState.IsValid)
            {
                if (medicineModels == null)
                {
                    return BadRequest($"{nameof(medicineModels)} can not be null.");
                }

                var medicines = _unitOfWork.PrescriptionMedicines.Where(pm => pm.PrescriptionId == prescriptionId);
                int result;
                if (medicines.Any())
                {
                    _unitOfWork.PrescriptionMedicines.RemoveRange(medicines);
                    result = await _unitOfWork.SaveChangesAsync();
                    if (result < 1)
                    {
                        return NoContent();
                    }
                }

                var newMedicines = _mapper.Map<IEnumerable<PrescriptionMedicine>>(medicineModels);
                _unitOfWork.PrescriptionMedicines.AddRange(newMedicines);
                result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("prescriptions/{id}")]
        [Authorize(Policies.ManageAllPrescriptionsPolicy)]
        public async Task<IActionResult> DeletePrescription(int id)
        {
            var prescription = await _unitOfWork.Prescriptions.FindAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }

            prescription.IsDeleted = true;
            _unitOfWork.Prescriptions.Update(prescription);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok();
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

        private IEnumerable<PatientViewModel> GetPatientViewModels(IEnumerable<Patient> patients)
        {
            var patientVMs = _mapper.Map<IEnumerable<PatientViewModel>>(patients);
            foreach (var patient in patients)
            {
                foreach (var patientVM in patientVMs)
                {
                    if (patient.Id == patientVM.Id)
                    {
                        var dphVMs = _mapper.Map<IEnumerable<DoctorPatientHistoryViewModel>>(patient.Doctors);
                        patientVM.Doctors = dphVMs;
                        break;
                    }
                }
            }

            return patientVMs;
        }
    }
}
