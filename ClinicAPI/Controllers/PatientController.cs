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
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public PatientController(ILogger logger, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("get-all")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        [ProducesResponseType(200)]
        [ProducesResponseType(403)]
        public IActionResult Get()
        {
            var patients = _unitOfWork.Patients.ToList();

            return Ok(patients);
        }

        [HttpGet("get-by-doctor")]
        [Authorize(Roles = RoleConstants.DoctorRoleName, Policy = Policies.ViewAllPatientsPolicy)]
        [ProducesResponseType(200)]
        [ProducesResponseType(403)]
        public IActionResult GetByDoctor()
        {
            string id = Utilities.GetUserId(User);
            var patients = _unitOfWork.Patients.Where(p => p.DoctorID == id);

            return Ok(patients);
        }
    }
}