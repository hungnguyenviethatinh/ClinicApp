using System;
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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(
        AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme,
        Roles = RoleConstants.AdministratorRoleName)]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAccountManager _accountManager;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public AdminController(IAccountManager accountManager, IMapper mapper, IUnitOfWork unitOfWork, ILogger<AdminController> logger)
        {
            _accountManager = accountManager;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("roles")]
        [Authorize(Policies.ViewAllRolesPolicy)]
        public IActionResult GetRoles()
        {
            var roles = _unitOfWork.Roles.GetAll();

            return Ok(roles);
        }

        [HttpGet("patients")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatients([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var patients = _unitOfWork.Patients.GetAll();
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

            foreach (var patient in patients)
            {
                patient.Doctor = _unitOfWork.Users.Find(patient.DoctorId);
            }

            return Ok(new
            {
                totalCount,
                patients,
            });
        }

        [HttpGet("prescriptions")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptions([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var prescriptions = _unitOfWork.Prescriptions.GetAll();
            int totalCount = prescriptions.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                int.TryParse(query, out int id);
                var patientIds = _unitOfWork.Patients.Where(p => p.FullName.Contains(query, StringComparison.OrdinalIgnoreCase)).Select(p => p.Id);
                var doctorIds = _unitOfWork.Users.Where(d => d.FullName.Contains(query, StringComparison.OrdinalIgnoreCase)).Select(d => d.Id);

                prescriptions
                    .Where(p =>
                        p.PatientId == id ||
                        patientIds.Contains(p.PatientId) ||
                        doctorIds.Contains(p.DoctorId))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                prescriptions = prescriptions
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            foreach (var prescription in prescriptions)
            {
                prescription.Doctor = _unitOfWork.Users.Find(prescription.DoctorId);
                prescription.Patient = _unitOfWork.Patients.Find(prescription.PatientId);
            }

            return Ok(new
            {
                totalCount,
                prescriptions,
            });
        }

        [HttpGet("medicines")]
        [Authorize(Policies.ViewAllMedicinesPolicy)]
        public IActionResult GetMedicines([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var medicines = _unitOfWork.Medicines.GetAll();
            int totalCount = medicines.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                medicines = medicines
                    .Where(m => m.Name.Contains(query, StringComparison.OrdinalIgnoreCase))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                medicines = medicines
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            var medicineVMs = _mapper.Map<IEnumerable<MedicineViewModel>>(medicines);
            foreach (var medicine in medicineVMs)
            {
                medicine.Status = medicine.Quantity <= 0 ? MedicineStatus.No : MedicineStatus.Yes;
            }
            return Ok(new
            {
                totalCount,
                medicines = medicineVMs,
            });
        }

        [HttpGet("medicines/{id}")]
        [Authorize(Policies.ViewAllMedicinesPolicy)]
        public async Task<IActionResult> GetMedicine(int id)
        {
            var medicine = await _unitOfWork.Medicines.FindAsync(id);
            if (medicine == null)
            {
                return NotFound();
            }

            return Ok(medicine);
        }

        [HttpPost("medicines")]
        [Authorize(Policies.ManageAllMedicinesPolicy)]
        public async Task<IActionResult> AddMedicine([FromBody] MedicineModel medicineModel)
        {
            if (ModelState.IsValid)
            {
                if (medicineModel == null)
                {
                    return BadRequest($"{nameof(medicineModel)} can not be null.");
                }

                var medicine = _mapper.Map<Medicine>(medicineModel);
                _unitOfWork.Medicines.Add(medicine);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(medicine);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("medicines/{id}")]
        [Authorize(Policies.ManageAllMedicinesPolicy)]
        public async Task<IActionResult> UpdateMedicine(int id, [FromBody] MedicineModel medicineModel)
        {
            if (ModelState.IsValid)
            {
                if (medicineModel == null)
                {
                    return BadRequest($"{nameof(medicineModel)} can not be null.");
                }

                var medicine = _unitOfWork.Medicines.Find(id);

                if (medicine == null)
                {
                    return NotFound();
                }

                _mapper.Map(medicineModel, medicine);
                _unitOfWork.Medicines.Update(medicine);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(medicine);
            }

            return BadRequest(ModelState);
        }

        [HttpGet("employees")]
        [Authorize(Policies.ViewAllUsersPolicy)]
        public async Task<IActionResult> GetEmployees([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var employees = _unitOfWork.Users.GetAll();
            int totalCount = employees.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                employees = employees
                    .Where(e => (
                        e.UserName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        e.FullName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        e.PhoneNumber.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        e.Email.Contains(query, StringComparison.OrdinalIgnoreCase)
                    ))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                employees = employees
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            List<UserViewModel> employeeVMs = new List<UserViewModel>();

            foreach (var employee in employees)
            {
                var roles = await _accountManager.GetUserRolesAsync(employee);
                var employeeVM = _mapper.Map<UserViewModel>(employee);
                employeeVM.Role = roles.FirstOrDefault();
                employeeVMs.Add(employeeVM);
            }

            return Ok(new
            {
                totalCount,
                employees = employeeVMs,
            });
        }

        [HttpGet("employees/{id}")]
        [Authorize(Policies.ViewAllUsersPolicy)]
        public async Task<IActionResult> GetEmployee(string id)
        {
            var employee = _unitOfWork.Users
                .Where(e => e.Id == id)
                .FirstOrDefault();

            if (employee == null)
            {
                return NotFound();
            }

            var roles = await _accountManager.GetUserRolesAsync(employee);
            var employeeVM = _mapper.Map<UserViewModel>(employee);
            employeeVM.Role = roles.FirstOrDefault();

            return Ok(employeeVM);
        }
    }
}
