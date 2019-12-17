using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using ClinicAPI.ViewModels;
using DAL;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
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
            var histories = _unitOfWork.Histories.GetPatientHistories(patientId);

            return Ok(histories);
        }

        [HttpGet("patient/current/{patientId}")]
        public IActionResult GetPatientCurrentHistory(int patientId)
        {
            var history = _unitOfWork.Histories
                .GetPatientHistories(patientId)
                .Where(h => !h.IsChecked)
                .FirstOrDefault();

            if (history == null)
            {
                return NotFound();
            }

            return Ok(new[] { history, });
        }
    }
}
