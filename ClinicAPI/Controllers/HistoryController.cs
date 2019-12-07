using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DAL;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public HistoryController(IMapper mapper, IUnitOfWork unitOfWork, ILogger<HistoryController> logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("patient/{patientId}")]
        public IActionResult GetHistoriesByPatientId(int patientId)
        {
            var histories = _unitOfWork.Histories.Where(h => h.PatientId == patientId).OrderByDescending(h => h.CreatedDate);
            foreach(var history in histories)
            {
                var doctor = _unitOfWork.Users.Find(history.DoctorId);
                history.Doctor = doctor;
            }

            return Ok(histories);
        }
    }
}