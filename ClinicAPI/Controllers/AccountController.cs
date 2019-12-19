using System.Threading.Tasks;
using AutoMapper;
using ClinicAPI.Helpers;
using ClinicAPI.ViewModels;
using DAL.Core.Interfaces;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountManager _accountManager;
        private readonly IMapper _mapper;
        private readonly ILogger<AccountController> _logger;


        public AccountController(IAccountManager accountManager, IMapper mapper, ILogger<AccountController> logger)
        {
            _accountManager = accountManager;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentUser()
        {
            string id = GetCurrentUserId();
            var currentUser = await _accountManager.GetUserByIdAsync(id);
            var roles = await _accountManager.GetUserRolesAsync(currentUser);

            return Ok(new[] { new { currentUser, roles } });
        }

        [HttpGet("status")]
        public async Task<IActionResult> SetUserStatus([FromQuery] bool active)
        {
            string id = GetCurrentUserId();
            var currentUser = await _accountManager.GetUserByIdAsync(id);

            if (currentUser.IsDeleted)
            {
                return Unauthorized();
            }

            currentUser.IsActive = active;

            var (Succeeded, Errors) = await _accountManager.UpdateUserAsync(currentUser);
            if (!Succeeded)
            {
                return NoContent();
            }

            return Ok();
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] UserUpdateModel userUpdateModel)
        {
            if (ModelState.IsValid)
            {
                if (userUpdateModel == null)
                {
                    return BadRequest($"{nameof(userUpdateModel)} can not be null.");
                }

                string id = GetCurrentUserId();
                var currentUser = await _accountManager.GetUserByIdAsync(id);
                if (currentUser == null)
                {
                    return NotFound();
                }

                _mapper.Map(userUpdateModel, currentUser);
                var result = await _accountManager.UpdateUserAsync(currentUser);
                if (!result.Succeeded)
                {
                    return NoContent();
                }

                if (!string.IsNullOrWhiteSpace(userUpdateModel.CurrentPassword))
                {
                    result = await _accountManager.UpdatePasswordAsync(currentUser, userUpdateModel.CurrentPassword, userUpdateModel.NewPassword);
                    if (!result.Succeeded)
                    {
                        return NoContent();
                    }
                }

                return Ok(currentUser);
            }

            return BadRequest(ModelState);
        }

        private string GetCurrentUserId()
        {
            return Utilities.GetUserId(User);
        }
    }
}
