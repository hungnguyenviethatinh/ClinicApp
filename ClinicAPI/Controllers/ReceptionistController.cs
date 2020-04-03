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
            var data = doctors.Where(d => !d.IsDeleted).Select(i => new { i.Id, i.FullName });

            return Ok(data);
        }

        [HttpGet("patients")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatients([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var patients = _unitOfWork.Patients.GetPatients();
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
                    .OrderByDescending(p => p.UpdatedDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                patients = patients
                    .OrderByDescending(p => p.UpdatedDate)
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
            IEnumerable<Patient> patients = _unitOfWork.Patients
                .GetPatients()
                .Where(p =>
                (p.Status != PatientStatus.IsChecked &&
                (p.AppointmentDate == null || p.AppointmentDate <= DateTime.Now)))
                //.OrderBy(p => p.UpdatedDate);
                .OrderBy(p => p.OrderNumber);

            return Ok(patients);
        }

        [HttpGet("patients/{id}")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _unitOfWork.Patients.GetPatient(id);
            if (patient == null)
            {
                return NotFound();
            }

            return Ok(new[] { patient, });
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
                int orderNumber = CalculateOrderNumber(patient);
                patient.OrderNumber = orderNumber;

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

        [HttpPost("doctors")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> AddDoctors([FromBody] IEnumerable<DoctorPatientHistoryModel> doctorModels)
        {
            if (ModelState.IsValid)
            {
                if (doctorModels == null)
                {
                    return BadRequest($"{nameof(doctorModels)} can not be null.");
                }

                IEnumerable<DoctorPatientHistory> doctors = _mapper.Map<IEnumerable<DoctorPatientHistory>>(doctorModels);
                _unitOfWork.DoctorPatientHistories.AddRange(doctors);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest();
        }

        [HttpPut("patients/{id}")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientModel patientModel)
        {
            if (ModelState.IsValid)
            {
                if (patientModel == null)
                {
                    return BadRequest($"{nameof(patientModel)} can not be null.");
                }

                var patient = _unitOfWork.Patients.Find(id);
                if (patient == null)
                {
                    return NotFound();
                }

                _mapper.Map(patientModel, patient);
                int orderNumber = CalculateOrderNumber(patient);
                patient.OrderNumber = orderNumber;
                _unitOfWork.Patients.Update(patient);

                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(patient);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("histories/{patientId}")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> UpdateHistory(int patientId, [FromBody] HistoryModel historyModel)
        {
            if (ModelState.IsValid)
            {
                if (historyModel == null)
                {
                    return BadRequest($"{nameof(historyModel)} can not be null.");
                }

                int result = 0;

                var history = _unitOfWork.Histories
                    .Where(h => h.PatientId == patientId && !h.IsChecked)
                    .FirstOrDefault();

                if (history == null)
                {
                    history = _mapper.Map<History>(historyModel);
                    _unitOfWork.Histories.Add(history);
                    result = await _unitOfWork.SaveChangesAsync();
                    if (result < 1)
                    {
                        return NoContent();
                    }

                    return Ok(history);
                }

                _mapper.Map(historyModel, history);
                _unitOfWork.Histories.Update(history);
                result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(history);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("xrays/{historyId}")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> UpdateXrays(int historyId, [FromBody] IEnumerable<XRayModel> xRayModels)
        {
            if (ModelState.IsValid)
            {
                if (xRayModels == null)
                {
                    return BadRequest($"{nameof(xRayModels)} can not be null.");
                }

                int result = 0;
                var xRayImages = _unitOfWork.XRayImages.Where(x => (x.HistoryId == historyId && !x.IsDeleted));
                if (xRayImages.Any())
                {
                    foreach (var xRayImage in xRayImages)
                    {
                        xRayImage.IsDeleted = true;
                    }

                    _unitOfWork.XRayImages.UpdateRange(xRayImages);
                    result = await _unitOfWork.SaveChangesAsync();
                    if (result < 1)
                    {
                        return NoContent();
                    }
                }

                var newXRayImages = _mapper.Map<IEnumerable<XRayImage>>(xRayModels);

                _unitOfWork.XRayImages.AddRange(newXRayImages);
                result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest(ModelState);
        }

        [HttpPut("doctors/{historyId}")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> UpdateDoctors(int historyId, [FromBody] IEnumerable<DoctorPatientHistoryModel> doctorModels)
        {
            if (ModelState.IsValid)
            {
                if (doctorModels == null)
                {
                    return BadRequest($"{nameof(doctorModels)} can not be null.");
                }

                int result = 0;
                var doctors = _unitOfWork.DoctorPatientHistories.Where(d => d.HistoryId == historyId);
                if (doctors.Any())
                {
                    _unitOfWork.DoctorPatientHistories.RemoveRange(doctors);
                    result = await _unitOfWork.SaveChangesAsync();
                    if (result < 1)
                    {
                        return NoContent();
                    }
                }

                var newDoctors = _mapper.Map<IEnumerable<DoctorPatientHistory>>(doctorModels);
                _unitOfWork.DoctorPatientHistories.AddRange(newDoctors);
                result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest();
        }

        [HttpDelete("patients/{id}")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = _unitOfWork.Patients.Find(id);
            if (patient == null)
            {
                return NotFound();
            }

            patient.IsDeleted = true;
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
        public IActionResult GetPrescriptions([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var prescriptions = _unitOfWork.Prescriptions.GetPrescriptions();
            int totalCount = prescriptions.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                //int.TryParse(query, out int id);

                prescriptions = prescriptions
                    .Where(p =>
                        //p.PatientId == id ||
                        (query.Contains($"{p.IdCode}{p.Id}", StringComparison.OrdinalIgnoreCase)) ||
                        p.Patient.FullName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        p.Doctor.FullName.Contains(query, StringComparison.OrdinalIgnoreCase))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                prescriptions = prescriptions
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            return Ok(new[]
            {
                new
                {
                    totalCount,
                    prescriptions,
                },
            });
        }

        [HttpGet("prescriptions/queue")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptionsInQueue()
        {
            var prescriptions = _unitOfWork.Prescriptions
                .GetRcptPrescriptions()
                .Where(p => p.Status == PrescriptionStatus.IsNew)
                .OrderBy(p => p.UpdatedDate);

            return Ok(prescriptions);
        }

        [HttpGet("prescriptions/{id}")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public async Task<IActionResult> GetPrescription(int id)
        {
            var prescription = await _unitOfWork.Prescriptions.GetRcptPrescription(id);
            if (prescription == null)
            {
                return NotFound();
            }

            return Ok(new[] { prescription, });
        }

        private int CalculateOrderNumber(Patient patient)
        {
            int orderNumber = 1;
            DateTime currentDate = DateTime.Now.Date;

            var patients = _unitOfWork.Patients
                .Where(p =>
                (!p.IsDeleted &&
                p.Status != PatientStatus.IsChecked &&
                (((p.CreatedDate.Date == currentDate || p.UpdatedDate == currentDate) && p.AppointmentDate == null) ||
                p.AppointmentDate.Value.Date == currentDate)))
                .OrderBy(p => p.OrderNumber);

            if (patients.Any())
            {
                orderNumber = patients.Last().OrderNumber + 1;
            }

            if (patient.AppointmentDate != null)
            {
                DateTime appointmentDate = patient.AppointmentDate.Value.Date;
                if (appointmentDate > currentDate)
                {
                    var appointedPatients = _unitOfWork.Patients
                        .Where(p =>
                        (!p.IsDeleted &&
                        p.Status != PatientStatus.IsChecked &&
                        p.AppointmentDate.Value.Date == appointmentDate))
                        .OrderBy(p => p.OrderNumber);

                    if (patients.Any())
                    {
                        orderNumber = patients.Last().OrderNumber + 1;
                    }
                }
            }

            return orderNumber;
        }
    }
}
