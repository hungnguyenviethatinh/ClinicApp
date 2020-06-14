using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ClinicAPI.Authorization;
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
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetHistoriesByPatientId(int patientId)
        {
            var histories = _unitOfWork.Histories
                .GetPatientHistories(patientId)
                .OrderByDescending(h => h.CheckedDate);

            var historyVMs = _mapper.Map<IEnumerable<HistoryFullViewModel>>(histories);
            foreach (var history in histories)
            {
                foreach (var historyVM in historyVMs)
                {
                    if (history.Id == historyVM.Id)
                    {
                        var prescriptions = _mapper.Map<IEnumerable<PrescriptionViewModel>>(history.Prescriptions);
                        var doctors = _mapper.Map<IEnumerable<DoctorPatientHistoryViewModel>>(history.Doctors);
                        var xRayImages = _mapper.Map<IEnumerable<XRayViewModel>>(history.XRayImages);

                        historyVM.Prescriptions = prescriptions;
                        historyVM.Doctors = doctors;
                        historyVM.XRayImages = xRayImages;
                    }
                }
            }

            return Ok(historyVMs);
        }

        [HttpGet("patient/current/{patientId}")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatientCurrentHistory(int patientId)
        {
            var history = _unitOfWork.Histories
                .GetPatientHistories(patientId)
                .Where(h => !h.IsChecked)
                .SingleOrDefault();

            if (history == null)
            {
                return NotFound();
            }

            var historyVM = _mapper.Map<HistoryFullViewModel>(history);
            var prescriptions = _mapper.Map<IEnumerable<PrescriptionViewModel>>(history.Prescriptions);
            var doctors = _mapper.Map<IEnumerable<DoctorPatientHistoryViewModel>>(history.Doctors);
            var xRayImages = _mapper.Map<IEnumerable<XRayViewModel>>(history.XRayImages);

            historyVM.Prescriptions = prescriptions;
            historyVM.Doctors = doctors;
            historyVM.XRayImages = xRayImages;

            return Ok(new[] { historyVM, });
        }

        [HttpGet("{id}")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public async Task<IActionResult> GetHistory(int id)
        {
            var history = await _unitOfWork.Histories.GetHistory(id);
            if (history == null)
            {
                return NotFound();
            }

            var historyVM = _mapper.Map<HistoryFullViewModel>(history);
            var doctors = _mapper.Map<IEnumerable<DoctorPatientHistoryViewModel>>(history.Doctors);
            var xRayImages = _mapper.Map<IEnumerable<XRayViewModel>>(history.XRayImages);

            historyVM.Doctors = doctors;
            historyVM.XRayImages = xRayImages;


            return Ok(new[] { historyVM, });
        }
    }
}
