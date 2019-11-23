using ClinicAPI.Authorization;
using ClinicAPI.Helpers;
using ClinicAPI.ViewModels;
using DAL;
using DAL.Core;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ClinicAPI.Controllers
{
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class QueueController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public QueueController(ILogger logger, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("get-all")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        [ProducesResponseType(403)]
        [ProducesResponseType(200, Type = typeof(List<QueueViewModel>))]
        public IActionResult Get()
        {
            var queues = _unitOfWork.Queues
                .ToList()
                .OrderBy(q => q.ID);

            List<QueueViewModel> queuesVM = new List<QueueViewModel>();
            foreach (var item in queues)
            {
                var queueVM = new QueueViewModel
                {
                    Order = item.ID,
                    Patient = _unitOfWork.Patients.Find(item.PatientID),
                    Doctor = _unitOfWork.Users.Find(item.DoctorID),
                    StatusCode = item.StatusCode
                };

                queuesVM.Add(queueVM);
            }

            return Ok(queuesVM);
        }

        [HttpGet("get-by-doctor")]
        [Authorize(Roles = RoleConstants.DoctorRoleName, Policy = Policies.ViewAllPatientsPolicy)]
        [ProducesResponseType(403)]
        [ProducesResponseType(200, Type = typeof(List<QueueViewModel>))]
        public IActionResult GetByDoctor()
        {
            string id = Utilities.GetUserId(User);
            var queues = _unitOfWork.Queues
                .Where(q => q.DoctorID == id)
                .OrderBy(q => q.ID);

            List<QueueViewModel> queuesVM = new List<QueueViewModel>();
            foreach (var item in queues)
            {
                var queueVM = new QueueViewModel
                {
                    Order = item.ID,
                    Patient = _unitOfWork.Patients.Find(item.PatientID),
                    Doctor = _unitOfWork.Users.Find(item.DoctorID),
                    StatusCode = item.StatusCode
                };

                queuesVM.Add(queueVM);
            }

            return Ok(queuesVM);
        }

        [HttpPost("add-new")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        public IActionResult Add([FromBody] QueueEditModel queueModel)
        {
            if (ModelState.IsValid)
            {
                if (queueModel == null)
                {
                    return BadRequest($"{nameof(queueModel)} can not be null");
                }

                DAL.Models.Queue queue = new DAL.Models.Queue();

                int order = _unitOfWork.Queues
                    .ToList()
                    .OrderBy(q => q.ID)
                    .Last().ID;

                queue.ID = order + 1;
                queue.PatientID = queueModel.PatientID;
                queue.DoctorID = queueModel.DoctorID;
                queue.StatusCode = QueueStatus.Waiting;

                _unitOfWork.Queues.Add(queue);
                int result = _unitOfWork.SaveChanges();

                if (result > 0)
                {
                    return Ok("Add new queue successfully");
                }

                AddError("Add new queue failed");
            }

            return BadRequest(ModelState);
        }

        [HttpPut("update/{id}")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public IActionResult Update(int id, [FromBody] QueueUpdateModel queueModel)
        {
            if (ModelState.IsValid)
            {
                if (queueModel == null)
                {
                    return BadRequest($"{nameof(queueModel)} can not be null");
                }

                var queue = _unitOfWork.Queues.Find(id);
                if (queue == null)
                {
                    return NotFound();
                }

                queue.DoctorID = queueModel.DoctorID;
                queue.StatusCode = queueModel.StatusCode;

                _unitOfWork.Queues.Update(queue);
                int result = _unitOfWork.SaveChanges();

                if (result > 0)
                {
                    return Ok($"Updated queue {id} successfully");
                }

                AddError($"Update queue {id} failed");
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public IActionResult Delete(int id)
        {
            var queue = _unitOfWork.Queues.Find(id);

            if (queue == null)
            {
                return NotFound();
            }

            _unitOfWork.Queues.Remove(queue);
            int result = _unitOfWork.SaveChanges();

            if (result > 0)
            {
                return Ok($"Deleted queue {id} successfully");
            }

            return BadRequest($"Delete queue {id} failed");
        }

        [HttpDelete("delete-old")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        public IActionResult DeleteOld()
        {
            var today = DateTime.Today;
            var queues = _unitOfWork.Queues.Where(q => DateTime.Compare(q.CreatedDate, today) < 0);
            _unitOfWork.Queues.RemoveRange(queues);
            int result = _unitOfWork.SaveChanges();

            if (result > 0)
            {
                return Ok($"Deleted old queues successfully");
            }

            return BadRequest("Delete old queue failed");
        }

        [HttpDelete("delete-all")]
        [Authorize(Policies.ManageAllPatientsPolicy)]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        public IActionResult DeleteAll()
        {
            var queues = _unitOfWork.Queues.ToList();
            _unitOfWork.Queues.RemoveRange(queues);
            int result = _unitOfWork.SaveChanges();

            if (result > 0)
            {
                return Ok($"Deleted all queues successfully");
            }

            return BadRequest("Delete all queue failed");
        }

        private void AddError(string error, string key = "")
        {
            ModelState.AddModelError(key, error);
        }
    }
}
