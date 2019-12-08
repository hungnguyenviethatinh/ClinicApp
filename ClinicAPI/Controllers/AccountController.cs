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
    [ApiController]
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
        public async Task<IActionResult> GetCurrentUser()
        {
            string id = Utilities.GetUserId(User);
            var currentUser = await _accountManager.GetUserByIdAsync(id);
            
            return Ok(new[] { currentUser, });
        }
    }
}
