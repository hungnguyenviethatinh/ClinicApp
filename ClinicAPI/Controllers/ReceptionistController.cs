﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ClinicAPI.Authorization;
using ClinicAPI.ViewModels;
using DAL;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(
        AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme,
        Roles = RoleConstants.ReceptionistRoleName)]
    [Route("api/[controller]")]
    [ApiController]
    public class ReceptionistController : ControllerBase
    {
        private readonly IAccountManager _accountManager;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public ReceptionistController(IAccountManager accountManager, IMapper mapper, IUnitOfWork unitOfWork, ILogger<ReceptionistController> logger)
        {
            _accountManager = accountManager;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _accountManager.GetUsersByRoleNameAsync(RoleConstants.DoctorRoleName);

            return Ok(doctors);
        }

        [HttpGet("patients")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatients([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            List<Patient> patients = new List<Patient>();
            if (!string.IsNullOrEmpty(query))
            {
                int.TryParse(query, out int id);

                patients = _unitOfWork.Patients
                    .Where(p => (p.Id == id || p.FullName == query || p.PhoneNumber == query))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
            }
            else
            {
                patients = _unitOfWork.Patients
                    .GetAll()
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
            }

            foreach (var patient in patients)
            {
                patient.Doctor = _unitOfWork.Users.Find(patient.DoctorId);
            }

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

            patient.Doctor = _unitOfWork.Users.Find(patient.DoctorId);

            return Ok(patient);
        }

        [HttpPost("patients")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> AddPatient([FromBody] PatientModel patientModel)
        {
            if (ModelState.IsValid)
            {
                if (patientModel == null)
                {
                    return BadRequest($"{nameof(patientModel)} can not be null.");
                }

                Patient patient = _mapper.Map<Patient>(patientModel);
                _unitOfWork.Patients.Add(patient);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(patient);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("histories")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> AddHistory([FromBody] HistoryModel historyModel)
        {
            if (ModelState.IsValid)
            {
                if (historyModel == null)
                {
                    return BadRequest($"{nameof(historyModel)} can not be null.");
                }

                History history = _mapper.Map<History>(historyModel);
                _unitOfWork.Histories.Add(history);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(history);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("xrays")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> AddXRays([FromBody] IEnumerable<XRayModel> xRayModels)
        {
            if (ModelState.IsValid)
            {
                if (xRayModels == null)
                {
                    return BadRequest($"{nameof(xRayModels)} can not be null.");
                }

                IEnumerable<XRayImage> xRayImages = _mapper.Map<IEnumerable<XRayImage>>(xRayModels);
                _unitOfWork.XRayImages.AddRange(xRayImages);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPut("patients/{id}")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientModel patientModel)
        {
            var patient = _unitOfWork.Patients.Find(id);
            if (patient == null)
            {
                return NotFound();
            }

            _mapper.Map(patientModel, patient);
            _unitOfWork.Patients.Update(patient);

            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok(patient);
        }

        [HttpGet("prescriptions")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptions([FromQuery] int page, [FromQuery] int pageSize)
        {
            var prescriptions = _unitOfWork.Prescriptions
                .GetAll()
                .Skip((page - 1) * pageSize)
                .Take(pageSize);

            foreach(var prescription in prescriptions)
            {
                prescription.Doctor = _unitOfWork.Users.Find(prescription.DoctorId);
                prescription.Patient = _unitOfWork.Patients.Find(prescription.PatientId);
            }

            return Ok(prescriptions);
        }

        [HttpGet("prescriptions/{id}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public async Task<IActionResult> GetPrescription(int id)
        {
            var prescription = await  _unitOfWork.Prescriptions.FindAsync(id);
            if (prescription == null)
            {
                return NotFound();
            }

            prescription.Doctor = _unitOfWork.Users.Find(prescription.DoctorId);
            prescription.Patient = _unitOfWork.Patients.Find(prescription.PatientId);

            return Ok(prescription);
        }
    }
}