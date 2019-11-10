using System.Threading.Tasks;
using ClinicAPI.Helpers;
using DAL.Core.Interfaces;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountManager _accountManager;
        private readonly ILogger<AccountController> _logger;

        public AccountController(IAccountManager accountManager, ILogger<AccountController> logger)
        {
            _accountManager = accountManager;
            _logger = logger;
        }

        [HttpGet]
        [Route("users/me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var me = await _accountManager.GetUserByIdAsync(Utilities.GetUserId(User)).ConfigureAwait(false);
            return Ok(new { Me = me });
        }
    }
}
