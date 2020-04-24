using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ClinicAPI.Authorization;
using ClinicAPI.Helpers;
using ClinicAPI.ViewModels.ServiceForm;
using DAL;
using DAL.Models.ServiceForm;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceFormController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public ServiceFormController(IMapper mapper, IUnitOfWork unitOfWork, ILogger<DoctorController> logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("ctforms")]
        [Authorize(Policies.ViewAllServiceFormsPolicy)]
        public IActionResult GetCtForms()
        {
            var ctForms = _unitOfWork.CtForms
                .GetCtForms()
                .Where(f => f.DateCreated.Date == DateTime.Today)
                .OrderByDescending(f => f.Id);
            var ctFormVMs = _mapper.Map<IEnumerable<CtFormViewModel>>(ctForms);

            return Ok(ctFormVMs);
        }

        [HttpGet("mriforms")]
        [Authorize(Policies.ViewAllServiceFormsPolicy)]
        public IActionResult GetMriForms()
        {
            var mriForms = _unitOfWork.MriForms
                .GetMriForms()
                .Where(f => f.DateCreated.Date == DateTime.Today)
                .OrderByDescending(f => f.Id);
            var mriFormVMs = _mapper.Map<IEnumerable<MriFormViewModel>>(mriForms);

            return Ok(mriFormVMs);
        }

        [HttpGet("testforms")]
        [Authorize(Policies.ViewAllServiceFormsPolicy)]
        public IActionResult GetTestForms()
        {
            var testForms = _unitOfWork.TestForms
                .GetTestForms()
                .Where(f => f.DateCreated.Date == DateTime.Today)
                .OrderByDescending(f => f.Id);
            var testFormVMs = _mapper.Map<IEnumerable<TestFormViewModel>>(testForms);

            return Ok(testFormVMs);
        }

        [HttpGet("xqforms")]
        [Authorize(Policies.ViewAllServiceFormsPolicy)]
        public IActionResult GetXqForms()
        {
            var xqForms = _unitOfWork.XqForms
                .GetXqForms()
                .Where(f => f.DateCreated.Date == DateTime.Today)
                .OrderByDescending(f => f.Id);
            var xqFormVMs = _mapper.Map<IEnumerable<XqFormViewModel>>(xqForms);

            return Ok(xqFormVMs);
        }

        [HttpGet("ctform/{id}")]
        [Authorize(Policies.ViewAllServiceFormsPolicy)]
        public async Task<IActionResult> GetCtForm(int id)
        {
            var ctForm = await _unitOfWork.CtForms.GetCtForm(id);
            if (ctForm == null)
            {
                return NotFound();
            }

            var ctFormVM = _mapper.Map<CtFormViewModel>(ctForm);

            return Ok(new[] { ctFormVM });
        }

        [HttpGet("mriform/{id}")]
        [Authorize(Policies.ViewAllServiceFormsPolicy)]
        public async Task<IActionResult> GetMriForm(int id)
        {
            var mriForm = await _unitOfWork.MriForms.GetMriForm(id);
            if (mriForm == null)
            {
                return NotFound();
            }

            var mriFormVM = _mapper.Map<MriFormViewModel>(mriForm);

            return Ok(new[] { mriFormVM });
        }

        [HttpGet("testform/{id}")]
        [Authorize(Policies.ViewAllServiceFormsPolicy)]
        public async Task<IActionResult> GetTestForm(int id)
        {
            var testForm = await _unitOfWork.TestForms.GetTestForm(id);
            if (testForm == null)
            {
                return NotFound();
            }

            var testFormVM = _mapper.Map<TestFormViewModel>(testForm);

            return Ok(new[] { testFormVM });
        }

        [HttpGet("xqform/{id}")]
        [Authorize(Policies.ViewAllServiceFormsPolicy)]
        public async Task<IActionResult> GetXqForm(int id)
        {
            var xqForm = await _unitOfWork.XqForms.GetXqForm(id);
            if (xqForm == null)
            {
                return NotFound();
            }

            var xqFormVM = _mapper.Map<XqFormViewModel>(xqForm);

            return Ok(new[] { xqFormVM });
        }

        [HttpDelete("ctform/{id}")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> DeleteCtForm(int id)
        {
            var ctForm = _unitOfWork.CtForms.Find(id);
            if (ctForm == null)
            {
                return Ok();
            }

            _unitOfWork.CtForms.Remove(ctForm);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok();
        }

        [HttpDelete("mriform/{id}")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> DeleteMriForm(int id)
        {
            var mriForm = _unitOfWork.MriForms.Find(id);
            if (mriForm == null)
            {
                return Ok();
            }

            _unitOfWork.MriForms.Remove(mriForm);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok();
        }

        [HttpDelete("testform/{id}")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> DeleteTestForm(int id)
        {
            var testForm = _unitOfWork.TestForms.Find(id);
            if (testForm == null)
            {
                return Ok();
            }

            _unitOfWork.TestForms.Remove(testForm);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok();
        }

        [HttpDelete("xqform/{id}")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> DeleteXqForm(int id)
        {
            var xqForm = _unitOfWork.XqForms.Find(id);
            if (xqForm == null)
            {
                return Ok();
            }

            _unitOfWork.XqForms.Remove(xqForm);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok();
        }

        [HttpPut("ctform/{id}")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> UpdateCtForm(int id, [FromBody] CtFormUpdateModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var ctForm = _unitOfWork.CtForms.Find(id);
                if (ctForm == null)
                {
                    return NotFound();
                }

                _mapper.Map(model, ctForm);
                _unitOfWork.CtForms.Update(ctForm);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(ctForm);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("mriform/{id}")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> UpdateMriForm(int id, [FromBody] MriFormUpdateModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var mriForm = _unitOfWork.MriForms.Find(id);
                if (mriForm == null)
                {
                    return NotFound();
                }

                _mapper.Map(model, mriForm);
                _unitOfWork.MriForms.Update(mriForm);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(mriForm);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("testform/{id}")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> UpdateTestForm(int id, [FromBody] TestFormUpdateModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var testForm = _unitOfWork.TestForms.Find(id);
                if (testForm == null)
                {
                    return NotFound();
                }

                _mapper.Map(model, testForm);
                _unitOfWork.TestForms.Update(testForm);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(testForm);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("xqform/{id}")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> UpdateXqForm(int id, [FromBody] XqFormUpdateModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var xqForm = _unitOfWork.XqForms.Find(id);
                if (xqForm == null)
                {
                    return NotFound();
                }

                _mapper.Map(model, xqForm);
                _unitOfWork.XqForms.Update(xqForm);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(xqForm);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("ctform")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> AddCtForm([FromBody] CtFormAddModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var ctForm = _mapper.Map<CtForm>(model);
                ctForm.DoctorId = GetCurrentUserId();

                _unitOfWork.CtForms.Add(ctForm);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(ctForm);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("mriform")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> AddMriForm([FromBody] MriFormAddModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var mriForm = _mapper.Map<MriForm>(model);
                mriForm.DoctorId = GetCurrentUserId();

                _unitOfWork.MriForms.Add(mriForm);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(mriForm);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("testform")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> AddTestForm([FromBody] TestFormAddModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var testForm = _mapper.Map<TestForm>(model);
                testForm.DoctorId = GetCurrentUserId();

                _unitOfWork.TestForms.Add(testForm);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(testForm);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("xqform")]
        [Authorize(Policies.ManageAllServiceFormsPolicy)]
        public async Task<IActionResult> AddXqForm([FromBody] XqFormAddModel model)
        {
            if (ModelState.IsValid)
            {
                if (model == null)
                {
                    return BadRequest($"{nameof(model)} can not be null.");
                }

                var xqForm = _mapper.Map<XqForm>(model);
                xqForm.DoctorId = GetCurrentUserId();

                _unitOfWork.XqForms.Add(xqForm);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(xqForm);
            }

            return BadRequest(ModelState);
        }

        private string GetCurrentUserId()
        {
            return Utilities.GetUserId(User);
        }
    }
}
